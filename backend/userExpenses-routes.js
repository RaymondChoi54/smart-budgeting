const User = require('./budgetDatabase').users
const Expense = require('./budgetDatabase').expenses
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('./config');

// Create a new session
exports.createSession = function(req, res) {
	User.findOne({username: req.body.username}, 'password', function(err, user) {
		if(err) {
			return res.status(500).send("Error: Could not get the user");
		}

		if(bcrypt.compareSync(req.body.password, user.password)) {
			var token = jwt.sign({ id: user._id }, config.secret, {
		    	expiresIn: 86400 // expires in 24 hours
		    });
		    return res.status(200).send({ auth: true, token: token });
		}

		return res.status(401).send({ auth: false, message: 'Error: incorrect password' })
	});
}

// Create a user
exports.createUser = function(req, res) {
	// Hash the password
	var hashedPassword = bcrypt.hashSync(req.body.password, 8);

	// Create the user
	User.create({
		fullname: req.body.fullname,
		email: req.body.email,
		username: req.body.username,
		password: hashedPassword
	}, function(err, user) {
		if(err) {
			return res.status(500).send("Error: Could not register the user");
		} else {
			// User created, respond with a token
			var token = jwt.sign({ id: user._id }, config.secret, {
      			expiresIn: 86400 // Expires in 24 hours
    		});
    		return res.status(200).send({ auth: true, token: token });
		}
	})
}

// Get the fullname, email, and categories of a user
exports.getUser = function(req, res) {
	User.findOne({username: req.params.user}, 'fullname email savedCat', function(err, user) {
		if(err) {
			return res.status(500).send("Error: Could not get the user");
		}

		if(req.userID.localeCompare(user._id) == 0) {
			// Respond with the user info
			return res.status(200).send(user);
		} else {
			// Wrong user, no permissions
			return res.status(403);
		}
	});
}

// Create a new expense for a user
exports.createExpense = function(req, res) {
	const newExpense = new Expense(req.body);
	newExpense.save((err) => {
		if(err) {
			res.sendStatus(500).send("Error: Could not create an expense");;
		} else {
			res.sendStatus(200);
		}
	});
}