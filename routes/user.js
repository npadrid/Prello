var express = require('express');
var mongoose = require('mongoose');
var User = require('../models/user');
var Board = require('../models/board');
var List = require('../models/list');
var Card = require('../models/cards');
var cors = require('cors');
var session = require('client-sessions');

var router = express.Router();

//get users
router.get('/', function(req, res) {
  console.log('getting users');
  User.find(function(err, users){
    if(err) return console.error(err);
    res.json(users);
  })
});

//create user
router.post('/', function(req, res) {
  console.log('creating user');
  console.log(req.body);
  var newUser = new User(
    { username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      boards: req.body.boards
    }
  );
  newUser.save(function (err, user) {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/login');
    }
  });
});

//delete user
router.delete('/:uid', function(req, res){
  console.log('deleting user');
  User.remove({_id: mongoose.Types.ObjectId(req.params.uid)},
    function(err) {
      console.log(err);
    });
  res.json();
})

//get user's boards
router.get('/boards', function(req, res){
  // console.log(req.params);
  // console.log(req.user._id);
  // User.findById(req.user._id, function(err, user){
  //   if(err){
  //     console.log(err);
  //     return res.status(401).send();
  //   }
  //   else {
  //     res.json(user.boards);
  //   }
  // })
  if(!req.session.user){
    return res.status(401).send()
  }
  return res.status(200).send('logged in')
})

//post new user board

//get lists
router.get('/:uid/board/:bid/list', cors(), function(req, res) {
  List.find(function(err, lists){
    if(err) return console.error(err);
    res.json(lists);
  })
});

//post new list
router.post('/:uid/board/:bid/list', cors(), function(req, res) {
  var newList = new List(
    { title: req.body.title}
  );
  newList.save(function (err, list) {
    if (err) {
      console.log(err);
    } else {
      res.json(list);
    }
  });
});

router.patch('/', function(req, res){
})

router.delete('/:lid', function(req, res){
  List.remove({_id: mongoose.Types.ObjectId(req.params.lid)},
    function(err) {
      console.log(err);
    });
  res.json();
})


router.post('/:lid/card', function(req, res) {
  var newCard = new Card(
    { labels: req.body.labels,
      description: req.body.description,
      users: req.body.users
    }
  );
  List.findByIdAndUpdate(req.params.lid,
    {"$push": {cards: newCard}},{ "new": true, "upsert": true},
    function(err, list) {
      if (err) {
        console.log(err);
      } else {
        res.json(list);
      }
    });
  });

router.patch('/:lid/card/:cid', function(req, res){
  console.log(req.body);
  var newCard = new Card(
    { labels: req.body.labels,
      description: req.body.description,
      users: req.body.users
    }
  );
  List.update(
    { 'cards._id': mongoose.Types.ObjectId(req.params.cid)},
    { '$set': { 'cards.$.labels': req.body.labels, 'cards.$.description': req.body.description, 'cards.$.users': req.body.users, 'cards.$._id': mongoose.Types.ObjectId(req.params.cid)}},
    { new: true })
    .then(function(err, list) {
      if (err) {
        console.log(err);
      } else {
        res.json(list);
      }
    });
  })

router.delete('/:lid/card/:cid', function(req, res){
  List.findByIdAndUpdate(req.params.lid,
  {$pull: {"cards": {_id:mongoose.Types.ObjectId(req.params.cid)}}},
  function(err, list) {
    if (err) {
      console.log(err);
    } else {
      res.json();
    }
  });
})
//get lists

//post new list

//patch list

//delete list

//get cards

//post new card

//patch card

//delete card

module.exports = router;
