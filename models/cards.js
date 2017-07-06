var mongoose = require('mongoose');
var cardSchema = mongoose.Schema({
  //title: String,
  labels: Array,
  description: String,
  users: Array
  //author: String,
  //comments: Array
})

module.exports = mongoose.model('Cards', cardSchema);
