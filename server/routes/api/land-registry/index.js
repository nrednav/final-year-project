var express = require('express');
var router = express.Router();

const LandRegistry = require('../../../db/models/LandRegistry').LandRegistry;

/* Add entry */
router.post('/add-entry', (req, res, next) => {
	let title_deed_hash = req.body.title_deed_hash;
	let owner_name = req.body.owner_name;
	LandRegistry.create({
		title_deed_hash: title_deed_hash,
		owner_name: owner_name
	}, (err, entry) => {
		console.log(entry)
		res.json({
			message: 'Title deed was successfully registered'
		});
	});
});

/* Get entry */
router.get('/get-entry', (req, res, next) => {
	let owner_name = req.body.owner_name;
	console.log(owner_name);
	LandRegistry.find({
		owner_name: owner_name
	}, (err, results) => {
		res.json({
			results
		});
	});
});

/* Update entry */
router.put('/update-entry', (req, res, next) => {
	let old_owner_name = req.body.old_owner_name;
	let title_deed_hash = req.body.title_deed_hash;
	let new_owner_name = req.body.new_owner_name;
	LandRegistry.findOneAndUpdate({
		owner_name: old_owner_name,
		title_deed_hash: title_deed_hash
	}, { owner_name: new_owner_name }, (err, result) => {
		console.log(result);
		res.json({
			result
		});
	});
});

module.exports = router;
