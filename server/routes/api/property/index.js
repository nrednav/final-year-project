var express = require('express');
var mongoose = require('mongoose');
var path = require('path');
var router = express.Router();
var multer = require('multer');
var crypto = require('crypto');
var grid_fs_storage = require('multer-gridfs-storage');
var grid = require('gridfs-stream');

var Property = require('../../../db/models/Property').Property;

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
router.get('/get/:property_id', (req, res, next) => {
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


// DB Setup
const mongo_uri = 'mongodb://localhost:27017/fyp';

	// Create connection
const conn = mongoose.createConnection(mongo_uri, {
	useNewUrlParser: true
});

let gfs;
conn.once('open', () => {
	gfs = grid(conn.db, mongoose.mongo);
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
				new_property.details.images[i] = (req.files[i].id);
			}
			Property.create(new_property, (error, result) => {
				if (error) {
					console.log(error);
					res.send(error.name);
				}
				else {
					res.json({
						result
					});
				}
			});
		}
	});
});

/* DELETE - delete a property */
router.delete('/delete/:property_id', (req, res, next) => {
	Property.deleteOne({
		_id: req.params.property_id
	}, (err) => {
		if (err) handleError(err, res, next);
		res.send(`Property ${req.params.property_id} was deleted successfully`);
	});
});

// Error handling
function handleError(errorMsg, res, next) {
	const error = new Error(errorMsg);
	next(error);
}

module.exports = router;
