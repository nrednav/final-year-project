// Import dependencies
var express = require('express');
var mongoose = require('mongoose');
var path = require('path');
var router = express.Router();
var multer = require('multer');
var crypto = require('crypto');
var grid_fs_storage = require('multer-gridfs-storage');
var grid = require('gridfs-stream');
grid.mongo = mongoose.mongo;
var axios = require('axios');

var Property = require('../../../db/models/Property').Property;
var User = require('../../../db/models/User').User;


/**
 * DB Configuration
 */

const mongo_uri = 'mongodb://localhost:27017/fyp';
const conn = mongoose.createConnection(mongo_uri, {
	useNewUrlParser: true
});

let gfs;
conn.once('open', () => {
	gfs = grid(conn.db);
});

/**
 * Configure multer
 */
var storage = new grid_fs_storage({
	url: 'mongodb://localhost:27017/fyp',
	file: (req, file) => {
		return new Promise((resolve, reject) => {
			crypto.randomBytes(16, (err, buf) => {
				if (err) {
					return reject(err);
				}

				const filename = buf.toString('hex') + path.extname(file.originalname);
				const file_info = {
					filename: filename,
					bucketname: 'uploads'
				};
				resolve(file_info);
			});
		});
	}
});
const upload = multer({ storage });


/**
 * @desc - parse and execute property search queries
 */
router.get('/search', (req, res, next) => {
	let country = req.query.country
	let city = req.query.city
	let type = req.query.type
	let min_price = req.query.minprice;
	let max_price = req.query.maxprice;
	let bed_count = Number(req.query.bedcount);
	let bath_count = Number(req.query.bathcount);

	Property.find({
		$and: [
			{ 'details.address.country': country },
			{ 'details.address.city': city },
			{
				$or: [
					{ 'details.type': { $eq: type }},
					{ 'details.listing_price': {
						$gt: min_price,
						$lt: max_price
					}}
				]
			},
			{
				'details.bedroom_count': {
					$lte: bed_count
				}
			},
			{
				'details.bathroom_count': {
					$lte: bath_count
				}
			},
			{ listed: true }
		]
	}, (err, properties) => {
		if (err) console.log(err);
		console.log(properties);
		res.json({
			properties
		});
	});
});

/**
 * @desc - Get all properties in database
 */
router.get('/', function(req, res, next) {
	Property.find((err, docs) => {
		if (err) console.error(err);
		res.json({
			docs: docs
		});
	});
});

/**
 * @desc - Find properties using an array of property ID's
 */
router.post('/find-by-ids', (req, res, next) => {
	var property_ids = JSON.parse(req.body.propertyIds);
	Property.find({
		_id: {$in: property_ids}
	}, (err, result) => {
		if (err) console.error(err);
		res.json({
			properties: result
		});
	});
});

/**
 * @desc - Get property by property ID
 */
router.get('/:property_id', (req, res, next) => {
	const property_id = req.params.property_id;
	Property.findOne({
		_id: property_id
	}, (err, result) => {
		if (err) console.error(err);
		res.json({
			result: result
		});
	});
});

/**
 * @desc - Get images beloning to a single property
 */
router.get('/:property_id/images/:image_id', (req, res, next) => {
	let imageId = req.params.image_id
	console.log(imageId)
	imageId = new mongoose.Types.ObjectId(imageId)
	gfs.files.findOne({ _id: imageId }, (err, file) => {
		if (err) throw err;

		console.log(file);
		res.contentType(file.contentType);
		res.send(file);
	});
});


/**
 * @desc - Update a property's listing status
 */
router.put('/:property_id/list', (req, res, next) => {
	console.log(req.body.listed)
	console.log(req.params.property_id)

	// Update property listed status
	Property.updateOne({
		_id: req.params.property_id
	}, {$set: { listed: req.body.listed }}, (err, result) => {

		var inc_amount;
		if (req.body.listed) {
			// Increment listed count if listing set to true
			User.updateOne({
				_id: req.body.user_id
			}, { $inc: { 'profiles.seller.listed_count': 1 }}, (err, result) => {
				if (err) console.log(err);
				console.log('Updated listed count on user profile', result);
				res.json({
					result
				});
			});
		} else {
			// Decrement listed count if listing set to false
			User.updateOne({
				_id: req.body.user_id
			}, { $inc: { 'profiles.seller.listed_count': -1 }}, (err, result) => {
				if (err) console.log(err);
				console.log('Updated listed count on user profile', result);
				res.json({
					result
				});
			});
		}
	});
});

/**
 * @desc - Adds offer submitted by buyer to list of offers on property
 */
router.post('/:property_id/add-offer', (req, res, next) => {
	const body = req.body
	const offer = {
		buyer_id: body.user_id,
		buyer_account_address: body.buyer_account_address,
		buyer_name: req.body.buyer_name,
		price: body.offer
	}

	// Add the offer to the property
	Property.updateOne({
		_id: body.property_id
	}, {
		$push: {
			'offers': offer
		}
	}, (err, result) => {
		if (err) console.log(err);

		// Add the offer to the buyer's list of offers
		User.updateOne({
			_id: req.body.user_id
		}, {
			$push: {
				'profiles.buyer.offers': {
					property_id: req.params.property_id,
					price: req.body.offer
				}
			}
		}, (err, result) => {
			if (err) console.log(err);
			console.log(result);
			res.json({
				result
			});
		});
	});
});

/**
 * @desc- General route handler that updates a property using object submitted
 */
router.put('/:property_id/update', (req, res, next) => {
	console.log('Got request....');
	console.log('Options received are:-');
	console.log(req.body.options);
	console.log(req.body);
	console.log('Commiting update now...');
	Property.updateOne({
		_id: req.params.property_id
	}, {$set: req.body.options}, (err, result) => {
		if (err) console.log(err);
		console.log(result);
		res.json({
			result
		});
	});
});

/**
 * @desc - Create a property in the property database using details submitted by seller
 */
router.post('/create', upload.array('files'), (req, res, next) => {
	let new_property = JSON.parse(req.body.property);
	Property.findOne({
		name: new_property.details.name,
		description: new_property.details.description,
		address: new_property.details.address
	})
		.then(property => {
			if (property) {
				console.log(property);
				handleError("Property with those details already exists", res, next);
			}
			else {
				console.log("Creating a new property");

				new_property.details.images = []
				for (var i in req.files) {
					console.log(req.files[i]);
					new_property.details.images[i] = req.files[i].id;
				}

				Property.create(new_property, async (error, result) => {
					if (error) {
						console.log(error);
						res.send(error.name);
					}
					else {
						let property_id = result._id;
						User.updateOne({
							_id: result.details.owner
						}, { $push: { 'profiles.seller.properties': property_id }}, (err) => {
							if (err) handleError(err, res, next);
							console.log(`Successfully added property ${result._id} to user ${result.details.owner}`);
							res.json({
								result
							});
						});
					}
				});
			}
		});
});

/**
 * @desc- Initiates deletion of a property from the property database
 */
router.delete('/delete/:property_id', (req, res, next) => {

	let image_ids = []

	// Get image id's
	Property.findOne({
		_id: req.params.property_id
	}, (err, property) => {
		image_ids = property.details.images;

		for (var i in image_ids) {
			deletePropertyImage(image_ids[i]);
		}

		deleteProperty(property, req.params.property_id, res, next);
	});
});

/**
 * @desc - Removes the offer and initiates a session
 */
router.post('/:property_id/offers/accept', (req, res, next) => {
	Property.updateOne({
		_id: req.params.property_id,
		'offers._id': req.body.offerId
	},{
		$pull: { 'offers': { _id: req.body.offerId } },
		$set: { 'session_underway': true }
	},(err, result) => {
		if (err) console.log(err);
		console.log('Updated property, removed offer and set session underway to true');
		var details = {
			buyer_id: req.body.buyerId,
			seller_id: req.body.sellerId,
			property_id: req.params.property_id,
			buyer_address: req.body.buyerAddress,
			seller_address: req.body.sellerAddress,
			agreed_sale_price: req.body.listingPrice
		}
		console.log('Requesting creaiton of session now');
		createSession(details, res, next);
	});
});

/**
 * @desc - Removes the offer from the associated property
 */
router.post('/:property_id/offers/reject', (req, res, next) => {
	Property.updateOne({
		_id: req.params.property_id,
		'offers._id': req.body.offerId
	},{
		$pull: { 'offers': { _id: req.body.offerId } }
	},(err, result) => {
		if (err) console.log(err);
		console.log(result);
		res.json({
			result
		});
	});
});

/**
 * @desc - Requests creation of a session using the session API
 * @params
 *		- details: Buyer's and seller's information required for session creation
 */
function createSession(details, res, next) {
	console.log('Creating a session with the following details...\n' + details);
	axios.post('http://localhost:3000/api/sessions/create', details, {
		headers: {
			Authorization: 'a1b2c3d4e5f6g7'
		}
	}).then((response) => {
		res.json({
			message: 'Session was created successfully'
		});
	}).catch((error) => console.log(error));
}

/**
 * @desc - Delete's a property image from the gridFS store
 * @params
 *		- image_id: Object ID of the file to remove
 */
function deletePropertyImage(image_id) {
	gfs.remove({
		_id: image_id
	}, (err, gridStore) => {
		if (err) console.log(err);
	});
}

/**
 * @desc - Remove's a property from the properties database
 */
function deleteProperty(property, property_id, res, next) {
	Property.deleteOne({
		_id: property_id
	}, (err) => {
		if (err) handleError(err, res, next);
		updateProfileCounts(property.details.owner, res, next);
	});
}

/**
 * @desc - Update's the property meta information counts that will be 
 * displayed on the seller's dashboard
 */
function updateProfileCounts(owner_id, res, next) {
	User.updateOne({
		_id: owner_id,
		$and: [
			{ 'profiles.seller.listed_count': {
				$ne: 0
			}},
			{ 'profiles.seller.verified_count': {
				$ne: 0
			}}
		],
	}, { $inc: { 'profiles.seller.listed_count': -1,
	'profiles.seller.verified_count': -1 }}, (err, result) => {
		if (err) console.log(err);
		console.log('Updated listed count on user profile', result);
		res.json({
			result
		});
	});
}

// Error handling
function handleError(errorMsg, res, next) {
	const error = new Error(errorMsg);
	next(error);
}

module.exports = router;
