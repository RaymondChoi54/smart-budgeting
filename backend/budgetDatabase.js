var mongoose = require('mongoose');

//connect to MongoDB
mongoose.connect('mongodb://raymond:123123a@ds163382.mlab.com:63382/budget');
var db = mongoose.connection;


//handle mongo error
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log("connected!");
});

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
	}]
});

module.exports = mongoose.model('User', userSchema);