var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  bcrypt = require('bcrypt'),
  SALT_WORK_FACTOR = 10;

var emailSchema = new Schema({
  username: String,
  email: String
})

emailSchema.pre('save', function(next){
  var user = this;
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt){
    if(err){
      return next(err);
    }
    bcrypt.hash(user.email, salt, function(err, hash){
      if(err){
        return next(err);
      }
      user.email = hash;
      next()
    });
  });
});

module.exports = mongoose.model('Email', emailSchema);
