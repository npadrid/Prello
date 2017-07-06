var mongoose = require('mongoose');
var listSchema = mongoose.Schema({
  title: String,
  cards: Array
})

module.exports = mongoose.model('List', listSchema);
