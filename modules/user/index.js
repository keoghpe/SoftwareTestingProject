var Users = require('../../models/User.js');

exports = module.exports = {};

exports.createUser = function(userName, callback, error) {

	console.log(userName);
	Users.create({
			UserName : userName,
			done : false
		}, function(err, data) {
			if (err)
				error(err);

			Users.find(function(err, data) {
				if (err)
					error(err);
				
				callback(data);
			});
		});
};

exports.getUsers = function(callback, error) {
	Users.find().exec(function(err, Users){
		if (err) {
			error(err);
		};
		callback(Users);
	});
};

exports.removeUser = function(userName, callback, error) {
	Users.remove({
			UserName : userName
		}, function(err, data) {
			if (err)
				error(err);

		Users.find(function(err, data) {
			if (err)
				error(err);
			callback(data);
		});
	});
};