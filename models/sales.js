var mongoose = require('mongoose');

var Sales = mongoose.Schema({
	DateOfSale : Date,
	LocksSold : Number,
	StocksSold : Number,
	BarrelsSold : Number,
	TownName: String
});

module.exports = mongoose.model('sales', Sales);

/*
var Sales = mongoose.model('sales',{
	DateOfSale : Date,
	LocksSold : Number,
	StocksSold : Number,
	BarrelsSold : Number,
	TownName: String
});

///IN MONGOOSE THIS SHITZ NEEDS TO BE PLURALIZED
var Stock = mongoose.model('stocks',{
	monthOf : Date,
	LocksLeft : Number,
	StocksLeft : Number,
	BarrelsLeft : Number
});

var Towns = mongoose.model('towns',{
	TownName : String
});
	
*/