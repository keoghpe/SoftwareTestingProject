var Users = require('../../models/User.js');

exports = module.exports = {};

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

exports.endMonth = function(userName, callback, error) {

	Users.update(
	  {email: userName}, 
	  {$set: {'hasEndedMonth': true}}, 
	  function(err, numAf) {
	  	if (err) {
			error(err);
		};
		callback();
	  });
};

exports.hasEndedMonth = function(userName, callback, error) {
	Users.findOne({email: userName}, function(err, user) {
		if(err){
			error(err);
		}

		callback(user.hasEndedMonth);
	});
};