var express = require('express');
var mongoose = require('mongoose');
var User = require('../models/user');
var Email = require('../models/email');

var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('forgotpassword', { title: 'Forgot Password', href: "stylesheets/forgotpassword.css", error: ''});
});

router.post('/', function(req, res){
  User.findOne({email: req.body.email}, function(err, user){
    if(!user){
      res.render('forgotpassword', { title: 'Forgot Password', href: "stylesheets/forgotpassword.css", error: 'Email does not exist!'});
    }
    else {
      var newLink = new Email({
        username: user.username,
        email: user.email
      });
      newLink.save(function(err, link){
        if(err){
          console.log(err);
        }
        else{
          res.render('emailLink', { title: 'Email Link', href: "stylesheets/emailLink.css", link: link._id});
        }
      });
    }
  });
});

module.exports = router;
