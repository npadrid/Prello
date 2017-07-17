var express = require('express');
var mongoose = require('mongoose');
var Email = require('../models/email');

var router = express.Router();

router.get('/link', function(req, res, next) {
  Email.find({username: 'user'}, function(err, lists){
    if(err){
      console.log(err);
    }
    else{
      res.json(lists);
    }
  })
});

router.delete('/link', function(req, res){
  Email.findOne({username: 'user'}, function(err, email){
    if(err){
      console.log(err);
    }
    else{
      email.remove();
      res.json();
    }
  })
})

module.exports = router;
