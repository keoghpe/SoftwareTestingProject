var AdminApp = angular.module('AdminApp', [
	'ngRoute','angularCharts']);

AdminApp.config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
		when('/salesReport', {
			templateUrl:'partials/sales-report.html',
			controller: 'reportController'
		}).
		when('/admin', {
			templateUrl:'partials/admin.html',
			controller: 'adminController'
		}).
		otherwise({
			redirectTo:'/admin'
		});
	}]);
