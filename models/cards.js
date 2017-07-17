var mongoose = require('mongoose');
var cardSchema = mongoose.Schema({
  author: String,
  title: String,
  description: String,
  labels: Array,
  users: Array,
  comments: Array
})

module.exports = mongoose.model('Cards', cardSchema);
