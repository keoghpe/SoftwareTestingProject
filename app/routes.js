var Sales = require('../models/Sales.js');
var Stock = require('../models/Stock.js');
var Towns = require('../models/Towns.js');

module.exports = function(app, TestLimits){

	var month=0, year =0;

	app.get('/api/sales', function(req, res) {

		var start = new Date(year, month-1, 1);
		var end = new Date(year, month-1, 31);
		var data = {
			sales : {},
			limits : {}
		};

		//console.log(start);
		//console.log(end);
		Sales.find().exec(function(err, sales) {
			//{monthOf: {$gte: start, $lte: end}}
			//console.log(sales);
			if (err)
				res.send(err);

			data.sales = sales;

			//console.log(sales);
			Stock.find().sort({monthOf: -1}).limit(1).exec(function(err, stock){
				if (err)
					console.log(err);

				data.limits = stock[0];

				Towns.find().exec(function(err, towns){
					data.towns = towns;
					res.json(data);
				});			
			});
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
					data.limits = TestLimits;

					Stock.find().sort({monthOf: -1}).limit(1).exec(function(err, stock){
						if (err)
							console.log(err);

						stock[0] = new Stock(TestLimits);

						stock[0].save(function(err, stock, numAf){
							if (err) {
								res.send(err);
							}

							res.json(data);
						});
					});
				});

			});
		}

	});

	app.post('/api/createTown', function(req, res) {

		Towns.create({
			TownName : req.body.Town,
			done : false
		}, function(err, data) {
			if (err)
				res.send(err);

			Towns.find(function(err, data) {
				if (err)
					res.send(err);
				
				res.json(data);
			});
		});

	});

	app.post('/api/endMonth', function(req, res) {

		if (month === 12) {
			month = 1;
			year++;
		} else{
			month++;	
		}

		createNewMonth(year, month, res);

		console.log('Month: ' + month + ', Year: ' + year);

		res.json({
			theDate : new Date(year, month)
		});

	});

	app.delete('/api/towns/:town_name', function(req, res) {
		console.log(req.params.town_name);

		Towns.remove({
			TownName : req.params.town_name
		}, function(err, data) {
			if (err)
				res.send(err);

			console.log("Deleted" + req.params.town_name);

			Towns.find(function(err, data) {
				if (err)
					res.send(err);
				res.json(data);
			});
		});
	});
};

function createNewMonth(year, month, res){
	Stock.create({
		monthOf : new Date(year, month),
		LocksLeft : 70,
		StocksLeft : 80,
		BarrelsLeft : 60,
		done : false
	}, function(err, sales) {
		if (err)
			res.send(err);

		Stock.find(function(err, sales) {
			if (err)
				res.send(err);
			res.json(sales);
		});
	});
}	