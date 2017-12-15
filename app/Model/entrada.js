var mongoose = require('mongoose');

var entrada = new mongoose.Schema({
  //text: {type: String, default: ''}
  usuario: {type: String, required: true},
  asunto: {type: String, required: true},
  msg: {type: String, required: true},
  fecha: {type: Date, required: true},
  avatar: {type: String},
  likes: [String],
  video_url: {type: String},
  quote: {type: String}
});

module.exports = mongoose.model('entrada', entrada);