// server.js

// set up ========================
var express  = require('express');
var app      = express(); 								// create our app w/ express
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var configDB = require('./config/database.js');
var Sales = require('./models/Sales.js');
var Stock = require('./models/Stock.js');
var Towns = require('./models/Towns.js');

mongoose.connect(configDB.url);
require('./config/passport')(passport);

app.configure(function() {
	app.use(express.static(__dirname + '/public')); 		// set the static files location /public/img will be /img for users
	app.use(express.logger('dev')); 						// log every request to the console
	app.use( express.cookieParser() );
	app.use(express.bodyParser()); 							// pull information from html in POST
	app.use(express.methodOverride()); 

	app.set('view engine', 'ejs');

	app.use(express.session({secret : 'shutthefackappjustshutthefackapp'}));
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(flash());
});
			
var TestLimits = {
	monthOf : new Date(),
	LocksLeft : 70,
	StocksLeft : 80,
	BarrelsLeft : 60
};

require('./app/routes.js')(app, TestLimits, passport);

mongoose.connection.on('error', function(err) {
		console.log(err);
	});

mongoose.connection.once('open', function() {
	initialise(function() {
		/*app.get('*', function(req, res) {
			res.sendfile('./public/index.html'); 
		});*/
		var port = process.env.PORT || 8080;
		app.listen(port);
		console.log("App listening on port " + port);
	});
});

function initialise (callback) {

	Stock.find().sort({monthOf: -1}).limit(1).exec(function(err, stock){
		if (err)
			console.log(err);
		month = stock[0].monthOf.getMonth() -1;
		year = stock[0].monthOf.getFullYear();

		TestLimits = stock[0];

		callback();
	});
}