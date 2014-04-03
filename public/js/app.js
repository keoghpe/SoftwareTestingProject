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
