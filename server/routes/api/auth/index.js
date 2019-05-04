const express = require('express');
const Joi = require('@hapi/joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const UserModel = require('../../../db/models/User.js').User;

// Joi schemas for validation
const registration_schema = Joi.object().keys({
	email: Joi.string().email().required(),
	password: Joi.string().trim().min(2).required(),
	account_address: Joi.string().required(),
	name: Joi.string().required()
});

const login_schema = Joi.object().keys({
	email: Joi.string().email().required(),
	password: Joi.string().trim().min(2).required(),
	account_address: Joi.string().required()
});


// JWT functions
function generateTokenResponse(user, res, next) {
	const payload = {
		_id: user._id,
		email: user.email
	};

	jwt.sign(payload, process.env.TOKEN_SECRET, {
		expiresIn: '1d'
	}, (err, token) => {
		if (err) {
			handleError(422, "", res, next);
		}
		else {
			res.json({
				token
			});
		}
	});
}


// Route definitions
const router = express.Router();

router.get('/', (req, res) => {
	res.json({
		message: 'Hello from auth'
	});
});


// Handle user registration
router.post('/register', (req, res, next) => {
	const result = Joi.validate(req.body, registration_schema);

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
					UserModel.create({
						email: req.body.email,
						password: hashed_password,
						name: req.body.name,
						account_address: req.body.account_address
					}, (err, user) => {
						if (err) next(err);
						console.log(user);
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


// Handle user login attempts
router.post('/login', (req, res, next) =>  {
	const result = Joi.validate(req.body, login_schema);
	if (result.error === null) {
		UserModel.findOne({
			email: req.body.email
		})
		.then(user => {
			if (user) {
				bcrypt.compare(req.body.password, user.password, (err, result) => {
					if (result) {
						if (user.account_address === req.body.account_address) {
							generateTokenResponse(user, res, next);
						}
						else {
							handleError(422, "Incorrect email, password or account address",
								res, next);
						}
					}
					else {
						handleError(422, "Incorrect email, password or account address", res, next);
					}
				});
			}
			else {
				handleError(422, "Incorrect email, password or account address", res, next);
			}
		});
	}
	else {
		handleError(422, "Validation failed", res, next);
	}
});


// Error handling
function handleError(code, errorMsg, res, next) {
	res.status(code);
	const error = new Error(errorMsg);
	next(error);
}

module.exports = router;
