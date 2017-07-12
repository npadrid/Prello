var mongoose = require('mongoose');
var listSchema = mongoose.Schema({
  title: String,
  bid: String,
  cards: Array
})

module.exports = mongoose.model('List', listSchema);
