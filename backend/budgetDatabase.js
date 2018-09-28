const mongoose = require('mongoose');
const config = require('./config').database;

delete mongoose.connection.models['Expense'];

// Schema for storing user data
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

// Schema for storing user expenses
var expensesSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		trim: true
	},
	category: {
		type: Number,
		required: true,
		trim: true,
		validate: {
    		validator: function(x) {
    			return Number.isInteger
    		},
    		message: '{VALUE} is not a category value'
  		}
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

// Schema for storing user expenses
var budgetSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		trim: true
	},
	budget: {
		type: Number,
		required: true,
		validate: {
    		validator: function(x) {
    			return x >= 0
    		},
    		message: '{VALUE} is not a valid budget value'
  		}
	},
	expense: {
		type: Number,
		required: true,
		validate: {
    		validator: function(x) {
    			return x >= 0
    		},
    		message: '{VALUE} is not a valid expense value'
  		}
	},
	dailyExpense: {
		type: [Number],
		required: true
	},
	month: {
		type: Number,
		required: true,
		validate: {
    		validator: function(x) {
    			return Number.isInteger && x > 0 && x < 13
    		},
    		message: '{VALUE} is not a month value'
  		}
	},
	year: {
		type: Number,
		required: true,
		validate: {
    		validator: function(x) {
    			return Number.isInteger
    		},
    		message: '{VALUE} is not a year value'
  		}
	},
	changed: {
		type: Boolean,
		required: true
	},
}, {
    collection: 'Budget',
});

//connect to MongoDB
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
mongoose.connect('mongodb://' + config.username + ':' + config.password + '@ds119113.mlab.com:19113/budget', { useNewUrlParser: true }, (error) => {
    if (error) console.log(error);
    console.log('Success: Connected to database');
});

module.exports = { users: mongoose.model('User', userSchema), expenses: mongoose.model('Expense', expensesSchema), budgets: mongoose.model('Budget', budgetSchema) }


