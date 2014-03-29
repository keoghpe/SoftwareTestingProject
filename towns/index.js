var Towns = require('../models/Towns.js');

exports = module.exports = {};

exports.createTown = function(townName, callback, error) {
	Towns.create({
			TownName : townName,
			done : false
		}, function(err, data) {
			if (err)
				error(err);

			Towns.find(function(err, data) {
				if (err)
					error(err);
				
				callback(data);
			});
		});
};

exports.getTowns = function(callback, error) {
	Towns.find().exec(function(err, towns){
		if (err) {
			error(err);
		};
		callback(towns);
	});
};

exports.removeTown = function(townName, callback, error) {
	Towns.remove({
			TownName : townName
		}, function(err, data) {
			if (err)
				error(err);

		Towns.find(function(err, data) {
			if (err)
				error(err);
			callback(data);
		});
	});
};