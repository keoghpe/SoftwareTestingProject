//var Sales = require('../models/Sales.js');
var Towns = require('../modules/Towns');
var Stock = require('../modules/Stock');
var SALES = require('../modules/Sales');
var Users = require('../modules/user');

module.exports = function(app, TestLimits, passport){

	var data = {
			sales : {},
			limits : {}
		};

	app.get('/', function(req, res) {

		if (req.isAuthenticated()) {
			console.log(req.user);
			res.render('profile.ejs')
		} else {
			res.render('landingPage.ejs');
		}

	});

	app.get('/login', function(req, res) {
		res.render('login.ejs', { message: req.flash('loginMessage')});
	});

	app.get('/register', function(req, res) {
		res.render('register.ejs',  { message: req.flash('signupMessage') });
	});

	app.get('/profile', isLoggedIn, function(req, res) {
		res.render('profile.ejs', {
			user : req.user // get the user out of session and pass to template
		});
	});


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
		SALES.getSalesBetween(req.params.start_month_number, req.params.start_year_number, req.params.end_month_number, req.params.end_year_number, req.user.email,

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

	app.get('/api/user', function(req, res) {
		Users.getUsers(
			function(users) {
				res.json(users);
			},
			handleError);
	});

	app.get('/api/user', function(req, res) {
		Users.getUsers(
			function(users) {
				res.json(users);
			},
			handleError);
	});
	

	app.post('/register', passport.authenticate('local-signup', {
		successRedirect : '/profile', // redirect to the secure profile section
		failureRedirect : '/register', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/profile', // redirect to the secure profile section
		failureRedirect : '/login', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	// post a sale
	app.post('/api/sales', isLoggedIn, function(req, res) {

		if (parseInt(req.body.LocksSold) > TestLimits.LocksLeft || 
				parseInt(req.body.StocksSold) > TestLimits.StocksLeft || 
				parseInt(req.body.BarrelsSold) > TestLimits.BarrelsLeft) {
			} else {

			SALES.reportSale(req.body, req.user.email, function() {

				TestLimits.LocksLeft -= parseInt(req.body.LocksSold);
				TestLimits.StocksLeft -= parseInt(req.body.StocksSold);
				TestLimits.BarrelsLeft -= parseInt(req.body.BarrelsSold);

				var today = new Date();

				SALES.getSalesBetween(today.getMonth() + 1, today.getFullYear(),
				 today.getMonth() + 1,today.getFullYear(),  req.user.email, function(sales) {
				 	
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

		Users.endMonth(req.user.email, function() {

			res.json({CantSell: true});
		}, handleError);
	});

	app.delete('/api/towns/:town_name', isLoggedIn, function(req, res) {

		Towns.removeTown(req.params.town_name, function(data) {
			 res.json(data);
		}, handleError);
	});

	app.delete('/api/user/:user_name', isLoggedIn, function(req, res) {

		Users.removeUser(req.params.user_name, function(data) {
			 res.json(data);
		}, handleError);
	});

	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
};
function handleError (err) {
	res.send(err);
}

function isLoggedIn(req, res, next){

	if (req.isAuthenticated()){
		return next();
	}

	res.redirect('/');
}