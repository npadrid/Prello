var express = require('express');
var mongoose = require('mongoose');
var User = require('../models/user');
var router = express.Router();

/* GET login page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'Log In', href: "stylesheets/login.css", error: ''});
});

//login user
router.post('/',function(req, res){
  User.findOne({username: req.body.username}, function(err, user){
    if(!user){
      res.render('login', {title: 'Log In', href: "stylesheets/login.css", error: 'Invalid username or password'});
    }
    else {
      user.comparePassword(req.body.password, function(err, isMatch){
        if (err) {
          console.log(err);
        }
        else{
          if(isMatch){
            req.session.user = user;
            res.redirect('/boards');
          }
          else{
            res.render('login', {title: 'Log In', href: "stylesheets/login.css", error:'Invalid username or password'});
          }
        }
      });
    }
  });
});

module.exports = router;
