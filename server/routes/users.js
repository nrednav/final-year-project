var express = require('express');
var router = express.Router();

const User = require('../db/models/User').User;

/* GET users listing. */
router.get('/', function(req, res, next) {
	res.send('respond with a resource');
});

/* GET user */
router.get('/:id', (req, res, next) => {
	const user_id = req.params.id;
	User.findOne({
		_id: user_id
	}, (err, result) => {
		if (err) console.error(err);
		var user = result.toObject();
		delete user['password'];
		res.json({
			user
		});
	});
});

module.exports = router;
