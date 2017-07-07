var express = require('express');
var mongoose = require('mongoose');
var User = require('../models/user');

var router = express.Router();

//get users
router.get('/', function(req, res) {
  User.find(function(err, users){
    if(err) return console.error(err);
    res.json(users);
  })
});

//delete user
router.delete('/:uid', function(req, res){
  User.remove({_id: mongoose.Types.ObjectId(req.params.uid)},
    function(err) {
      console.log(err);
    });
  res.json();
})

module.exports = router;
