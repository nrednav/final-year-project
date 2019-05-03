const mongoose = require('mongoose');
const db = require('../connection');

const UserSchema = new mongoose.Schema({
	account_address: {
		type: String,
		require: true
	},
	email: {
		type: String,
		require: true,
		unique: true
	},
	name: {
		type: String,
		require: true
	},
	password: {
		type: String,
		require: true
	},
	created_at: {
		type: Date,
		default: Date.now
	},
	profiles: {
		buyer: {
			purchase_count: {
				type: Number,
				default: 0
			},
			notifications: [
			],
			sessions: [
			],
			offers: [
			]
		},
		seller: {
			verified_count: {
				type: Number,
				default: 0
			},
			listed_count: {
				type: Number,
				default: 0
			},
			sale_count: {
				type: Number,
				default: 0
			},
			properties: [
			],
			sessions: [
			],
			notifications: [
			]
		}
	}
});

const User = db.model('User', UserSchema);

module.exports = { User };
