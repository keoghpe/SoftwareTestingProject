//var Sales = require('../models/Sales.js');
var Towns = require('../modules/Towns');
var Stock = require('../modules/Stock');
var SALES = require('../modules/Sales');

module.exports = function(app, TestLimits){

	var data = {
			sales : {},
			limits : {}
		};

	app.get('/api/sales', function(req, res) {

		SALES.getSales(
			
			function(sales){
				data.sales = sales;

				Stock.getCurrentStock(function(stock){

					data.limits = stock[0];

					Towns.getTowns(function(twns) {

						data.towns = twns;
						res.json(data);

						}, handleError);		
					}, handleError);
				}, handleError);	
	});

	app.get('/api/sales/:start_month_number/:start_year_number/:end_month_number/:end_year_number', function(req, res) {
		SALES.getSalesBetween(req.params.start_month_number, req.params.start_year_number, req.params.end_month_number, req.params.end_year_number,
			function(sales) {
				data.sales = sales;
				res.json(data);
			},
			handleError);
	});

	app.get('/api/sales/report', function(req, res) {
		SALES.getReportForMonths(
			function(sales) {
				data.sales = sales;
				res.json(data);
			},
			handleError);
	});

	// post a sale
	app.post('/api/sales', function(req, res) {

		if (parseInt(req.body.LocksSold) > TestLimits.LocksLeft || 
				parseInt(req.body.StocksSold) > TestLimits.StocksLeft || 
				parseInt(req.body.BarrelsSold) > TestLimits.BarrelsLeft) {
			} else {

			SALES.reportSale(req.body, function() {

				TestLimits.LocksLeft -= parseInt(req.body.LocksSold);
				TestLimits.StocksLeft -= parseInt(req.body.StocksSold);
				TestLimits.BarrelsLeft -= parseInt(req.body.BarrelsSold);

			/*	SALES.getSales(
			
			function(sales){
				data.sales = sales;

				Stock.getCurrentStock(function(stock){

					data.limits = stock[0];

					Towns.getTowns(function(twns) {

						data.towns = twns;
						res.json(data);

						}, handleError);		
					}, handleError);
				}, handleError); */

				var today = new Date();
				// Send back sales for this month
				SALES.getSalesBetween(today.getMonth() + 1, today.getFullYear(),
				 today.getMonth() + 1,today.getFullYear(),function(sales) {

					data.sales = sales;

					Stock.updateStock(TestLimits ,
						function(stock){
							data.limits = stock;
							res.json(data);
							}, handleError);
				}, handleError); 
			}, handleError);
		}
	});

	app.post('/api/createTown', function(req, res) {

		Towns.createTown(req.body.Town, function(data) {
				 res.json(data);
			}, handleError);

	});

	app.post('/api/endMonth', function(req, res) {

		Stock.createNewMonth(year, month, function(sales) {
			res.json(sales);
		}, handleError);
	});

	app.delete('/api/towns/:town_name', function(req, res) {

		Towns.removeTown(req.params.town_name, function(data) {
			 res.json(data);
		}, handleError);
	});
};
function handleError (err) {
	res.send(err);
}