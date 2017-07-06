var mongoose = require('mongoose');
var boardSchema = mongoose.Schema({
  title: String,
  lists: Array
})

module.exports = mongoose.model('Board', boardSchema);
