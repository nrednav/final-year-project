const express = require('express');
const Joi = require('@hapi/joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const UserModel = require('../../../db/models/User.js').User;

// Joi schema for validation
const schema = Joi.object().keys({
	email: Joi.string().email().required(),
	password: Joi.string().trim().min(2).required(),
	account_address: Joi.string().required(),
	name: Joi.string().required()
});

// Route definitions
const router = express.Router();

router.get('/', (req, res) => {
	res.json({
		message: 'Hello from auth'
	});
});

router.post('/register', (req, res, next) => {
	const result = Joi.validate(req.body, schema);

	if (result.error === null) {
		UserModel.find({
			email: req.body.email
		}).then(user => {
			if (user.length != 0) {
				const error = new Error('That email is already taken.');
				res.status(409);
				next(error);
			}
			else {
				bcrypt.hash(req.body.password.trim(), 5).then(hashed_password => {
					const new_user = new UserModel({
						email: req.body.email,
						password: hashed_password,
						name: req.body.name,
						account_address: req.body.account_address
					});
					new_user.save((err) => {
						if (err) console.log(err);
						res.json({
							message: 'User registered successfully'
						});
					});
				});
			}
		})
		.catch((err) => {
			console.log(err);
		});
	}
	else {
		console.log(result.error);
		res.status(422);
		next(result.error);
	}
});

module.exports = router;
