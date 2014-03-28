var mongoose = require('mongoose');

var Towns = mongoose.Schema({
	TownName : String
});

module.exports = mongoose.model('towns', Towns);