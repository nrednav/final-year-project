const mongoose = require('mongoose');
const db = require('../connection');

const PropertySchema = new mongoose.Schema({
	details: {
		property_uid: {
			type: String,
			default: ''
		},
		owner: {
			type: String,
			require: true
		},
		name: {
			type: String,
			require: true
		},
		description: {
			type: String,
			require: true
		},
		address: {
			street: {
				type: String,
				require: true
			},
			city: {
				type: String,
				require: true
			},
			country: {
				type: String,
				require: true
			},
			post_code: {
				type: String,
				require: true
			}
		},
		type: {
			type: String,
			require: true
		},
		bedroom_count: {
			type: Number,
			require: true
		},
		bathroom_count: {
			type: Number,
			require: true
		},
		size: {
			type: String,
			require: true
		},
		listing_price: {
			type: Number,
			require: true
		},
		deposit: {
			type: Number,
			require: true
		},
		available_from: {
			type: Date,
			default: Date.now
		},
		images: [String]
	},
	verified: {
		type: Number,
		default: 0
	},
	listed: {
		type: Boolean,
		default: false
	},
	offers: [{
		buyer_id: {
			type: String
		},
		buyer_account_address: {
			type: String
		},
		buyer_name: {
			type: String
		},
		price: {
			type: Number
		},
		timestamp: {
			type: Date,
			default: Date.now
		}
	}],
	session_underway: {
		type: Boolean,
		default: false
	}
});

PropertySchema.path('details.images').validate((value) => {
	return value.length;
}, "'Images' cannot be an empty array");


PropertySchema.index({ 'details.name': 1, 'details.description': 1, 'details.address': 1 }, { unique: true });

const Property = db.model('Property', PropertySchema);

module.exports = {
	Property
}
