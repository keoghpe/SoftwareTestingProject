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

exports.getSalesBetween = function(startmonth, startyear, endmonth, endyear, callback, error) {

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

exports.reportSale = function(theSale, callback, error){
    var the_sale = new Sales({
                DateOfSale : new Date(),
                LocksSold : parseInt(theSale.LocksSold),
                StocksSold : parseInt(theSale.StocksSold),
                BarrelsSold : parseInt(theSale.BarrelsSold),
                TownName: theSale.Town
            });

    the_sale.save(function(err, thesale, numAf){
        if(err)
            error(err);

       callback();
    });
};


/**
I THINK ANGULAR HAS A FILTER FUNCTION WE CAN DO THIS WITH BUT JUST IN CASE
 * Here's some code we can use to sort the array of JSON on the client
 * http://www.subchild.com/2010/03/31/sorting-a-json-array-by-property/
 * Sorts an array of json objects by some common property, or sub-property.
 * @param {array} objArray
 * @param {array|string} prop Dot-delimited string or array of (sub)properties
 */
 /*
function sortJsonArrayByProp(objArray, prop){
    if (arguments.length<2){
        throw new Error("sortJsonArrayByProp requires 2 arguments");
    }
    if (objArray &amp;&amp; objArray.constructor===Array){
        var propPath = (prop.constructor===Array) ? prop : prop.split(".");
        objArray.sort(function(a,b){
            for (var p in propPath){
                if (a[propPath[p]] &amp;&amp; b[propPath[p]]){
                    a = a[propPath[p]];
                    b = b[propPath[p]];
                }
            }
            // convert numeric strings to integers
            a = a.match(/^\d+$/) ? +a : a;
            b = b.match(/^\d+$/) ? +b : b;
            return ( (a < b) ? -1 : ((a > b) ? 1 : 0) );
        });
    }
}*/