var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Comment = new Schema( {
  content: String,
  author: String,
  date: Date,
});

var Card = new Schema( {
  //title: String,
  author: String,
  labels: Array,
  description: String,
  users: Array,
  comments: [Comment]
});

var List = new Schema({
  title: String,
  cards: [Card]
});

var Board = new Schema( {
  author: String,
  title: String,
  lists:[List]
});

module.exports = mongoose.model('Board', Board);
