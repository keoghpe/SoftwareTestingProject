var mongoose = require('mongoose');

var sale = mongoose.Schema({
	DateOfSale : Date,
	LocksSold : Number,
	StocksSold : Number,
	BarrelsSold : Number
});

var Towns = mongoose.Schema({
	Town : String,
	Sales : [sale],
	TotalSales : [sale]
});

module.exports = mongoose.model('towns', Towns);
