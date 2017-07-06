var express = require('express');
var mongoose = require('mongoose');
var cors = require('cors');
var List = require('../models/list');
var Card = require('../models/cards');

var router = express.Router();

// router.use(function (req, res, next) {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
//   res.setHeader('Access-Control-Allow-Headers', 'Origin, X-requested-With, Content-Type, Accept');
//   next();
// });

router.get('/', cors(), function(req, res) {
  List.find(function(err, lists){
    if(err) return console.error(err);
    res.json(lists);
  })
});

router.post('/', cors(), function(req, res) {
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
module.exports = router;
