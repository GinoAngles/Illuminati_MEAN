var app = angular.module('illuminati', []);

app.controller('Ctrl_panelControl', function($scope, $http) {
	$scope.avatar = { url: 'default' };
	$scope.start = function(){
		$scope.usuario_id = sessionStorage.getItem('usuario.id');
		$scope.usuario_nombre = sessionStorage.getItem('usuario.email');
		$scope.usuario_email = sessionStorage.getItem('usuario.nombre');
		$scope.usuario_tipo = sessionStorage.getItem('usuario.tipo');
	};
	$scope.compruebaSiLogIn = function(){
		if(sessionStorage.getItem('usuario.email') == null){
			return false;
		}else{
			return true;
		}
	};
	$scope.logout = function(){
		sessionStorage.clear();
		$scope.titleMsgModal = 'Log Out Correcto.';
		$scope.bodyMsgModal = 'Esperamos que vuelvas pronto, saludos.';
		$('#modalMSG').modal('show');
		$('#modalMSG').on('hidden.bs.modal', function () {
			window.location.href = "index.html";
		});
	};
	$scope.updateUserAvatar = function(){
		var url = 'lib/img/'+$scope.avatar.url+'.png';
		$http({
		  method: 'PUT',
		  url: '/usuario/updateUserAvatar',
		  data: {
		  	id: sessionStorage.getItem('usuario.id'),
		  	avatar: url
		  },
	      headers: {
	          "Content-Type": "application/json"
	      }
		}).then(function successCallback(response) {

			if(response.data.cod == 'COD006:AvatarOK'){
				$http({
				  method: 'PUT',
				  url: '/foro/updateEntradaAvatar',
				  data: {
				  	usuario: sessionStorage.getItem('usuario.email'),
				  	avatar: url
				  },
			      headers: {
			          "Content-Type": "application/json"
			      }
				}).then(function successCallback(response2) {

					if(response2.data.cod == 'COD009:AvatarOkEntry'){

						$scope.titleMsgModal = 'Avatar Modificado.';
						$scope.bodyMsgModal = 'Su avatar se ha actualizado correctamente en el sistema.';
						sessionStorage.setItem('usuario.avatar', url);
						$('#modalMSG').modal('show');
					}else{
						$scope.titleMsgModal = 'Error durante la modificación.';
						$scope.bodyMsgModal = 'Ha ocurrido un error durante la modificación del avatar en el sistema2.';
						$('#modalMSG').modal('show');
					}
				  }, function errorCallback(response2) {
					console.log('Error durante la modificación de una/unas entradas(avatar): ' + response2 + response2.data.cod);
				  });
			}else{
				$scope.titleMsgModal = 'Error durante la modificación.';
				$scope.bodyMsgModal = 'Ha ocurrido un error durante la modificación del avatar en el sistema.';
				$('#modalMSG').modal('show');
			}
		  }, function errorCallback(response) {
			console.log('Error durante la modificación de un usuario/avatar: ' + response.data + response.data.cod);
		  });
	};
});