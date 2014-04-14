function salesController($scope, $http) {

	//Initialize sales array
	$scope.sales = {
		"LocksSold":0,
		"StocksSold":0,
		"BarrelsSold":0
	}

	/*$scope.limits = {
		"BarrelsLeft" : 90, 
		"LocksLeft" : 70, 
		"StocksLeft" : 80 };*/

	$scope.formData = {};
	$scope.theDate = new Date();
	$scope.months = ['January','February','March',
					'April','May','June',
					'July','August', 'September',
					'October','November','December'];

	$scope.Prices = {
		'Locks': 45,
		'Stocks': 30,
		'Barrels': 25
	};

	$scope.soldWholeGun = 'hide';

	$scope.totalItemSales = function(itemName){

		var totalItemSales = 0;

		totalItemSales = $scope.totalItemsSold(itemName) * $scope.Prices[itemName];

		return totalItemSales;
	};

	$scope.totalItemsSold = function(itemName){
		
		var totalItems = 0;

		for (var i = 0; i < $scope.sales.length; i++) {
			//totalItems += parseInt($scope.sales[i].TotalSales[0][itemName + 'Sold']);
			totalItems += parseInt($scope.sales[i][itemName+'Sold']);
		}

		return totalItems;
	};

	//Get total items left depending on total stock and how many sold items

	$scope.totalSales = function(){
		var totalSales = 0;

		totalSales += $scope.totalItemsSold('Locks') * 45;
		totalSales += $scope.totalItemsSold('Stocks') * 30;
		totalSales += $scope.totalItemsSold('Barrels') * 25;

		return totalSales;
	};

	$scope.totalLocalSales = function(location) {
		var total =0;

		total += location.LocksSold * 45;
		total += location.StocksSold * 30;
		total += location.BarrelsSold * 25;

		return total;
	};

	$scope.getSalesBetweenDates = function() {

		var today = new Date();
		var year = today.getFullYear();
		var month = today.getMonth()+1;

			$http.get('/api/sales/'+month+'/'+year+'/'+month+'/'+year)
		.success(function(data) {
				$scope.sales = data.sales;
				$scope.towns = data.towns;
				$scope.monthEnded = data.hasEndedMonth;
				console.log($scope.monthEnded);

				$scope.soldWholeGun = $scope.soldAWholeGun();
				console.log(data.limits);

				$scope.numberOfLocksLeft = data.limits.LocksLeft;

				$scope.numberOfStocksLeft = data.limits.StocksLeft;

				$scope.numberOfBarrelsLeft = data.limits.BarrelsLeft;

			})
		.error(function(data) {
			console.log('Error: ' + data);
		});
			
	};

	$scope.getSalesBetweenDates();

	$scope.addSale = function() {

		console.log($scope.formData);

		if (parseInt($scope.formData.LocksSold) > $scope.numberOfLocksLeft || 
			parseInt($scope.formData.StocksSold) > $scope.numberOfStocksLeft || 
			parseInt($scope.formData.BarrelsSold) > $scope.numberOfBarrelsLeft) {
		} else {
			$http.post('/api/sales', $scope.formData)
				.success(function(data) {
					$scope.formData = {}; 
					$scope.sales = data.sales;
					
					$scope.numberOfLocksLeft = data.limits.LocksLeft;

					$scope.numberOfStocksLeft = data.limits.StocksLeft;

					$scope.numberOfBarrelsLeft = data.limits.BarrelsLeft;

					console.log(data);
				})
				.error(function(data) {
					console.log('Error: ' + data);
				});
			}
	};

	$scope.endMonth = function() {
		$http.post('/api/endMonth', $scope.formData)
			.success(function(data) {
				$scope.monthEnded = data.CantSell;
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

	$scope.soldAWholeGun = function() {

		if ($scope.totalItemsSold('Locks') === 0 ||
			$scope.totalItemsSold('Stocks') === 0 ||
			$scope.totalItemsSold('Barrels') === 0 ) {
			return '';
		} else {
			return 'hide';	
		}
	};

	$scope.getArrayOfSize = function(size){
		var a = [];

		for (var i = 0; i < size+1; i++) {
			a[i] = i;
		};
		return a;
	};
}