var SalesApp = angular.module('SalesApp', [
	'ngRoute','angularCharts']);

SalesApp.config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
		when('/submitSales', {
			templateUrl:'partials/submit-sales-user.html',
			controller: 'salesController'
		}).
		when('/salesReport', {
			templateUrl:'partials/sales-report.html',
			controller: 'reportController'
		}).
		when('/admin', {
			templateUrl:'partials/admin.html',
			controller: 'adminController'
		}).
		otherwise({
			redirectTo:'/submitSales'
		});
	}]);
