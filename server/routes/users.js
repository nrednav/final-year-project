var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();

const User = require('../db/models/User').User;
const Property = require('../db/models/Property').Property;
const Session = require('../db/models/Session').Session;

/* GET - users listing. */
router.get('/', function(req, res, next) {
	res.send('...');
});

/* GET - User by ID */
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

/* GET - Properties owned by a user */
router.get('/:user_id/properties', (req, res, next) => {

	const user_id = new mongoose.Types.ObjectId(req.params.user_id);

	User.findOne({
		_id: user_id
	}, (err, result) => {
		if (err) console.error(err);

		let property_ids = result.profiles.seller.properties;

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

/* GET - Sessions that a user is part of */
router.get('/:user_id/:user_type/sessions', (req, res, next) => {

	const user_id = new mongoose.Types.ObjectId(req.params.user_id);
	const user_type = req.params.user_type

	User.findOne({
		_id: user_id
	}, (err, result) => {
		if (err) console.log(err);
		var session_ids = [];

		if (user_type == 'seller') {
			session_ids = result.profiles.seller.sessions;
		} else if (user_type == 'buyer') {
			session_ids = result.profiles.buyer.sessions;
		}

		Session.find({
			_id: {$in: session_ids}
		}, (err, result) => {
			if (err) console.error(err);
			res.json({
				sessions: result
			});
		});
	});

});

/* PUT - Remove property from user's owned properties */
router.put('/:user_id/remove/:property_id', (req, res, next) => {

	console.log(req.params);

	let user_id = new mongoose.Types.ObjectId(req.params.user_id)
	let property_id = new mongoose.Types.ObjectId(req.params.property_id)

	User.update({}, {
		$pull: {
			'profiles.seller.properties':  property_id
		}
	}, {
		multi: true
	}, (err, result) => {
		res.json({
			result
		});
	});

});

module.exports = router;
