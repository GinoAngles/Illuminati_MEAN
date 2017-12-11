var mongoose = require('mongoose');

var usuario = new mongoose.Schema({
  //text: {type: String, default: ''}
  email: {type: String, unique: true, required: true, dropDups: true},
  nombre: {type: String, required: true},
  hash: {type: String},
  salt: {type: String},
  avatar: {type: String}
});

module.exports = mongoose.model('usuario', usuario);