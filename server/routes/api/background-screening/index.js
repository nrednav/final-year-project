var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();

const ScreeningReport = require('../../../db/models/ScreeningReport').ScreeningReport;
const User = require('../../../db/models/User').User;

/**
 * @desc - Creates an entry in the background screening database
 */
router.post('/add-report', (req, res, next) => {
	let buyer_address = req.body.account_address;
	let screening_uid = req.body.uid;
	let user_id = new mongoose.Types.ObjectId(req.body.user_id);

	ScreeningReport.create({
		buyer_address: buyer_address,
		screening_uid: screening_uid,
	}, (err, report) => {
		if (err) console.log(err);

		// Add to users buyer profile
		if (report) {
			User.findOneAndUpdate({
				_id: user_id
			}, {
				'profiles.buyer.screening_uid': screening_uid
			}, (err, result) => {
				console.log(result);
				res.json({
					result
				});
			});
		}
	});
});

/**
 * @desc - Retrieves the background screening report beloning to a user account address
 */
router.get('/get-report/:user_address', (req, res, next) => {
	const auth_header = req.get('authorization');

	if (auth_header == 'a1b2c3d4e5f6g7') {
		ScreeningReport.findOne({
			buyer_address: req.params.user_address
		},
			(err, result) => {
				if (err) {
					console.log(err);
				} else {
					console.log('Got report... verifying now.');
					let verified = result.identity_check &&
										result.financial_check &&
										result.criminal_check;

					console.log('Verification finished... sending result');

					res.json({
						verified: verified,
						screening_uid: result.screening_uid
					});
				}
			});
	} else {
		res.json({
			error: 'You are not authorized to request this information'
		});
	}
});


module.exports = router;
