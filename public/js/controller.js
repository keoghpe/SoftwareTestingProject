var SalesApp = angular.module('SalesApp', [
	'ngRoute']);

SalesApp.config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
		when('/submitSales', {
			templateUrl:'partials/submit-sales.html',
			controller: 'mainController'
		}).
		when('/salesReport', {
			templateUrl:'partials/sales-report.html',
			controller: 'mainController'
		}).
		when('/admin', {
			templateUrl:'partials/admin.html',
			controller: 'mainController'
		}).
		otherwise({
			redirectTo:'/submitSales'
		});

	}]);

function mainController($scope, $http) {
	$scope.formData = {};
	$scope.theDate = new Date();
	$scope.months = ['January','February','March',
					'April','May','June',
					'July','August', 'September',
					'October','November','December'];

	$scope.totalLocksSold = function(){
		var totalLocks = 0;

		for (var i = 0; i < $scope.sales.length; i++) {
			totalLocks += parseInt($scope.sales[i].TotalSales[0].LocksSold);
			
		}

		return totalLocks;
	};

	$scope.totalStocksSold = function(){
		var totalStocks = 0;

		for (var i = 0; i < $scope.sales.length; i++) {
			totalStocks += parseInt($scope.sales[i].TotalSales[0].StocksSold);
			
		}

		return totalStocks;
	};

	$scope.totalBarrelsSold = function(){
		var totalBarrels = 0;

		for (var i = 0; i < $scope.sales.length; i++) {
			totalBarrels += parseInt($scope.sales[i].TotalSales[0].BarrelsSold);
			
		}

		return totalBarrels;
	};

	$scope.totalLocalSales = function(location) {
		var total =0;

		total += location.LocksSold * 45;
		total += location.StocksSold * 30;
		total += location.BarrelsSold * 25;

		return total;
	};

	$http.get('/api/sales')
		.success(function(data) {
			$scope.sales = data.sales;
			$scope.limits = data.limits;
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});

	$scope.addSale = function() {

		if (parseInt($scope.formData.LocksSold) > $scope.limits.LocksLeft || 
			parseInt($scope.formData.StocksSold) > $scope.limits.StocksLeft || 
			parseInt($scope.formData.BarrelsSold) > $scope.limits.BarrelsLeft) {

			console.log('Feck off');

		} else {
			$http.post('/api/sales', $scope.formData)
				.success(function(data) {
					$scope.formData = {}; 
					$scope.sales = data.sales;
					$scope.limits = data.limits;
					console.log(data);
				})
				.error(function(data) {
					console.log('Error: ' + data);
				});
			}
	};

	$scope.addTown = function() {
		$http.post('/api/createTown', $scope.formData)
			.success(function(data) {
				$scope.formData = {};
				$scope.sales = data.sales;
				console.log(data);
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
	};

	$scope.endMonth = function() {
		$http.post('/api/endMonth', $scope.formData)
			.success(function(data) {
				console.log(typeof $scope.theDate);
				$scope.theDate = new Date(parseDate(data.theDate)[0], parseDate(data.theDate)[1]);
				console.log(parseDate(data.theDate));
				console.log($scope.theDate.getMonth());
				console.log($scope.theDate);
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
	};

	$scope.deleteTown = function(name) {
		$http.delete('/api/towns/' + name)
			.success(function(data) {
				$scope.sales = data;
				console.log(data);
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
	};

	function parseDate(dateString){
		var yearMonth = [dateString[0] + "" + dateString[1] + "" + dateString[2] + "" + dateString[3],
		dateString[5] + "" + dateString[6]
		];

		return yearMonth;
	}
}
