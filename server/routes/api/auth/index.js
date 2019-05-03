const express = require('express');
const Joi = require('@hapi/joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const UserModel = require('../../../db/models/User.js').User;

const router = express.Router();

router.get('/', (req, res) => {
	res.json({
		message: 'Hello from auth'
	});
});

router.post('/register', (req, res, next) => {
});

module.exports = router;
