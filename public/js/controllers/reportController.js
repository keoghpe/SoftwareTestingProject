function reportController($scope, $http) {

	$scope.user = 1;

	//Initialize sales array
	$scope.sales = {
		"LocksSold":0,
		"StocksSold":0,
		"BarrelsSold":0
	}

	$scope.formData = {};
	$scope.reportSales = {};

	$scope.showGraph = function() {

		console.log("sale "+$scope.totalItemsSold('Locks'));
		$scope.data = {
			series: ['Locks', 'Stocks', 'Barrels'],
			data : [{
				x : "Products",
				y: [$scope.totalItemsSold('Locks'), $scope.totalItemsSold('Stocks'), $scope.totalItemsSold('Barrels')]
			}]     
		}

		$scope.chartType = 'bar';

		$scope.config = {
			labels: false,
			title : "Not Products",
			legend : {
				display:true,
				position:'left'
			}
		}

};

	
	$scope.totalCommissionSum = 0;
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

			//$scope.soldWholeGun = $scope.soldAWholeGun();
			//console.log("Sold "+$scope.soldWholeGun);

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
			$scope.reportContainer = [];
			$scope.reportSales = {};
			$scope.reportSalesAllUsers = {};

			// Restructure information in sales and add it to reportSales
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

			$scope.sales.forEach(function(entry) {
				var res = entry.DateOfSale.substring(0,7);
				var salesPerson = entry.SalesPerson;
				console.log("Person "+entry.SalesPerson); 

				if($scope.reportSalesAllUsers[res] == null) {
					//Initiate the variable
					$scope.reportSalesAllUsers[res] = {};
					$scope.reportSalesAllUsers[res][salesPerson] = {};
					$scope.reportSalesAllUsers[res][salesPerson].LocksSold = parseInt(entry.LocksSold);
					$scope.reportSalesAllUsers[res][salesPerson].StocksSold = parseInt(entry.StocksSold);
					$scope.reportSalesAllUsers[res][salesPerson].BarrelsSold = parseInt(entry.BarrelsSold);
				} else{
					$scope.reportSalesAllUsers[res][salesPerson].LocksSold += parseInt(entry.LocksSold);
					$scope.reportSalesAllUsers[res][salesPerson].StocksSold += parseInt(entry.StocksSold);
					$scope.reportSalesAllUsers[res][salesPerson].BarrelsSold += parseInt(entry.BarrelsSold);
				}
			});

			$scope.reportContainer[0] = $scope.reportSales;

			$scope.showGraph();

			//$scope.totalCommission();

		})
		.error(function(data) {
			console.log('Error: ' + data);
		});
			
	};

	$scope.getSalesBetweenDates();

	$scope.calculateCommission = function(month, sales) {

		var commission = 0;

		if($scope.reportSales[month].LocksSold > 0 && $scope.reportSales[month].StocksSold > 0 && 
			$scope.reportSales[month].BarrelsSold > 0) {

			if (sales <= 1000) {
				commission = sales * .1;
			} else if (sales <= 1800) {
				commission = 100 + ((sales - 1000) * .15);
			} else if (sales > 1800) {
				commission = 220 + ((sales - 1800) * .2);
			}

		}

		$scope.reportSales[month].totalCommission = commission;

		return commission;
	};

	$scope.totalCommission = function() {

		var totalCommissionSum = 0;

			$scope.reportContainer.forEach(function(entry) {

					angular.forEach(entry,function(element) {

						totalCommissionSum += element.totalCommission;

					});


			});

		return totalCommissionSum;

	}

}
