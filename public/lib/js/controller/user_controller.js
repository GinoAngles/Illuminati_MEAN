var app = angular.module('illuminati', []);

app.controller('Ctrl_user', function($scope, $http) {
	$scope.orderByMe = function(x) {
	    $scope.myOrderBy = x;
	};
	$scope.loadUser = function(id, nombre, email) {
		$scope.idInput = id;
		$scope.nombreInput = nombre;
		$scope.emailInput = email;
		$scope.pwdInput = '';
	};
	$scope.createUser = function(){
		$http({
		  method: 'POST',
		  url: '/usuario/createUser',
		  data: {
		  	email: $scope.emailInput,
		  	nombre: $scope.nombreInput,
		  	pwd: $scope.pwdInput
		  },
	      headers: {
	          "Content-Type": "application/json"
	      }
		}).then(function successCallback(response) {
			if(response.data.cod == 'COD003:UsuarioYaExiste'){
				$('#modalIcono').addClass("fa fa-minus-circle text-danger");
				$scope.titleMsgModal = 'Error durante la creación del Usuario.';
				$scope.bodyMsgModal = 'Lo sentimos, pero ese correo ya esta registrado.';
				$('#modalMSG').modal('show');
			}else{
				$('#modalIcono').addClass("fa fa-thumbs-o-up text-success");
				$scope.titleMsgModal = 'Usuario creado correctamente.';
				$scope.bodyMsgModal = 'Acabamos de dar de alta su usuario en el sistema :)';
				$('#modalMSG').modal('show');
				//console.log('Exito al crear el usuario: ' + response + response.data);
			};
		  }, function errorCallback(response) {
			console.log('Error durante la creación de un usuario: ' + response + response.data);
		  });
	};
	$scope.readUsers = function(){	
		$http({
		  method: 'GET',
		  url: '/usuario/readUsers',
	      data: '',
	      headers: {
	          "Content-Type": "application/json"
	      }
		}).then(function successCallback(response) {
			$scope.usuarios = response.data;
			//console.log('Exito al obtener todos los usuarios: ' + response + response.data);
		  }, function errorCallback(response) {
			console.log('Error durante la carga inicial de los usuarios/mongoose: ' + response + response.data);
		  });
	};
	$scope.updateUser = function(){
		$http({
		  method: 'PUT',
		  url: '/usuario/updateUser',
		  data: {
		  	id: $scope.idInput,
		  	nombre: $scope.nombreInput,
		  	email: $scope.emailInput,
		  	pwd: $scope.pwdInput
		  },
	      headers: {
	          "Content-Type": "application/json"
	      }
		}).then(function successCallback(response) {
			$('#modalIcono').addClass("fa fa-thumbs-o-up text-success");
			$scope.titleMsgModal = 'Usuario modificado en el sistema.';
			$scope.bodyMsgModal = 'Se actualizo la información del usuario correctamente.';
			$('#modalMSG').modal('show');
			$scope.usuarios = response.data;
			//console.log('Exito al modificado el usuario: ' + response + response.data);
		  }, function errorCallback(response) {
			console.log('Error durante la modificación de un usuario: ' + response.data + response.data.cod);
		  });
	};
	$scope.deleteUser = function(){
		$http({
		  method: 'DELETE',
		  url: '/usuario/deleteUser/'+$scope.idInput
		}).then(function successCallback(response) {
			$('#modalIcono').addClass("fa fa-thumbs-o-up text-success");
			$scope.titleMsgModal = 'Usuario borrado del sistema.';
			$scope.bodyMsgModal = 'Se borro el usuario correctamente.';
			$('#modalMSG').modal('show');
			$scope.usuarios = response.data;
			//console.log('Exito al borrar el usuario: ' + response + response.data);
		  }, function errorCallback(response) {
			console.log('Error durante el borrado de un usuario: ' + response + response.data);
		  });
	};
	$scope.login = function() {
		$http({
		  method: 'POST',
		  url: '/usuario/login',
		  data: {
		  	email: $scope.emailLogin,
		  	pwd: $scope.pwdLogin
		  },
	      headers: {
	          "Content-Type": "application/json"
	      }
		}).then(function successCallback(response) {
		    // this callback will be called asynchronously
		    // when the response is available
			if(response.data.cod == 'COD001:LoginCorrecto'){
				sessionStorage.setItem('usuario.id', response.data.usuario.id);
				sessionStorage.setItem('usuario.email', response.data.usuario.email);
				sessionStorage.setItem('usuario.nombre', response.data.usuario.nombre);
				sessionStorage.setItem('usuario.tipo', response.data.usuario.tipo);
				sessionStorage.setItem('usuario.avatar', response.data.usuario.avatar);

				$('#modalIcono').addClass("fa fa-thumbs-o-up text-success");
				$scope.titleMsgModal = 'Muy Bien, Estas dentro del sistema.';
				$scope.bodyMsgModal = 'Todo bien, todo correcto :) ';
				$('#modalMSG').modal('show');

				$('#modalMSG').on('hidden.bs.modal', function () {
					window.location.href = "panel_control.html";
				});
			}else if(response.data.cod == 'COD002:LoginIncorrecto'){
				$('#modalIcono').addClass("fa fa-minus-circle text-danger");
				$scope.titleMsgModal = 'Error al Autentificarte.';
				$scope.bodyMsgModal = 'Por favor, intentelo de nuevo.';
				$('#modalMSG').modal('show');
			}else{
				$('#modalIcono').addClass("fa fa-minus-circle text-danger");
				$scope.titleMsgModal = 'Error muy raro :S';
				$scope.bodyMsgModal = 'Mira a ver los controladores.';
				$('#modalMSG').modal('show');
			};
		  }, function errorCallback(response) {
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
			console.log('Error durante el login de un usuario: ' + response + response.data);
		  });
	};
	$scope.compruebaAdmin = function (){
		if(sessionStorage.getItem('usuario.tipo') != null && sessionStorage.getItem('usuario.tipo') == 'root'){
			return true;
		}else{
			return false;
		};
	};
});