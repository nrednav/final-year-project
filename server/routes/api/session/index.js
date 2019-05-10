var express = require('express');
var router = express.Router();

const Session = require('../../../db/models/Session').Session;
const User = require('../../../db/models/User').User;

/* GET session listing. */
router.get('/', function(req, res, next) {
	Session.find((err, docs) => {
		if (err) console.error(err);
		res.json({
			docs: docs
		});
	});
});

/* GET session by id*/
router.get('/get/:session_id', (req, res, next) => {
	const session_id = req.params.session_id;
	Session.findOne({
		_id: session_id
	}, (err, result) => {
		if (err) console.error(err);
		res.json({
			result: result
		});
	});
});

/* POST - create a session */
router.post('/create', (req, res, next) => {
	Session.findOne({
		property_id: req.body.property_id
	})
	.then(session => {
		if (session) {
			console.log("Found a session");
			handleError("Session with that property already exists", res, next);
		}
		else {
			console.log("Creating a new session");
			Session.create({
				property_id: req.body.property_id,
				buyer_id: req.body.buyer_id,
				seller_id: req.body.seller_id
			}, (err, session) => {
				if (err) console.error(err);
				linkSessionToParticipants(session._id, session.buyer_id, session.seller_id,
				res, next);
			});
		}
	});
});

function linkSessionToParticipants(session_id, buyer_id, seller_id, res, next) {
	// First the seller
	User.updateOne({
		_id: seller_id
	}, {
		$push: {
			'profiles.seller.sessions': session_id
		}
	}, (err, result) => {
		if (err) console.log(err);
		console.log(result);
		// Then the buyer
		User.updateOne({
			_id: buyer_id
		}, {
			$push: {
				'profiles.buyer.sessions': session_id
			}
		}, (err, result) => {
			if (err) console.log(err);
			console.log(result);
			res.json({
				message: 'Linked session to participants successfully'
			});
		});
	});
}

/* PUT - update a session */
router.put('/:session_id/update', (req, res, next) =>  {
	Session.updateOne({
		_id: req.params.session_id
	}, req.body.updateOptions, (err) => {
		if (err) handleError(err, res, next);
		res.send(`Successfully updated Session #: ${req.params.session_id}`);
	});
});

/* DELETE - delete a session */
router.delete('/:session_id/delete', (req, res, next) => {
	Session.deleteOne({
		_id: req.params.session_id
	}, (err) => {
		if (err) handleError(err, res, next);
		res.send(`Session ${req.params.session_id} was deleted successfully`);
	});
});

// Error handling
function handleError(errorMsg, res, next) {
	const error = new Error(errorMsg);
	next(error);
}

module.exports = router;
