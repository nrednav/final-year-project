const jwt = require('jsonwebtoken');

/**
 * @desc - verifies a JWT sent in a requests authorization header
 */
function verify_token(req, res, next) {
	const auth_header = req.get('authorization');

	if (auth_header) {
		const token = auth_header.split(' ')[1];
		if (token) { // If authorization header exists, verify it
			jwt.verify(token, process.env.TOKEN_SECRET, (error, user) => {
				if (error) console.error(error);
				req.user = user;
				next();
			});
		}
		else {
			next();
		}
	}
	else {
		next();
	}
}

/**
 * @desc - Verifies if user is logged in when making requests to a guarded route
 */
function verify_login_status(req, res, next) {
	if (req.user) {
		next();
	}
	else {
		const error = new Error("You are unauthorized to visit this page");
		res.status(401);
		next(error);
	}
}

/**
 * @desc - Verifies the auth header of requests to certain API's
 */
function verify_requester(req, res, next) {
	const auth_header = req.get('authorization')

	if (auth_header == 'a1b2c3d4e5f6g7') {
		next();
	} else {
		res.json({
			error: 'You are not authorized to make this request'
		});
	}
}

module.exports = {
	verify_token,
	verify_login_status,
	verify_requester
};
