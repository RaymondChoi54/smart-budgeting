const User = require('./budgetDatabase').users
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('./config');

// Check if token is valid. If valid id is returned
tokenCheck = function(token, secret) {
	return jwt.verify(token, secret, function(err, decoded) {
	    if(err) {
		  	if(!token) {
		  		return { auth: false, message: 'Error: No token provided' };
		  	}
	    	return { auth: false, message: 'Error: Invalid token provided' };
	    }

	    return { auth: true, id: decoded.id }
	});
}

exports.tokenCheck = function(req, res, next) {
	var response = tokenCheck(req.headers['x-access-token'], config.secret);

	if(response.auth) {
		// Save id
		req.userID = response.id;
		next();
	} else {
		return res.status(401).send(response);
	}
}

exports.tokenCheckUser = function(req, res, next) {
	var response = tokenCheck(req.headers['x-access-token'], config.secret);

	if(response.auth) {
		User.findOne({username: req.params.username}, function(err, user) {
			if(err || !user) {
				return res.status(500).send({ auth: false, message: "Error: Could not get the user" });
			}

			if(response.id.localeCompare(user._id) == 0) {
				// Save id
				req.userId = response.id;
				next();
			} else {
				// Wrong user, no permissions
				return res.send({ auth: false, message: "Error: Incorrect permissions" });
			}
		});
	} else {
		return res.status(401).send(response);
	}
}
