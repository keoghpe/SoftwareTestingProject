var Sales = require('../../models/Sales.js');

exports = module.exports = {};

exports.getSales = function(callback, error) {
	Sales.find().exec(function(err, sales){
		if (err) {
			error(err);
		};
		callback(sales);
	});
};

exports.getSalesBetween = function(startmonth, startyear, endmonth, endyear, user, callback, error) {

	//date object is acting weird because we're in China

    if(user === adminMail)
        console.log('FUUUUCCKKKK');
    
	var start = new Date(startyear, startmonth-1, 2);
	var end = new Date(endyear, endmonth, 1);

	Sales.find({"DateOfSale":{$gte: start, $lte: end},"SalesPerson":user}).exec(function(err, sales){
		if (err) {
			error(err);
		};
		callback(sales);
	});
};

exports.getReportForMonths = function(callback, error) {

    //date object is acting weird because we're in China
    
    var start = new Date(startyear, startmonth-1, 2);
    var end = new Date(endyear, endmonth, 1);

    console.log(start);
    console.log(end);

    Sales.find({"DateOfSale":{$gte: start, $lte: end}}).exec(function(err, sales){
        if (err) {
            error(err);
        };
        callback(sales);
    });
};

exports.reportSale = function(theSale, salesPerson, callback, error){

    var the_sale = new Sales({
                DateOfSale : new Date(),
                LocksSold : parseInt(theSale.LocksSold),
                StocksSold : parseInt(theSale.StocksSold),
                BarrelsSold : parseInt(theSale.BarrelsSold),
                TownName: theSale.Town,
                SalesPerson : salesPerson
            });

    the_sale.save(function(err, thesale, numAf){
        if(err)
            error(err);

       callback();
    });
};
