var expect = require('chai').expect;
var towns = require('../index.js');

describe('createTown()', function(){
	it('should call the first callback on success and should call the second on err', function(){
		var firstArg = 'Boobies';
		var secondArg = function(titties) {
			return 'ass';
		};
		var thirdArg = function(titties) {
			return 'titties';
		};

		var result = towns.createTown(firstArg, secondArg, thirdArg);
		expect(result).to.equal('tittes');

	});

});