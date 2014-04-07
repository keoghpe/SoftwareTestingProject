function reportController($scope, $http) {

	//Initialize sales array
	$scope.sales = {
		"LocksSold":0,
		"StocksSold":0,
		"BarrelsSold":0
	}

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

		$http.get('/api/sales')
		.success(function(data) {
			$scope.sales = data.sales;
			$scope.towns = data.towns;

			$scope.soldWholeGun = $scope.soldAWholeGun();
			console.log("Sold "+$scope.soldWholeGun);

		})
		.error(function(data) {
			console.log('Error: ' + data);
		});

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

	$scope.totalSales = function(){
		var totalSales = 0;

		totalSales += $scope.totalItemsSold('Locks') * 45;
		totalSales += $scope.totalItemsSold('Stocks') * 30;
		totalSales += $scope.totalItemsSold('Barrels') * 25;

		return totalSales;
	};

	$scope.totalLocalSales = function(location) {
		var total =0;

		total += $scope.reportSales[location].LocksSold * 45;
		total += $scope.reportSales[location].StocksSold * 30;
		total += $scope.reportSales[location].BarrelsSold * 25;

		return total;
	};

	$scope.getSalesBetweenDates = function() {

		var today = new Date();
		var year = today.getFullYear();
		var month = today.getMonth()+1;

			$http.get('/api/sales/1/'+year+'/'+month+'/'+year)
		.success(function(data) {
			$scope.sales = data.sales;
			$scope.reportSales = {};

			$scope.sales.forEach(function(entry) {
				var res = entry.DateOfSale.substring(0,7); 

				if($scope.reportSales[res] == null) {
					//Initiate the variable
					$scope.reportSales[res] = {};
					$scope.reportSales[res].LocksSold = parseInt(entry.LocksSold);
					$scope.reportSales[res].StocksSold = parseInt(entry.StocksSold);
					$scope.reportSales[res].BarrelsSold = parseInt(entry.BarrelsSold);
				} else{
					$scope.reportSales[res].LocksSold += parseInt(entry.LocksSold);
					$scope.reportSales[res].StocksSold += parseInt(entry.StocksSold);
					$scope.reportSales[res].BarrelsSold += parseInt(entry.BarrelsSold);
				}
			});

		})
		.error(function(data) {
			console.log('Error: ' + data);
		});
			
	};

	$scope.getSalesBetweenDates();

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
