var express = require('express');
var router = express.Router();

const ScreeningReport = require('../../../db/models/ScreeningReport').ScreeningReport;

/* Create report */
router.post('/add-report', (req, res, next) => {
	console.log("Request received, got address:", req.body.account_address);
	ScreeningReport.create({ buyer_address: req.body.account_address }, (err, report) => {
		if (err) console.log(err);
		res.json({
			report_id: report._id
		});
	});
});

/* Verify user */
router.get('/get-report/:account_address', (req, res, next) => {
	const auth_header = req.get('authorization');

	if (auth_header == 'a1b2c3d4e5f6g7') {
		ScreeningReport.findOne({ buyer_address: req.params.account_address },
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
