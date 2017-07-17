var express = require('express');
var mongoose = require('mongoose');
var User = require('../models/user');

var router = express.Router();

/* GET create account page. */
router.get('/', function(req, res, next) {
  res.render('createAccount', { title: 'Create Account', href: "stylesheets/createAccount.css", error: ''});
});

//create new user
router.post('/', function(req, res) {
  User.findOne({username: req.body.username}, function(err, user){
    if(!user){
      var newUser = new User(
        { username: req.body.username,
          email: req.body.email,
          password: req.body.password
        }
      );
      newUser.save(function (err, user) {
        if (err) {
          console.log(err);
        } else {
          res.redirect('/login');
        }
      })
    }
    else {
      res.render('createAccount', { title: 'Create Account', href: "stylesheets/createAccount.css", error: 'User already exists!'});
    }
  })
});
module.exports = router;
