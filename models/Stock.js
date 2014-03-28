var mongoose = require('mongoose');

var Stock = mongoose.Schema({
	monthOf : Date,
	LocksLeft : Number,
	StocksLeft : Number,
	BarrelsLeft : Number
});

module.exports = mongoose.model('stocks', Stock);