var app = angular.module('illuminati', []);

//Le Decimos que las fuentes (iframes) cargadas desde otros dominios (youtube concretamente) es una fuente fiable para insertar video.
app.config(function($sceDelegateProvider) {
  $sceDelegateProvider.resourceUrlWhitelist([
  	// Allow same origin resource loads.       when deployment : http:myapp.myhost.mydomain
    'self',
    // Allow loading from our assets domain.  Notice the difference between * and **.
    'https://www.youtube.com/**'
  ]);
});

app.controller('Ctrl_foro', function($scope, $http) {
	$scope.id_msg = '';
	$scope.orderByMe = function(x) {
	    $scope.myOrderBy = x;
	};
	$scope.loadMSG = function(id, msg){
		$scope.msgInput = msg;
		$scope.id_msg = id;
	};
	$scope.loadMSG2 = function(msg){
		$scope.quoteForo = msg;
	};
	$scope.createEntrada = function(){
		$http({
		  method: 'POST',
		  url: '/foro/createEntrada',
		  data: {
		  	usuario: sessionStorage.getItem('usuario.email'),
		  	asunto: $scope.asuntoForo,
		  	msg: $scope.mensajeForo,
		  	fecha: new Date(),
		  	avatar: sessionStorage.getItem('usuario.avatar'),
		  	video_url: $scope.video_url,
		  	quote: ''
		  },
	      headers: {
	          "Content-Type": "application/json"
	      }
		}).then(function successCallback(response) {
		    // this callback will be called asynchronously
		    // when the response is available
			$('#modalIcono').addClass("fa fa-thumbs-o-up text-success");
			$scope.titleMsgModal = 'Entrada creada correctamente.';
			$scope.bodyMsgModal = 'Se acaba de registrar su entrada en el foro, gracias.';
			$('#modalMSG').modal('show');
			$scope.entradas = response.data;
			$scope.asuntoForo = '';
			$scope.mensajeForo = '';
			$scope.video_url = '';
			//console.log('Exito al crear la entrada: ' + response + response.data);
		  }, function errorCallback(response) {
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
			console.log('Error durante la creación de una entrada: ' + response + response.data);
		  });
	};
	$scope.createQuoteEntrada = function(){
		$http({
		  method: 'POST',
		  url: '/foro/createEntrada',
		  data: {
		  	usuario: sessionStorage.getItem('usuario.email'),
		  	asunto: $scope.asuntoForo2,
		  	msg: $scope.mensajeForo2,
		  	fecha: new Date(),
		  	avatar: sessionStorage.getItem('usuario.avatar'),
		  	video_url: $scope.video_url2,
		  	quote: $scope.quoteForo
		  },
	      headers: {
	          "Content-Type": "application/json"
	      }
		}).then(function successCallback(response) {
		    // this callback will be called asynchronously
		    // when the response is available
			$('#modalIcono').addClass("fa fa-thumbs-o-up text-success");
			$scope.titleMsgModal = 'Entrada creada correctamente.';
			$scope.bodyMsgModal = 'Se acaba de registrar su entrada en el foro, gracias.';
			$('#modalMSG').modal('show');
			$('#modalQuote').modal('hide');
			$scope.entradas = response.data;
			$scope.asuntoForo2 = '';
			$scope.mensajeForo2 = '';
			$scope.video_url2 = '';
			$scope.quoteForo = '';
			//console.log('Exito al crear la entrada: ' + response + response.data);
		  }, function errorCallback(response) {
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
			console.log('Error durante la creación de una entrada: ' + response + response.data);
		  });
	};
	$scope.readEntradas = function(){
		$http({
		  method: 'GET',
		  url: '/foro/readEntradas',
	      data: '',
	      headers: {
	          "Content-Type": "application/json"
	      }
		}).then(function successCallback(response) {
			$scope.entradas = response.data;
			//console.log('Exito al obtener todos los usuarios: ' + response + response.data);
		  }, function errorCallback(response) {
			console.log('Error durante la carga inicial de las entradas/mongoose: ' + response + response.data);
		  });
	};
	$scope.updateEntrada = function(){
		$http({
		  method: 'PUT',
		  url: '/foro/updateEntrada',
		  data: {
		  	id: $scope.id_msg,
		  	msg: $scope.msgInput,
		  	fecha: new Date()
		  },
	      headers: {
	          "Content-Type": "application/json"
	      }
		}).then(function successCallback(response) {
			$('#modalIcono').addClass("fa fa-thumbs-o-up text-success");
			$scope.titleMsgModal = 'Entrada modificada correctamente.';
			$scope.bodyMsgModal = 'Se ha actualizado correctamente la información de su entrada en el foro, gracias.';
			$('#modalMSG').modal('show');
			$scope.entradas = response.data;
			//console.log('Exito al modificado el usuario: ' + response + response.data);
		  }, function errorCallback(response) {
			console.log('Error durante la modificación de una entrada: ' + response + response.data);
		  });
	};
	$scope.deleteEntrada = function(){
		$http({
		  method: 'DELETE',
		  url: '/foro/deleteEntrada/'+$scope.id_msg
		}).then(function successCallback(response) {
			$('#modalIcono').addClass("fa fa-thumbs-o-up text-success");
			$scope.titleMsgModal = 'Mensaje borrado correctamente.';
			$scope.bodyMsgModal = 'Acabamos de eliminar su mensaje de nuestro foro.';
			$('#modalMSG').modal('show');
			$scope.entradas = response.data;
			//console.log('Exito al borrar el usuario: ' + response + response.data);
		  }, function errorCallback(response) {
			console.log('Error durante el borrado de un mensaje: ' + response + response.data);
		  });
	};
	$scope.compruebaSiLogIn = function(){
		return (sessionStorage.getItem('usuario.email') == null) ? false : true;
	};
	$scope.isOwner = function(usuarioVista){
		return (usuarioVista === sessionStorage.getItem('usuario.email') || sessionStorage.getItem('usuario.tipo') === 'root' ) ? true : false;
	};
	$scope.siVideoYT = function(url){
		return (url == null || url === '') ? false : true;
	};
	$scope.siQuote = function(quote){
		return (quote == null || quote === '') ? false : true;
	};
	$scope.addLike = function(id){
		$http({
		  method: 'PUT',
		  url: '/foro/addLike',
		  data: {
		  	id: id,
		  	email: sessionStorage.getItem('usuario.email')
		  },
	      headers: {
	          "Content-Type": "application/json"
	      }
		}).then(function successCallback(response) {
			if(response.data.cod == 'COD011:AddLikeOk'){
				$('#modalIcono').addClass("fa fa-thumbs-o-up text-success");
				$scope.titleMsgModal = 'Todo Bien';
				$scope.bodyMsgModal = 'Acabamos de dar Like al Post, recuerda que solo puedes dar 1 por Post.';
				$('#modalMSG').modal('show');
				$scope.entradas = response.data.datos;
			}else{
				$('#modalIcono').addClass("fa fa-minus-circle text-danger");
				$scope.titleMsgModal = 'Algo ha fallado :S';
				$scope.bodyMsgModal = 'Ha ocurrido un error mientras actualizabamos el like.';
				$('#modalMSG').modal('show');
			}
			//console.log('Exito al modificado el usuario: ' + response + response.data);
		  }, function errorCallback(response) {
			console.log('Error durante la modificación de una entrada(Dando LIKE): ' + response + response.data.cod);
		  });
	};
});