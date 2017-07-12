var mongoose = require('mongoose');
var commentSchema = mongoose.Schema({
  author: String,
  content: String,
  postDate: Date
})

module.exports = mongoose.model('Comments', commentSchema);
