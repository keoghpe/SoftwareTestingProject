// server.js

// set up ========================
var express  = require('express');
var app      = express(); 								// create our app w/ express
var mongoose = require('mongoose'); 					// mongoose for mongodb
var Schema = mongoose.Schema;

console.log('Set up complete')
// configuration =================
mongoose.connect('mongodb://keoghpe:swellpro0864@ds035027.mongolab.com:35027/heroku_app23316660');
//mongoose.connect('mongodb://localhost:27017/GunShop'); 	// connect to mongoDB database on modulus.io
console.log('Connecting to db...');
app.configure(function() {
	app.use(express.static(__dirname + '/public')); 		// set the static files location /public/img will be /img for users
	app.use(express.logger('dev')); 						// log every request to the console
	app.use(express.bodyParser()); 							// pull information from html in POST
	app.use(express.methodOverride()); 						// simulate DELETE and PUT
});

var sale = new Schema({
	DateOfSale : Date,
	LocksSold : Number,
	StocksSold : Number,
	BarrelsSold : Number
});

var Towns = mongoose.model('towns',{
	Town : String,
	Sales : [sale],
	TotalSales : [sale]
});

var Stock = mongoose.model('stock',{
	monthOf : Date,
	LocksLeft : Number,
	StocksLeft : Number,
	BarrelsLeft : Number
});
			
var TestLimits = {
		monthOf : new Date(),
		LocksLeft : 70,
		StocksLeft : 80,
		BarrelsLeft : 60
	};


var month=0, year =0;

app.get('/api/sales', function(req, res) {

	var data = {
		sales : {},
		limits : {}
	};
	Towns.find(function(err, sales) {

		if (err)
			res.send(err);

		data.sales = sales;

		Stock.find().sort({monthOf: -1}).limit(1).exec(function(err, stock){
			if (err)
				console.log(err);

			data.limits = stock[0];
			res.json(data);
		});
	});

});

// post a sale
app.post('/api/sales', function(req, res) {

	if (parseInt(req.body.LocksSold) > TestLimits.LocksLeft || 
			parseInt(req.body.StocksSold) > TestLimits.StocksLeft || 
			parseInt(req.body.BarrelsSold) > TestLimits.BarrelsLeft) {
		} else {

		Towns.find({'Town':req.body.Town}, function(err, town){

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

					Towns.find(function(err, sales) {
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
		
		});
	}

});

app.post('/api/createTown', function(req, res) {

	Towns.create({
		Town : req.body.Town,
		Sales : [{
			DateOfSale : new Date(),
			LocksSold : 0,
			StocksSold : 0,
			BarrelsSold : 0
		}],
		TotalSales : [{
			DateOfSale : new Date(),
			LocksSold : 0,
			StocksSold : 0,
			BarrelsSold : 0
		}],
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
		Town : req.params.town_name
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


initialise(function() {
	console.log('gets here too');
	// application -------------------------------------------------------------
	app.get('*', function(req, res) {
		res.sendfile('./public/index.html'); 
	});
	var port = process.env.PORT || 8080;
	app.listen(port);
	console.log("App listening on port " + port);
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

		console.log(stock[0]);
		month = stock[0].monthOf.getMonth();
		year = stock[0].monthOf.getFullYear();

		TestLimits = stock[0];

		callback();
	});
}