// Servidor de la Aplicación Illuminatis ====================================================
var express 	= require('express');  //Express 4.16.2
var mongoose 	= require('mongoose'); //Mongoose 4.13.5
var methodOverride = require('method-override'); // v2.3.10

var app 		= express();

// Configuraciones  ===========================================================================

var db = require(__dirname + '/app/Model/db'); //URL de mongo db + nombre de la base de datos.
var port = 1337 || process.env.PORT; //Puerto al que creaermos la conexion de la base de datos.

// Creamos La Conexión Mongoose con la base de datos MongoDB
mongoose.connect( db.url , {useMongoClient: true, reconnectTries: 10 }); 
mongoose.Promise = global.Promise;

// Comprobamos si la conexion se ha realizado con exito.
var db_con = mongoose.connection;
db_con.on('error', console.error.bind(console, ' ### Error en la Conexion.'));
db_con.once('open', function() {
  console.log(' ### Conexion realizada con exito.');
});

// Localización de los ficheros estáticos
app.use(express.static(__dirname + '/public'));
// Hace las conversion JSON-String y String-JSON automaticamente.
app.use(express.json());
app.use(express.urlencoded({extended: true})); 
// for parsing application/x-www-form-urlencoded
app.use(methodOverride());

// Rutas API REST ===========================================================================

require(__dirname + '/app/Model/API_usuario')(app);
require(__dirname + '/app/Model/API_foro')(app);

// Ruta al Index para *
app.get('*', function (req, res) {						
	res.sendFile(__dirname + '/public/index.html');
});

// Levantamos el servidor ===================================================================

app.listen( port , function() {
	console.log(' ### Magic happens on port: '+port);
});