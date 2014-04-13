function adminController($scope, $http) {

	$scope.getSales = function() {
		$http.get('/api/sales')
		.success(function(data) {
			$scope.sales = data.sales;
			$scope.towns = data.towns;

		})
		.error(function(data) {
			console.log('Error: ' + data);
		});

	};

	$scope.getSales();

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

}