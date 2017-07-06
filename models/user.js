var mongoose = require('mongoose');
var userSchema = mongoose.Schema({
  username: String,
  email: String,
  password: String
  //boards: Array 
})

module.exports = mongoose.model('User', userSchema);
