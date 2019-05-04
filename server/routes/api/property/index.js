var express = require('express');
var router = express.Router();

const Property = require('../../../db/models/Property').Property;

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

/* POST - create a property */
router.post('/create', (req, res, next) => {
	Property.findOne({
		name: req.body.details.name,
		description: req.body.details.description,
		address: req.body.details.address
	})
	.then(property => {
		if (property) {
			console.log(property);
			handleError("Property with those details already exists", res, next);
		}
		else {
			console.log("Creating a new property");
			const new_property = req.body
			Property.create(new_property, (error, result) => {
				if (error) {
					console.log(error.name);
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
