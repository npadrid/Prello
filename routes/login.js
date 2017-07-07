var express = require('express');
var mongoose = require('mongoose');
var User = require('../models/user');
var sequelize = require('../db');
var router = express.Router();

/* GET login page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'Log In', href: "stylesheets/login.css"});
});

//login user
router.post('/',function(req, res){
  // User.findOne({username: req.body.username}, function(err, user){
  //   if(!user){
  //     res.render('login', {title: 'Log In', href: "stylesheets/login.css", error: 'Invalid username or password'});
  //   }
  //   else {
  //     if(req.body.password == user.password){
  //       req.session.user = user;
  //       res.redirect('/boards');
  //     }
  //     else {
  //       res.render('login', {title: 'Log In', href: "stylesheets/login.css", error:'Invalid username or password'});
  //     }
  //   }
  // })
  var body = req.body;
  var query = `SELECT id, username, email FROM users WHERE username='${body.username}' AND password='${body.password}'`;
  sequelize.query(query, {type: sequelize.QueryTypes.SELECT})
    .then(function(user){
      console.log(user)
      if(user.length > 0){
        req.session.user = user[0];
        res.redirect('/boards');
      }else {res.send('no good')}
    })
    .catch(function(e){
      console.log(e);
    })
});

module.exports = router;
