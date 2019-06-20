var express = require('express');
var router = express.Router();

const LandRegistry = require('../../../db/models/LandRegistry').LandRegistry;

/**
 * @desc - Create an entry in the land registry database
 */
router.post('/add-entry', (req, res, next) => {
	let property_uid = req.body.property_uid;
	let title_deed_hash = req.body.title_deed_hash;
	let owner_id = req.body.owner_id;
	LandRegistry.create({
		property_uid: property_uid,
		owner_id: owner_id,
		title_deed_hash: title_deed_hash
	}, (err, entry) => {
		console.log(typeof entry)
		if (typeof entry === 'undefined') {
			res.json({
				error: 'UID exists'
			});
		} else {
			res.json({
				message: 'Property was successfully registered'
			});
		}
	});
});

/**
 * @desc - Get properties by owner in the land registry database
 */
router.get('/get-entries', (req, res, next) => {
	let owner_id = req.query.owner_id
	LandRegistry.find({
		owner_id: owner_id
	}, (err, results) => {
		res.json({
			results
		});
	});
});

/**
 * @desc - Get single land registry entry by property UID
 */
router.get('/get-entry', (req, res, next) => {
	let property_uid = req.query.property_uid
	LandRegistry.findOne({
		property_uid: property_uid
	}, (err, entry) => {
		res.json({
			entry
		});
	});
});

/**
 * @desc - Update a land registry entry with the new property owner's details 
 */
router.put('/update-entry', (req, res, next) => {

	let old_owner_id = req.body.old_owner_id;
	let old_property_uid = req.body.old_property_uid

	let new_owner_id = req.body.new_owner_id;
	let new_property_uid = req.body.new_property_uid;

	LandRegistry.findOneAndUpdate({
		owner_id: old_owner_id,
		property_uid: old_property_uid
	}, { owner_id: new_owner_id, property_uid: new_property_uid }, (err, result) => {
		res.json({
			result
		});
	});
});

module.exports = router;
