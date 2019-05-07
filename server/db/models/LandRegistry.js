const mongoose = require('mongoose');
const db = require('../connection');

const LandRegistrySchema = new mongoose.Schema({
	title_deed_hash: {
		type: String,
		require: true,
		unique: true
	},
	owner_name: {
		type: String,
		require: true
	},
	liens: {
		type: Boolean,
		default: false
	}
});

const LandRegistry = db.model('LandRegistry', LandRegistrySchema);

module.exports = {
	LandRegistry
};
