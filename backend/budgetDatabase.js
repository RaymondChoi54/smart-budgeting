const mongoose = require('mongoose');
const config = require('./config').database;

var userSchema = new mongoose.Schema({
	fullname: {
		type: String,
		required: true,
		trim: true
	},
	email: {
		type: String,		
		required: true,
		unique: true,
		trim: true
	},
	username: {
		type: String,
		required: true,
		unique: true,
		trim: true
	},
	password: {
		type: String,
		required: true
	},
	savedCat: [{
		type: String,
		required: false
	}],
}, {
    collection: 'Users',
});

var expensesSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		trim: true
	},
	category: {
		type: String,
		required: true,
		trim: true
	},
	store: {
		type: String,
		required: true,
		trim: true
	},
	item: {
		type: String,
		required: true,
		trim: true
	},
	price: {
		type: Number,
		required: true,
		validate: {
	        validator: function(x) {
	        	return x > 0;
	        },
	        message: 'Price of the item needs to be greater than 0'
    	}
	},
	brand: {
		type: String,
		required: false,
		trim: true
	},
	size: {
		type: Number,
		required: true,
		min: 0
	},
	unit: {
		type: String,
		required: true,
		trim: true
	},
	date: {
		type: Date,
		required: true
	},
	comment: {
		type: String,
		required: false,
		trim: true
	}, 
}, {
    collection: 'Expenses',
});

//connect to MongoDB
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
mongoose.connect('mongodb://' + config.username + ':' + config.password + '@ds163382.mlab.com:63382/budget', { useNewUrlParser: true }, (error) => {
    if (error) console.log(error);
    console.log('Success: Connected to database');
});

module.exports = { users: mongoose.model('User', userSchema), expenses: mongoose.model('Expense', expensesSchema) }


