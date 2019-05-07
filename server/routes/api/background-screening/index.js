var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();

const ScreeningReport = require('../../../db/models/ScreeningReport').ScreeningReport;
const User = require('../../../db/models/User').User;

/* Create report */
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

/* Verify user */
router.get('/get-report/:screening_uid', (req, res, next) => {
	const auth_header = req.get('authorization');

	if (auth_header == 'a1b2c3d4e5f6g7') {
		ScreeningReport.findOne({
			screening_uid: req.params.screening_uid
		},
			(err, result) => {
				if (err) console.log(err);
				console.log(result)
				let verified = result.identity_check &&
									result.financial_check &&
									result.criminal_check;
				res.json({
					verified: verified
				});
			});
	} else {
		res.json({
			error: 'You are not authorized to request this information'
		});
	}
});


module.exports = router;
