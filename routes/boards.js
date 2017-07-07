var express = require('express');
var mongoose = require('mongoose');
var checkLogin = require('../checkLogin');
var Board = require('../models/board');

var router = express.Router();

/* GET boards page. */
router.get('/', checkLogin, function(req, res, next) {
  Board.find({author: req.user.username}, function(err, boards){
    if(err){
      console.log(err);
    }
    else{
      res.render('boards', { title: 'Boards', href: "stylesheets/boards.css", username: req.session.user.username, boards: boards});
    }
  })
});

//post new user board
router.post('/', function(req, res){
  var newBoard = new Board(
    { author: req.user.username,
      title: req.body.title
    }
  )
  newBoard.save(function(err, board){
    if(err) {
      console.log(err);
    }
    else {
      res.json(board);
    }
  })
})

router.get('/:bid', checkLogin, function(req, res) {
  console.log('boards');
  res.render('board', { title: 'board', href: "../stylesheets/board.css", username: req.session.user.username});
});

router.get('/:bid/list', cors(), function(req, res) {
  List.find(function(err, lists){
    if(err) return console.error(err);
    res.json(lists);
  })
});

// router.post('/', cors(), function(req, res) {
//   var newList = new List(
//     { title: req.body.title}
//   );
//   newList.save(function (err, list) {
//     if (err) {
//       console.log(err);
//     } else {
//       res.json(list);
//     }
//   });
// });
//
// router.patch('/', function(req, res){
// })
//
// router.delete('/:lid', function(req, res){
//   List.remove({_id: mongoose.Types.ObjectId(req.params.lid)},
//     function(err) {
//       console.log(err);
//     });
//   res.json();
// })
//
//
// router.post('/:lid/card', function(req, res) {
//   var newCard = new Card(
//     { labels: req.body.labels,
//       description: req.body.description,
//       users: req.body.users
//     }
//   );
//   List.findByIdAndUpdate(req.params.lid,
//     {"$push": {cards: newCard}},{ "new": true, "upsert": true},
//     function(err, list) {
//       if (err) {
//         console.log(err);
//       } else {
//         res.json(list);
//       }
//     });
//   });
//
// router.patch('/:lid/card/:cid', function(req, res){
//   console.log(req.body);
//   var newCard = new Card(
//     { labels: req.body.labels,
//       description: req.body.description,
//       users: req.body.users
//     }
//   );
//   List.update(
//     { 'cards._id': mongoose.Types.ObjectId(req.params.cid)},
//     { '$set': { 'cards.$.labels': req.body.labels, 'cards.$.description': req.body.description, 'cards.$.users': req.body.users, 'cards.$._id': mongoose.Types.ObjectId(req.params.cid)}},
//     { new: true })
//     .then(function(err, list) {
//       if (err) {
//         console.log(err);
//       } else {
//         res.json(list);
//       }
//     });
//   })
//
// router.delete('/:lid/card/:cid', function(req, res){
//   List.findByIdAndUpdate(req.params.lid,
//   {$pull: {"cards": {_id:mongoose.Types.ObjectId(req.params.cid)}}},
//   function(err, list) {
//     if (err) {
//       console.log(err);
//     } else {
//       res.json();
//     }
//   });
// })
module.exports = router;
