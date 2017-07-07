var express = require('express');
var mongoose = require('mongoose');
var User = require('../models/user');
var sequelize = require('../db');

var router = express.Router();

/* GET create account page. */
router.get('/', function(req, res, next) {
  res.render('createAccount', { title: 'Create Account', href: "stylesheets/createAccount.css"});
});

//create new user
router.post('/', function(req, res) {
  var body = req.body;
  var query = `INSERT INTO users(username, email, password) VALUES
    ('${body.username}', '${body.email}', '${body.password}');`;
  sequelize.query(query, {type: sequelize.QueryTypes.INSERT})
    .then(function(user){
      console.log(user);
    })
    .catch(function(e){
      console.log(e);
    })
  // var newUser = new User(
  //   { username: req.body.username,
  //     email: req.body.email,
  //     password: req.body.password,
  //     //boards: req.body.boards
  //   }
  // );
  // newUser.save(function (err, user) {
  //   if (err) {
  //     console.log(err);
  //   } else {
  //     res.redirect('/login');
  //   }
  // });
});
module.exports = router;
