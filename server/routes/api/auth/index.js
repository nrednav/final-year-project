const express = require('express');
const Joi = require('@hapi/joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const Web3 = require('web3');

// Setup web3
const web3 = new Web3('ws://localhost:9546');

const UserModel = require('../../../db/models/User.js').User;

// Login & Register form validation schemas
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


/**
 * @desc - Generates a JSON Web Token (JWT)
 * @param - User object
 */
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


/* POST - Register a new user */
router.post('/register', (req, res, next) => {
	const result = Joi.validate(req.body, registration_schema);

	if (result.error === null) {
		UserModel.findOne({
			email: req.body.email,
			account_address: req.body.account_address
		}).then(user => {
			if (user) {
				res.json({
					error: 'the email and account addresses are not unique'
				});
			}
			else {
				bcrypt.hash(req.body.password.trim(), 5).then(hashed_password => {
					UserModel.create({
						email: req.body.email,
						password: hashed_password,
						name: req.body.name,
						account_address: req.body.account_address
					}, (err, user) => {
						if (err) {
							next(err);
						} else {
							console.log(user);

							transferEther(req.body.account_address);

							res.json({
								error: 'none',
								user_id: user._id
							});
						}
					});
				});
			}
		})
		.catch((err) => {
			console.log(err);
			next(err);
		});
	}
	else {
		console.log(result.error);
		res.status(422);
		next(result.error);
	}
});


// POST - Handle login of a user
router.post('/login', (req, res, next) =>  {

	const result = Joi.validate(req.body, login_schema);

	if (result.error === null) { // If form was valid, find the user
		UserModel.findOne({
			email: req.body.email
		})
		.then(user => {
			if (user) { // If user exists, validate their password
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


/**
 * @desc - Forwards error message to the error handler middleware
 * @params
 *		- code: status code of the response
 *		- errorMsg: message describing the error
 */
function handleError(code, errorMsg, res, next) {
	res.status(code);
	const error = new Error(errorMsg);
	next(error);
}

/**
 * @desc - Transfer's ether to newly registered user for testing purposes
 * @param
 *		- account_address: Account address of the newly registered user
 */
async function transferEther(account_address) {
	var node_address = "0x8a23c7c42333ed6be5a68c24031cd7a737fbcbe8";
	await web3.eth.personal.unlockAccount(node_address, String(1234), 1000);

	console.log('Sending ether now...');
	const tx = await web3.eth.sendTransaction({
		from: node_address,
		to: account_address,
		value: web3.utils.toWei('1000000', 'ether')
	});
	console.log(tx);
}

module.exports = router;
