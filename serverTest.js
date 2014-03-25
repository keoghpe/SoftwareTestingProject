var mongo = require('mongodb');
var mongoUri = 'mongodb://keoghpe:swellpro0864@ds035027.mongolab.com:35027/heroku_app23316660';

console.log('hey');
mongo.Db.connect(mongoUri, function(err, db){


console.log('ho');
	db.collection('stock', function(er, collection){


console.log('hi');
		collection.find(function(err, res){
			console.log(err);
			console.log(res);
		});
	});
});