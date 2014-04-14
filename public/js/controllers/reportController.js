function reportController($route, $scope, $http) {
	this.$route = $route;

	//Get current page
	$scope.currentURL = $route.current.templateUrl;

	//Initialize sales array
	$scope.sales = {
		"LocksSold":0,
		"StocksSold":0,
		"BarrelsSold":0
	}
	$scope.salesPersons = [];
	$scope.salesDate = [];
	$scope.itemsForMonthUser = [];
	$scope.formData = {};
	$scope.reportSales = {};

	$scope.showGraphUser = function() {

		$scope.data = {
			series: ['Locks', 'Stocks', 'Barrels'],
			data : $scope.itemsForMonthUser    
		}

		$scope.chartType = 'bar';

		$scope.config = {
			labels: false,
			title : "Items sold",
			legend : {
				display:true,
				position:'left'
			}
		}



	};

	$scope.showGraphAdmin = function() {

		$scope.data = {
			series: ['Locks', 'Stocks', 'Barrels'],
			data : $scope.salesPersons
		}

		$scope.chartType = 'bar';

		$scope.config = {
			labels: false,
			title : "Products sold",
			legend : {
				display:true,
				position:'left'
			}
		}

		$scope.data2 = {
			series: ['Sales'],
			data : $scope.salesDate
		}

		$scope.chartType2 = 'line';

		$scope.config2 = {
			labels: false,
			title : "Dates",
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

	$scope.totalLocalSales = function(salesArray, location) {
		var total =0;

		total += $scope[salesArray][location].LocksSold * 45;
		total += $scope[salesArray][location].StocksSold * 30;
		total += $scope[salesArray][location].BarrelsSold * 25;

		return total;
	};

	$scope.totalLocalSalesForUser = function(user) {
		var total =0;

		total += $scope.reportSalesAllUsers[user].LocksSold * 45;
		total += $scope.reportSalesAllUsers[user].StocksSold * 30;
		total += $scope.reportSalesAllUsers[user].BarrelsSold * 25;

		return total;
	};

	/*$scope.totalSalesDate = function(location) {
		var total =0;

		total += $scope.reportSalesDates[location].LocksSold * 45;
		total += $scope.reportSalesDates[location].StocksSold * 30;
		total += $scope.reportSalesDates[location].BarrelsSold * 25;

		return total;
	}; */


	$scope.getSalesBetweenDates = function() {


		var today = new Date();
		var year = today.getFullYear();
		var month = today.getMonth()+1;

			$http.get('/api/sales/1/'+year+'/'+month+'/'+year)
		.success(function(data) {
			$scope.sales = data.sales;
			$scope.reportContainer = [];
			$scope.reportSales = {};
			$scope.dates = {};
			$scope.products = [];

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

			angular.forEach($scope.reportSales,function(value,key) {

				$scope.itemsForMonthUser.push({'x' : key,'y': [value.LocksSold,value.StocksSold,value.BarrelsSold]});


			});


			$scope.reportContainer[0] = $scope.reportSales;
			//$scope.totalCommission();

		})
		.error(function(data) {
			console.log('Error: ' + data);
		});
			
	};

	$scope.getSales = function() {

			$http.get('/api/sales/')
		.success(function(data) {
			$scope.sales = data.sales;

			$scope.reportContainer = [];
			//$scope.reportSales = {};
			$scope.reportSalesAllUsers = {};

			$scope.reportSalesDates = {};

			//$scope.reportSalesAllUsers = {};

			// Restructure information in sales and add it to reportSales
			$scope.sales.forEach(function(entry) {
				var res = entry.DateOfSale.substring(0,7); 

				if($scope.reportSalesDates[res] == null) {
					//Initiate the variable
					$scope.reportSalesDates[res] = {};
					$scope.reportSalesDates[res].LocksSold = parseInt(entry.LocksSold);
					$scope.reportSalesDates[res].StocksSold = parseInt(entry.StocksSold);
					$scope.reportSalesDates[res].BarrelsSold = parseInt(entry.BarrelsSold);
				} else{
					$scope.reportSalesDates[res].LocksSold += parseInt(entry.LocksSold);
					$scope.reportSalesDates[res].StocksSold += parseInt(entry.StocksSold);
					$scope.reportSalesDates[res].BarrelsSold += parseInt(entry.BarrelsSold);
				}
			});

				angular.forEach($scope.reportSalesDates,function(value,key) {

				$scope.salesDate.push({'x' : key,'y': [$scope.totalLocalSales('reportSalesDates',key)]});


			}); 

					$scope.sales.forEach(function(entry) {
				var res = entry.DateOfSale.substring(0,7);
				var salesPerson = entry.SalesPerson;

				if($scope.reportSalesAllUsers[salesPerson] == null) {
					//Initiate the variable
					//$scope.reportSalesAllUsers[res] = {};
					$scope.reportSalesAllUsers[salesPerson] = {};
					//$scope.salesPersons.push({'x' : salesPerson,'y': [entry.LocksSold,entry.StocksSold, entry.BarrelsSold]});
					$scope.reportSalesAllUsers[salesPerson].LocksSold = parseInt(entry.LocksSold);
					$scope.reportSalesAllUsers[salesPerson].StocksSold = parseInt(entry.StocksSold);
					$scope.reportSalesAllUsers[salesPerson].BarrelsSold = parseInt(entry.BarrelsSold);
				} else{
					$scope.reportSalesAllUsers[salesPerson].LocksSold += parseInt(entry.LocksSold);
					$scope.reportSalesAllUsers[salesPerson].StocksSold += parseInt(entry.StocksSold);
					$scope.reportSalesAllUsers[salesPerson].BarrelsSold += parseInt(entry.BarrelsSold);
				}
			}); 

			angular.forEach($scope.reportSalesAllUsers,function(value,key) {

				$scope.salesPersons.push({'x' : key,'y': [value.LocksSold,value.StocksSold, value.BarrelsSold]});


			}); 




			$scope.reportContainer[0] = $scope.reportSalesDates;

			//$scope.totalCommission();

		})
		.error(function(data) {
			console.log('Error: ' + data);
		});
			
	};

	// Check if user or admin is logged in and fetch data for user
	if($scope.currentURL.contains("sales-report-user")) {
			$scope.getSalesBetweenDates();	
			$scope.showGraphUser();
	} else if($scope.currentURL.contains("sales-report-admin")) {
			$scope.getSales();
			$scope.showGraphAdmin();
	}

	$scope.calculateCommission = function(salesArray,month, sales) {

		var commission = 0;

		if($scope[salesArray][month].LocksSold > 0 && $scope[salesArray][month].StocksSold > 0 && 
			$scope[salesArray][month].BarrelsSold > 0) {

			if (sales <= 1000) {
				commission = sales * .1;
			} else if (sales <= 1800) {
				commission = 100 + ((sales - 1000) * .15);
			} else if (sales > 1800) {
				commission = 220 + ((sales - 1800) * .2);
			}

		}

		$scope[salesArray][month].totalCommission = commission;

		return commission;
	};

	$scope.calculateCommissionForUser = function(salesArray,user, sales) {

		var commission = 0;

		if($scope[salesArray][user].LocksSold > 0 && $scope[salesArray][user].StocksSold > 0 && 
			$scope[salesArray][user].BarrelsSold > 0) {

			if (sales <= 1000) {
				commission = sales * .1;
			} else if (sales <= 1800) {
				commission = 100 + ((sales - 1000) * .15);
			} else if (sales > 1800) {
				commission = 220 + ((sales - 1800) * .2);
			}

		}

		$scope[salesArray][user].totalCommission = commission;

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
