var mongoose = require('mongoose');
var boardSchema = mongoose.Schema({
  author: String,
  title: String,
  lists: Array,
  //users: Array
})

module.exports = mongoose.model('Board', boardSchema);
