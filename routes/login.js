var express = require('express');
var mongoose = require('mongoose');
var User = require('../models/user');
var router = express.Router();

/* GET login page. */
router.get('/', function(req, res, next) {
  console.log('rendering login js');
  res.render('login', { title: 'Log In', href: "stylesheets/login.css"});
});

//login user
router.post('/',function(req, res){
  console.log('logging in user');
  User.findOne({username: req.body.username}, function(err, user){
    if(!user){
      console.log('no user');
      res.render('login', {title: 'Log In', href: "stylesheets/login.css", error: 'Invalid username or password'});
    }
    else {
      if(req.body.password == user.password){
        console.log('found user');
        req.session.user = user;
        res.redirect('/boards');
      }
      else {
        console.log('wrong password');
        res.render('login', {title: 'Log In', href: "stylesheets/login.css", error:'Invalid username or password'});
      }
    }
  })
})

module.exports = router;
