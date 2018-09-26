const User = require('./budgetDatabase').users
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('./config');

// Create a new session
exports.createSession = function(req, res) {
	User.findOne({username: req.body.username}, function(err, user) {
		if(err || !user) {
			return res.status(500).send({ auth: false, message: "Error: Could not get the user" });
		}

		if(bcrypt.compareSync(req.body.password, user.password)) {
			var token = jwt.sign({ id: user._id }, config.secret, {
		    	expiresIn: 86400 // expires in 24 hours
		    });
		    return res.status(200).send({ auth: true, data: {token: token, fullname: user.fullname, username: req.body.username } });
		}

		return res.status(401).send({ auth: false, message: 'Error: Incorrect password' })
	});
}

// Get the current session
exports.getSession = function(req, res) {
	User.findOne({_id: req.userID}, "username fullname", function(err, user) {
		if(err || !user) {
			return res.status(500).send({ auth: false, message: "Error: Could not get the user" });
		} else {
			return res.status(200).send({ auth: true, data: user });
		}
	});
}