//Cargamos el modelo/schema de mongoose.
var Usuario = require('./usuario');
//Cargamos el modulo de crypto para funciones hash.
var crypto = require('crypto');

module.exports = function(app){
	// CREATE POST un usuario.
	app.post('/usuario/createUser', function (req, res) {
		Usuario.findOne({ email: req.body.email }, function (err, usuario) {
			if(usuario==null){
				var _salt = crypto.randomBytes(16).toString('hex');
				Usuario.create({
					email: req.body.email,
					nombre: req.body.nombre,
					hash: crypto.pbkdf2Sync(req.body.pwd, _salt, 1000, 64, 'sha512').toString('hex'),
					salt: _salt,
					avatar: 'lib/img/default.png'
				}, function (err, user){
					if(err) {
						//console.log('error en el API_usuario.js createUser');
						res.send(err);
					}
					//console.log('Creado usuario: '+user);
					res.json(user);
				});
			}else{
			  	//console.log('El Usuario ya existe');
			  	res.json({ cod: 'COD003:UsuarioYaExiste' });
			};
		});
	});

	// READ de todos los usuarios.
	app.get('/usuario/readUsers', function (req, res) {	
		Usuario.find({}, function (err, usuarios) {
			if(err) {
				//console.log('error en el API_usuario.js readUsers');
				res.send(err);
			}
			//console.log('Todos usuarios: '+usuarios);
			res.json(usuarios);
		});
	});

	// UPDATE de un usuario específico y devuelve todos tras actualizarlo.
	app.put('/usuario/updateUser', function (req, res){
		Usuario.findOne({ _id: req.body.id }, function (err, usuario){
			if(usuario!=null){

				Usuario.update({ _id: req.body.id },
				{ $set: { nombre: req.body.nombre, email: req.body.email, hash: crypto.pbkdf2Sync(req.body.pwd, usuario.salt, 1000, 64, 'sha512').toString('hex') }}, {upsert: true}, function (err, updatedUsuario){
					if(err){
						//console.log('Error al modificar el usuario: '+updatedUsuario);					
						res.send(err);
					}
					//Enviamos todos los usuarios junto con el modificado.
					Usuario.find({}, function (err, usuarios) {
						if(err) {
							//console.log('error en el API_usuario.js updateUser find');
							res.send(err);
						}
						//console.log('Todos usuarios despues del modificado: '+usuarios);
						res.json(usuarios);
					});
				});

			}else{
				res.json({ cod: 'COD004:Algo Raro Desde La Vista con el ID que Cargas.' });
			}
		});

	});
	app.put('/usuario/updateUserAvatar', function (req, res){
		Usuario.findOne({ _id: req.body.id }, function (err, usuario){
			if(usuario!=null){

				Usuario.update({ _id: req.body.id },
				{ $set: { avatar: req.body.avatar }}, {upsert: true}, function (err, updatedUsuario){
					if(err){
						//console.log('Error al modificar el usuario: '+updatedUsuario);
						res.json({ cod: 'COD007:Fallo al Actualizar el Documento (API_usuario)(Mongoose)' });
					}else{
						res.json({ cod: 'COD006:AvatarOK' });
					}	
				});
			}else{
				res.json({ cod: 'COD004:Algo Raro Desde La Vista con el ID que Cargas.' });
			}
		});

	});

	// DELETE de un usuario específico y devuelve todos tras borrarlo.
	app.delete('/usuario/deleteUser/:id', function (req, res) {
		Usuario.remove({_id: req.params.id}, function (err, id) {
			if(err){
				//console.log('error en el API_usuario.js deleteUser');
				res.send(err);
			}
			Usuario.find({}, function (err, usuarios) {
				if(err) {
					//console.log('error en el API_usuario.js deleteUser find');
					res.send(err);
				}
				//console.log('Todos usuarios despues del borrado: '+usuarios);
				res.json(usuarios);
			});
		});
	});

	//Funcion de LOGIN que devulve un codigo.
	app.post('/usuario/login', function (req, res) {
		Usuario.findOne({ email: req.body.email }, function (err, usuario) {
			if(usuario!=null){
				if( usuario.hash == crypto.pbkdf2Sync(req.body.pwd, usuario.salt, 1000, 64, 'sha512').toString('hex') ){
					var usuarioItem = new Object();
				  	usuarioItem.id = usuario._id;
				  	usuarioItem.email = usuario.email;
				  	usuarioItem.nombre = usuario.nombre;
				  	usuarioItem.avatar = usuario.avatar;
				  	if(usuario.email.toUpperCase() == 'legend@gmail.com'.toUpperCase()){
				  		usuarioItem.tipo='root';
				  	}else{
				  		usuarioItem.tipo='pleb';
				  	};
				  	res.json({ cod: 'COD001:LoginCorrecto', usuario: usuarioItem });
				}else{
					//Existe el email pero no coincide la contraseña.
				  	res.json({ cod: 'COD002:LoginIncorrecto' });
				}
			}else{
				//No existe ese email.
				res.json({ cod: 'COD002:LoginIncorrecto' });
			}
		});
	});

};

	