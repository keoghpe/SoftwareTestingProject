var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
	email : String,
	password : String
});

userSchema.methods.generateHash = function (password) {
	return bcrypt.hashSynch(password, bcrypt.genSaltSynch(8), null);
}

userSchema.methods.validPassword = function (password) {
	return bcrypt.compareSynch(password, this.local.password);
}

module.exports = mongoose.model('User', userSchema);