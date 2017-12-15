//Cargamos el modelo/schema de mongoose.
var Entrada = require('./entrada');

module.exports = function(app){
	// CREATE POST una entrada en el foro.
	app.post('/foro/createEntrada', function (req, res) {
		if(req.body.video_url==''){
			var video_incrustado = '';
		}else{
			var video_incrustado = "https://www.youtube.com/embed/"+req.body.video_url;
		}
		Entrada.create({
			usuario: req.body.usuario,
			asunto: req.body.asunto,
			msg: req.body.msg,
			fecha: req.body.fecha,
			avatar: req.body.avatar,
			video_url: video_incrustado,
			quote: req.body.quote
		}, function (err, entry){
			if(err) {
				//console.log('error en el API_foro.js createEntrada');
				res.send(err);
			}
			Entrada.find({}, function (err, entry) {
				if(err) {
					//console.log('error en el API_foro.js deleteUser find');
					res.send(err);
				}
				//console.log('Todas las entrys despues del create: '+entry);
				res.json(entry);
			});

		});
	});
	// READ de todas los Entradas.
	app.get('/foro/readEntradas', function (req, res) {	
		Entrada.find({}, function (err, entry) {
			if(err) {
				//console.log('error en el API_foro.js readEntradas');
				res.send(err);
			}
			//console.log('Todas Entradas: '+entry);
			res.json(entry);
		});
	});
	// UPDATE de un Entrada específico y devuelve todos tras actualizarlo.
	app.put('/foro/updateEntrada', function (req, res){
		Entrada.update({ _id: req.body.id },
			{ $set: { msg: req.body.msg, fecha: req.body.fecha }}, {upsert: true},
			function (err, updatedEntrada){
				if(err){
					//console.log('Error al modificar el Entrada: '+updatedEntrada);					
					res.send(err);
				}

				//Enviamos todos los Entradas junto con el modificado.
				Entrada.find({}, function (err, Entradas) {
					if(err) {
						//console.log('error en el API_foro.js updateUser find');
						res.send(err);
					}
					//console.log('Todos Entradas despues del modificado: '+Entradas);
					res.json(Entradas);
				});

			});
	});
	app.put('/foro/updateEntradaAvatar', function (req, res){
		Entrada.update({ usuario: req.body.usuario },
			{ $set: { avatar: req.body.avatar }}, {upsert: false, multi: true},
			function (err, updatedEntrada){
				if(err){
					//console.log('Error al modificar el Entrada: '+err+updatedEntrada);	
					res.json({ cod: 'COD008:Fallo al Actualizar el Documento (API_foro)(Mongoose)' });
				}else{
					res.json({ cod: 'COD009:AvatarOkEntry' });
				}
			});
	});
	app.put('/foro/addLike', function (req, res){
		Entrada.update({ _id: req.body.id },
			{ $addToSet: { likes: req.body.email}}, {upsert: false},
			function (err, updatedEntrada){
				if(err){
					//console.log('Error al modificar el Entrada: '+err+updatedEntrada);	
					res.json({ cod: 'COD012:ErrorAlDarLike-'+req.body.email+'-'+req.body.id });
				}else{
					//Enviamos todos los Entradas junto con el modificado.
					Entrada.find({}, function (err, Entradas) {
						if(err) {
							res.send(err);
						}else{
							res.json({ cod: 'COD011:AddLikeOk', datos: Entradas });
						}
					});
				}
			});
	});

	// DELETE de un Entrada específico y devuelve todos tras borrarlo.
	app.delete('/foro/deleteEntrada/:id', function (req, res) {
		Entrada.remove({_id: req.params.id}, function (err, id) {
			if(err){
				//console.log('error en el API_foro.js deleteUser');
				res.send(err);
			}
			Entrada.find({}, function (err, Entradas) {
				if(err) {
					//console.log('error en el API_foro.js deleteUser find');
					res.send(err);
				}
				//console.log('Todos Entradas despues del borrado: '+Entradas);
				res.json(Entradas);
			});
		});
	});


};

	