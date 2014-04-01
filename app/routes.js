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
		res.render('landingPage.ejs');
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

	app.get('/api/sales/:month_number/:year_number', function(req, res) {
		SALES.getSalesBetween(req.params.month_number, req.params.year_number,
			function(sales) {
				res.json(sales);
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
	app.post('/api/sales', function(req, res) {

		if (parseInt(req.body.LocksSold) > TestLimits.LocksLeft || 
				parseInt(req.body.StocksSold) > TestLimits.StocksLeft || 
				parseInt(req.body.BarrelsSold) > TestLimits.BarrelsLeft) {
			} else {

			SALES.reportSale(req.body, function() {

				TestLimits.LocksLeft -= parseInt(req.body.LocksSold);
				TestLimits.StocksLeft -= parseInt(req.body.StocksSold);
				TestLimits.BarrelsLeft -= parseInt(req.body.BarrelsSold);

				var today = new Date();
				SALES.getSalesBetween(today.getMonth() + 1, today.getFullYear(), function(sales) {

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

	app.post('/api/user', function(req, res) {

		Users.createUser(req.body.userName, function(data) {
				 res.json(data);
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
	if (req.isAuthenticated)
		return next;

	res.redirect('/');
}