var app = angular.module('myApp', ['ngAnimate','ui.bootstrap']);

app.constant("Config",
	{
		"titulo_app": "Test Angular Copi",
		"ruta_api": "http://localhost/capi_examen_back_carlos_alberto_medina_arias/public/api/",
		"autor": "Carlos Alberto Medina Arias"
	});

app.controller('myCtrl', function($scope, $http, $uibModal, Config, $log, peticionesHTTP) {
	$scope.dataTable = [];
	
	var $ctrl = this;
	$ctrl.items = ['item1', 'item2', 'item3'];

	$scope.titulo = Config.titulo;

	$scope.request = function ( metodo ) {
		var met = "";
		switch (metodo) {
			case 1:
			met = "GET";
			break;
		}
		$scope.response = peticionesHTTP.peticion( "POST","_Usuarios_Datos");
		
		$scope.response.then(function (r, status) {
			console.log("RRR", r.data.data);
			$scope.dataTable = r.data.data;
		 })
		if ($scope.response) {
			console.log("Controlador", $scope.response,  $scope.response.data);
			
		}
		console.log("Controlador", $scope.response);
	}

	$scope.get = function () {
		$scope.request(1);
		$scope.dataTable = $scope.response;
	}

	/*$scope.get = function() {
		$http({
			method: 'GET',
			dataType: 'json',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			url: Config.ruta_api+"alumnos"+($scope.id_alumno?'/'+$scope.id_alumno:"")
		}).then(function (r, status) {
			$log.log(r);
			$scope.dataTable = r.data.data[0] != null ? r.data.data:[];
		}).catch(function (e, status) {
			$log.error(e);
		});
	}*/

	$scope.get();

	$scope.post = function() {

		var datos = angular.copy($scope.result);
		console.log(datos);
		$http({
			method: 'POST',
			dataType: 'json',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			url: Config.ruta_api+"alumnos",
			data: datos
		}).then(function (r, status) {
			$scope.result = JSON.stringify(r.data.mensaje);
			$scope.get();
		}).catch(function (e, status) {

		});
	}

	$scope.update = function(id_alumno) {
		
		var datos = angular.copy($scope.result);
		$http({
			method: 'PUT',
			dataType: 'json',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			url: Config.ruta_api+"alumnos/"+id_alumno,
			data: datos
		}).then(function (r, status) {
			$scope.result = JSON.stringify(r.data.mensaje);
			$scope.get();
		}).catch(function (e, status) {

		});
	}

	$scope.delete = function(id_alumno) {

		console.log(id_alumno);
		if (id_alumno || id_alumno==0) {
			$http({
				method: 'DELETE',
				dataType: 'json',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				url: Config.ruta_api+"alumnos/"+id_alumno
			}).then(function (r, status) {
				$scope.result = JSON.stringify(r.data.mensaje);
				$scope.id_alumno = "";
				$scope.get();
			}).catch(function (e, status) {

			});
		} else {
			alert("Ingresa un id");
		}
	}


	$scope.openModal = function(size, template) {
		var modalInstance = $uibModal.open({
			animation: false,
			templateUrl: template || 'modals/add-alumno.html',
			controller: 'ModalInstanceCtrl',
			size: "md"
		});
	};

});

app.service("peticionesHTTP", function($http, $log, Config) {
	this.peticion = function(metodo, ruta, datos) {
		
		return $http({
			method: metodo,
			dataType: 'json',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			url: Config.ruta_api+ruta,
			data: datos || ""
		}).then(function (response, status) {
			console.log("http", response);
			return response;
		}).catch(function (error, status) {
			return error;
		});
		
	} ;

})

app.factory('modalFactory', function($uibModal) {
	return {
		open: function(size, template, params) {
			return $uibModal.open({
				animation: false,
				templateUrl: template || 'modals/add-alumno.html',
				controller: 'ModalResultInstanceCtrl',
				size: size,
				resolve: {
					params: function() {

						return params;
					}
				}
			});
		}
	};
});


app.controller('ModalInstanceCtrl', function($scope, $uibModalInstance, modalFactory) {
	$scope.ok = function() {
		modalFactory.open('md', 'modals/result.html', {searchTerm: $scope.searchTerm});
	};

	$scope.save = function() {
	
	};

	$scope.cancel = function() {
		// $uibModalInstance.dismiss('cancel');
		$uibModalInstance.close(false);
	};
});

app.controller('ModalResultInstanceCtrl', function($scope, $uibModalInstance, params) {

	$scope.searchTerm = params.searchTerm;

	$scope.ok = function() {
		$uibModalInstance.close($scope.searchTerm);
	};

	$scope.save = function() {
		$uibModalInstance.close(1);
	};

	$scope.cancel = function() {
		// $uibModalInstance.dismiss('cancel');
		$uibModalInstance.close(false);
	};
});

