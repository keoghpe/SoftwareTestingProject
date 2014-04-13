var mongoose = require('mongoose');

var Sales = mongoose.Schema({
	DateOfSale : Date,
	LocksSold : Number,
	StocksSold : Number,
	BarrelsSold : Number,
	TownName: String,
	SalesPerson : String
});

module.exports = mongoose.model('sales', Sales);