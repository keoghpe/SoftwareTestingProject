var Sales = require('../models/Sales.js');
var TOWNS = require('../towns');
var STOCK = require('../Stock');
var SALES = require('../Sales');

module.exports = function(app, TestLimits){

	var month=0, year =0;

	app.get('/api/sales', function(req, res) {

		var data = {
			sales : {},
			limits : {}
		};

		SALES.getSales(
			
			function(){
				data.sales = sales;

				STOCK.getCurrentStock(function(stock){

					data.limits = stock[0];

					TOWNS.getTowns(function(twns) {

						data.towns = twns;
						res.json(data);

						}, function(err) {
							res.send(err);
						});		
					}, function(err){
						res.send(err);
					});
				},
				function(){
					res.send(err);
				});	
	});

	app.get('/api/sales/:month_number/:year_number', function(req, res) {
		SALES.getSalesBetween(req.params.month_number, req.params.year_number,
			function(sales) {
				res.json(sales);
			},
			function(err) {
				res.send(err);
			});
	});

	// post a sale
	app.post('/api/sales', function(req, res) {

		if (parseInt(req.body.LocksSold) > TestLimits.LocksLeft || 
				parseInt(req.body.StocksSold) > TestLimits.StocksLeft || 
				parseInt(req.body.BarrelsSold) > TestLimits.BarrelsLeft) {
			} else {

			var the_sale = new Sales({
				DateOfSale : new Date(year, month),
				LocksSold : parseInt(req.body.LocksSold),
				StocksSold : parseInt(req.body.StocksSold),
				BarrelsSold : parseInt(req.body.BarrelsSold),
				TownName: req.body.Town
			});

			//MONGOOSE SAVE METHOD TAKES EITHER 3 ARGS OR NONE AT ALL
			the_sale.save(function(err, thesale, numAf){
				if (err) 
					console.log(err);

				TestLimits.LocksLeft -= parseInt(req.body.LocksSold);
				TestLimits.StocksLeft -= parseInt(req.body.StocksSold);
				TestLimits.BarrelsLeft -= parseInt(req.body.BarrelsSold);


				Sales.find(function(err, sales) {
					if (err)
						res.send(err);

					var data = {
						sales : {},
						limits : {}
					};

					data.sales = sales;
					

					STOCK.updateStock(TestLimits ,
						function(stock){
							data.limits = stock;
							res.json(data);
							},
						function(err) {
							res.send(err);
							});
				});

			});
		}
	});

	app.post('/api/createTown', function(req, res) {

		TOWNS.createTown(req.body.Town, function(data) {
				 res.json(data);
			}, function(err) {
				res.send(err);
			});

	});

	app.post('/api/endMonth', function(req, res) {

		STOCK.createNewMonth(year, month, function(sales) {
			res.json(sales);
		}, function(err) {
			res.send(err)
		});
	});

	app.delete('/api/towns/:town_name', function(req, res) {

		TOWNS.removeTown(req.params.town_name, function(data) {
			 res.json(data);
		}, function(err) {
			res.send(err);
		});
	});
};