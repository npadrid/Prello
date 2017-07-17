var express = require('express');
var mongoose = require('mongoose');
var Email = require('../models/email');
var User = require('../models/user');

var router = express.Router();

router.get('/:eid', function(req,res){
  res.render('resetpassword', { title: 'Reset Password', href: "../stylesheets/resetpassword.css", message: '', link: req.params.eid});
})

router.post('/:eid', function(req, res){
  console.log(req.body);
  if(req.body.password !== req.body.confirm_password) {
    res.render('resetpassword', { title: 'Reset Password', href: "../stylesheets/resetpassword.css", message: 'Passwords do not match', link: req.params.eid});
  }
  else {
    Email.findOne({_id: req.params.eid}, function(err, email){
      console.log(email);
      User.findOne({username: email.username}, function(err, user){
        console.log(user);
        var newUser = new User({
          username: user.username,
          email: user.email,
          password: req.body.password
        });
        newUser.save(function (err, user) {
          if (err) {
            console.log(err);
          } else {
            Email.findOne({_id: req.params.eid}, function(err, email){
              if(err){
                console.log(err);
              }
              else{
                if(email){
                  email.remove();
                  res.json();
                }
              }
            });
            res.render('resetpassword', { title: 'Reset Password', href: "../stylesheets/resetpassword.css", message: 'Saved new password', link: req.params.eid});
          }
        })
      })
    })
  }
});

module.exports = router;
