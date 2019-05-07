const mongoose = require('mongoose');
const db = require('../connection');

const ScreeningReportSchema = new mongoose.Schema({
	buyer_address: {
		type: String,
		require: true
	},
	screening_uid: {
		type: String,
		require: true
	},
	identity_check: {
		type: Boolean,
		default: true
	},
	financial_check: {
		type: Boolean,
		default: true
	},
	criminal_check: {
		type: Boolean,
		default: true
	}
});

const ScreeningReport = db.model('ScreeningReport', ScreeningReportSchema);

module.exports = {
	ScreeningReport
};
