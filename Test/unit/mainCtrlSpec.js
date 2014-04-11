describe('mainController', function() {

	var scope, $controllerConstructor, $httpBackend;

	var sales =  {
	    "sales": [
	        {
	            "DateOfSale": "2014-03-31T16:00:00.000Z",
	            "LocksSold": 2,
	            "StocksSold": 3,
	            "BarrelsSold": 4,
	            "_id": "53344d478cd745b834000003",
	            "__v": 0
	        },
	        {
	            "DateOfSale": "2014-03-31T16:00:00.000Z",
	            "LocksSold": 1,
	            "StocksSold": 1,
	            "BarrelsSold": 1,
	            "TownName": "",
	            "_id": "5334c3e8a34fae2421000001",
	            "__v": 0
	        }]};

		beforeEach(module('SalesApp'));

		beforeEach(inject(function($injector) {

				var $rootScope = $injector.get('$rootScope');
				var $controller = $injector.get('$controller');
				$httpBackend = $injector.get('$httpBackend');

				$httpBackend.expectGET('/api/sales').respond(sales);

				scope =$rootScope.$new();
				$controllerConstructor = $controller;
	}));

	afterEach(function() {
	});

	it('should set the scope limits to their initial values', function() {

		var testLimits = {
		"BarrelsLeft" : 90, 
		"LocksLeft" : 70, 
		"StocksLeft" : 80 };

		var ctrl = $controllerConstructor('mainController',{
			$scope:scope
		});

		expect(scope.limits).toEqual(testLimits);
	});

	it('should get sales from the database', function() {

		var ctrl = $controllerConstructor('mainController',{
			$scope:scope
		});
		//console.log(scope.sales);
		$httpBackend.flush();
		expect(scope.sales).toEqual(sales.sales);
	});

	it('show tell sally to STFU', function() {
		expect('hello').toEqual('hello');
	});

});