var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();

const User = require('../db/models/User').User;
const Property = require('../db/models/Property').Property;

/* GET users listing. */
router.get('/', function(req, res, next) {
	res.send('respond with a resource');
});

/* GET user */
router.get('/get/:id', (req, res, next) => {
	const user_id = req.params.id;
	User.findOne({
		_id: user_id
	}, (err, result) => {
		if (err) console.error(err);
		var user = result.toObject();
		delete user['password'];
		res.json({
			user
		});
	});
});

/* GET user properties */
router.get('/:user_id/properties', (req, res, next) => {
	const user_id = new mongoose.Types.ObjectId(req.params.user_id);
	User.findOne({
		_id: user_id
	}, (err, result) => {
		if (err) console.error(err);
		let property_ids = result.profiles.seller.properties;
		let my_properties = [];
		Property.find({
			_id: {$in: property_ids}
		}, (err, result) => {
			if (err) console.error(err);
			res.json({
				properties: result
			});
		});
	});
});

function getProperty(property_id) {
	Property.findOne({
		_id: property_id
	}, (err, result) => {
		if (err) console.error(err);
		console.log(result);
	});
}

module.exports = router;
