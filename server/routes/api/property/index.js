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

// DB Setup
const mongo_uri = 'mongodb://localhost:27017/fyp';

// Create connection
const conn = mongoose.createConnection(mongo_uri, {
	useNewUrlParser: true
});

let gfs;
conn.once('open', () => {
	gfs = grid(conn.db);
});

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


/* SEARCH for properties via text indexing */
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

/* GET property listing. */
router.get('/', function(req, res, next) {
	Property.find((err, docs) => {
		if (err) console.error(err);
		res.json({
			docs: docs
		});
	});
});

/* GET property by id*/
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

/* GET property images */
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


/* PUT - update property details */
router.put('/:property_id/list', (req, res, next) => {
	console.log(req.body.listed)
	console.log(req.params.property_id)

	// Update property listed status
	Property.updateOne({
		_id: req.params.property_id
	}, {$set: { listed: req.body.listed }}, (err, result) => {
		// Update listed count on user profile
		var inc_amount;
		if (req.body.listed) {
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

/* PUT - update property with options */
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

/* POST - create a property */
router.post('/create', upload.array('files'), (req, res, next) => {
	let new_property = JSON.parse(req.body.property);
	console.log(new_property);
	console.log(req.files);
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
				console.log(new_property.details.images);
				Property.create(new_property, async (error, result) => {
					if (error) {
						console.log(error);
						res.send(error.name);
					}
					else {
						console.log(result);
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

/* DELETE - delete a property */
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

function deletePropertyImage(image_id) {
	gfs.remove({
		_id: image_id
	}, (err, gridStore) => {
		if (err) console.log(err);
	});
}

// Delete property by id
function deleteProperty(property, property_id, res, next) {
	Property.deleteOne({
		_id: property_id
	}, (err) => {
		if (err) handleError(err, res, next);
		updateProfileCounts(property.details.owner, res, next);
	});
}

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
