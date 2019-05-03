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
			session_count: Number,
			offer_count: Number,
			purchase_count: Number,
			notifications: [
			],
			sessions: [
			],
			offers: [
				{
					property_id: String,
					price: Number,
					timestamp: Date
				}
			]
		},
		seller: {
			property_count: Number,
			verified_count: Number,
			listed_count: Number,
			sale_count: Number,
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
