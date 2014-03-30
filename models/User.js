var mongoose = require('mongoose');

var User = mongoose.Schema({
	UserName : String
});

module.exports = mongoose.model('users', User);