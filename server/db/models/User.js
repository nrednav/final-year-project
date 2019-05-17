const mongoose = require('mongoose');
const db = require('../connection');

const UserSchema = new mongoose.Schema({
	account_address: {
		type: String,
		require: true,
		unique: true
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
			screening_uid: {
				type: String
			},
			notifications: [
			],
			sessions: [
			],
			offers: [{
				property_id: {
					type: String
				},
				price: {
					type: Number
				},
				timestamp: {
					type: Date,
					default: Date.now
				}
			}]
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
			properties: [
			],
			sessions: [
			],
			notifications: [
				{
					message: {
						type: String
					},
					timestamp: {
						type: Date,
						default: Date.now
					}
				}
			]
		}
	}
});

const User = db.model('User', UserSchema);

module.exports = { User };
