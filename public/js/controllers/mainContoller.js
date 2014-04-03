function mainController($scope, $http) {

	$scope.limits = {
		"BarrelsLeft" : 90, 
		"LocksLeft" : 70, 
		"StocksLeft" : 80 };

		$http.get('/api/sales')
		.success(function(data) {
			$scope.sales = data.sales;
			//$scope.limits = data.limits;
			$scope.towns = data.towns;

			$scope.numberOfLocksLeft = [];
			for (var i=0; i<$scope.totalItemsLeft('Locks')+1; i++) 
				$scope.numberOfLocksLeft.push(i);

			$scope.numberOfStocksLeft = [];
			for (var i=0; i<$scope.totalItemsLeft('Stocks')+1; i++) 
				$scope.numberOfStocksLeft.push(i);

			$scope.numberOfBarrelsLeft = [];
			for (var i=0; i<$scope.totalItemsLeft('Barrels')+1; i++) 
				$scope.numberOfBarrelsLeft.push(i);
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});

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
	$scope.totalItemsLeft = function(itemName) {

		var totalItems = 0;
		var totalItemInStock = 0;

		for (var i = 0; i < $scope.sales.length; i++) {
			//totalItems += parseInt($scope.sales[i].TotalSales[0][itemName + 'Sold']);
			totalItems += parseInt($scope.sales[i][itemName+'Sold']);
		}

		//console.log("Left"+$scope.limits[itemName+'Left']+"Sold "+totalItems);

		totalItemInStock = ($scope.limits[itemName+'Left']) - totalItems;

		return totalItemInStock;

	};

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

	$scope.addSale = function() {

		if (parseInt($scope.formData.LocksSold) > $scope.totalItemsLeft('Locks') || 
			parseInt($scope.formData.StocksSold) > $scope.totalItemsLeft('Stocks') || 
			parseInt($scope.formData.BarrelsSold) > $scope.totalItemsLeft('Barrels')) {
		} else {
			$http.post('/api/sales', $scope.formData)
				.success(function(data) {
					$scope.formData = {}; 
					$scope.sales = data.sales;
				//	$scope.limits = data.limits;
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
				$scope.towns = data;
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

	$scope.calculateCommission = function(sales) {

		var commission = 0;

		if($scope.totalItemsSold('Locks') > 0 && $scope.totalItemsSold('Stocks') > 0 && 
			$scope.totalItemsSold('Barrels') > 0) {

			if (sales <= 1000) {
				commission = sales * .1;
			} else if (sales <= 1800) {
				commission = 100 + ((sales - 1000) * .15);
			} else if (sales > 1800) {
				commission = 220 + ((sales - 1800) * .2);
			}

		}

		return commission;
	};

	$scope.soldAWholeGun = function() {

		if ($scope.totalItemsSold('Locks') === 0 ||
			$scope.totalItemsSold('Stocks') === 0 ||
			$scope.totalItemsSold('Barrels') === 0 ) {
			return '';
		} else {
			return 'hide';	
		}
	};
}
