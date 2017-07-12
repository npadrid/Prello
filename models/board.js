var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Board = new Schema( {
  author: String,
  title: String,
  users: Array //array of user id that have permission
});

module.exports = mongoose.model('Board', Board);
