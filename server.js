// server.js

// set up ========================
var express  = require('express');
var app      = express(); 								// create our app w/ express
var mongoose = require('mongoose'); 					// mongoose for mongodb
var Schema = mongoose.Schema;
// configuration =================
//var mongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://keoghpe:swell0864@ds035027.mongolab.com:35027/heroku_app23316660';//'mongodb://localhost:27017/GunShop';
//var mongoUri ='mongodb://keoghpe:swellpro0864@ds035027.mongolab.com:35027/heroku_app23316660';//
var mongoUri = 'mongodb://localhost:27017/GunShop';
// mongo ds035027.mongolab.com:35027/heroku_app23316660 -u keoghpe -p <dbpassword>
//var mongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/mydb';

mongoose.connect(mongoUri);

app.configure(function() {
	app.use(express.static(__dirname + '/public')); 		// set the static files location /public/img will be /img for users
	app.use(express.logger('dev')); 						// log every request to the console
	app.use(express.bodyParser()); 							// pull information from html in POST
	app.use(express.methodOverride()); 						// simulate DELETE and PUT
});
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
			
var TestLimits = {
		monthOf : new Date(),
		LocksLeft : 70,
		StocksLeft : 80,
		BarrelsLeft : 60
	};


var month=0, year =0;

app.get('/api/sales', function(req, res) {

	var start = new Date(year, month-1, 1);
	var end = new Date(year, month-1, 31);
	var data = {
		sales : {},
		limits : {}
	};

	console.log(start);
	console.log(end);
	Sales.find().exec(function(err, sales) {
		//{monthOf: {$gte: start, $lte: end}}
		console.log(sales);
		if (err)
			res.send(err);

		data.sales = sales;

		console.log(sales);
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

		the_sale.save(function(err){
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

					stock[0] = TestLimits;

					stock[0].save(function(err){
						if (err) {
							res.send(err);
						}

						res.json(data);
					});
				});
			});

		});

		
/*
		Sales.find({'Town':req.body.Town}, function(err, town){

			if (err)
				res.send(err);

			if(town[0]) {

				console.log(town[0].Town);
			
				town[0].Sales.push({
					DateOfSale : new Date(year, month),
					LocksSold : parseInt(req.body.LocksSold),
					StocksSold : parseInt(req.body.StocksSold),
					BarrelsSold : parseInt(req.body.BarrelsSold)
				});

				town[0].TotalSales[0].DateOfSale = new Date();
				town[0].TotalSales[0].LocksSold += parseInt(req.body.LocksSold);
				town[0].TotalSales[0].StocksSold += parseInt(req.body.StocksSold);
				town[0].TotalSales[0].BarrelsSold += parseInt(req.body.BarrelsSold);

				TestLimits.LocksLeft -= parseInt(req.body.LocksSold);
				TestLimits.StocksLeft -= parseInt(req.body.StocksSold);
				TestLimits.BarrelsLeft -= parseInt(req.body.BarrelsSold);

				town[0].save(function(err){
					if (err) {
						res.send(err);
					}

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

							stock[0] = TestLimits;

							stock[0].save(function(err){
								if (err) {
									res.send(err);
								}

								res.json(data);
							});
						});
					});
				});
			}
		
		});*/
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


mongoose.connection.on('error', function(err) {
		console.log(err);
	});

mongoose.connection.once('open', function() {
	initialise(function() {

	// application -------------------------------------------------------------
		app.get('*', function(req, res) {
			res.sendfile('./public/index.html'); 
		});
		var port = process.env.PORT || 8080;
		app.listen(port);
		console.log("App listening on port " + port);
	});
});

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

function initialise (callback) {

	Stock.find().sort({monthOf: -1}).limit(1).exec(function(err, stock){
		if (err)
			console.log(err);
		console.log('helloooooo');
		console.log(stock);
		console.log(stock[0]);
		month = stock[0].monthOf.getMonth() -1;
		year = stock[0].monthOf.getFullYear();

		TestLimits = stock[0];

		callback();
	});
}