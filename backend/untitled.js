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
		    return res.status(200).send({ auth: true, token: token });
		}

		return res.status(401).send({ auth: false, message: 'Error: Incorrect password' })
	});
}