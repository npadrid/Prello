var express = require('express');
var mongoose = require('mongoose');
var checkLogin = require('../checkLogin');
var Board = require('../models/board');
var List = require('../models/list');
var Card = require('../models/cards')
var Comments = require('../models/comments');
var cors = require('cors');

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

//get board's page
router.get('/:bid', checkLogin, function(req, res) {
  res.render('board', { title: 'board', href: "../stylesheets/board.css", username: req.session.user.username});
});

//get board list
router.get('/:bid/list', cors(), function(req, res) {
  Board.find({_id: req.params.bid}, function(err, board){
    if(err){
      console.log(err);
    }
    else{
      res.json(board[0].lists);
    }
  })
});

//post new list
router.post('/:bid/list', cors(), function(req, res) {
  var newList = { title: req.body.title};
  Board.findByIdAndUpdate(req.params.bid,{"$push": {lists: newList}},{ "new": true, "upsert": true},
    function(err, board) {
      if (err) {
        console.log(err);
      } else {
        res.json(board.lists[board.lists.length-1]);
      }
    });
  });

// router.patch('/', function(req, res){
// })

//delete list
router.delete('/:bid/list/:lid', function(req, res){
  Board.findByIdAndUpdate(req.params.bid,
    {$pull: {"lists": {_id:mongoose.Types.ObjectId(req.params.lid)}}},
    function(err){
      if(err){
        console.log(err);
      }
    else{
      res.json();
    }
  })
})

//post new card
router.post('/:bid/list/:lid/card', function(req, res) {
  var newCard = { author: req.session.user.username,
      description: req.body.description,
      labels: req.body.labels,
      users: req.body.users,
      comments: req.body.comments
    };
  Board.findById(req.params.bid,
    function(err, board) {
      if (err) {
        console.log(err);
      } else {
        var listIndex = board.lists.findIndex(function(list){
          return list._id == req.params.lid;
        });
        var currentList = board.lists[listIndex];
        currentList.cards.push(newCard);
        board.lists.set(listIndex, currentList);
        board.save(function (err, board) {
          if(err){
            console.log(err);
          }
          else{
            res.json(newCard);
          }
        });
      }
    });
  });

//update card info
router.patch('/:bid/list/:lid/card/:cid', function(req, res){
  Board.findById(req.params.bid, function (err, board) {
    if (err) {
      console.log(err);
    } else {
      var listIndex = board.lists.findIndex(function (l) {
        return l._id == req.params.lid;
      });
      var currentList = board.lists[listIndex];
      var cardIndex = currentList.cards.findIndex(function (c) {
        return c._id == req.params.cid;
      });
      board.lists[listIndex].cards[cardIndex] = req.body;
      board.lists.set(listIndex, currentList);
      board.save(function (err, board) {
        if (err) {
          console.log(err);
        } else {
          res.json(board.lists[listIndex]);
        }
      });
    }
  });
})

//post comment
router.post('/:bid/list/:lid/card/:cid/comment', function(req,res){
  Board.findById(req.params.bid, function (err, board) {
    if (err) {
      console.log(err);
    } else {
      var listIndex = board.lists.findIndex(function (l) {
        return l._id == req.params.lid;
      });
      var currentList = board.lists[listIndex];
      var cardIndex = currentList.cards.findIndex(function (c) {
        return c._id == req.params.cid;
      });
      var card = currentList.cards[cardIndex];
      card.comments.push({
        content: req.body.content,
        author: req.session.user.username,
        date: req.body.date,
      });
      board.lists.set(listIndex, currentList);
      board.save(function (err) {
        if (err) {
          console.log(err);
        }
        res.json(card.comments[card.comments.length - 1]);
      })
    }
  })
})
//delete card
router.delete('/:bid/list/:lid/card/:cid', function(req, res){
  Board.findById(req.params.bid,
    function(err, board) {
      if (err) {
        console.log(err);
      } else {
        var listIndex = board.lists.findIndex(function(list){
          return list._id == req.params.lid;
        });
        var currentList = board.lists[listIndex];
        var cardIndex = currentList.cards.findIndex(function(card){
          return card._id == req.params.cid;
        });
        currentList.cards.splice(cardIndex, 1);
        board.lists.set(listIndex, currentList);
        board.save(function(err){
          if(err){
            console.log(err);
          }
          else{
            res.json();
          }
        })
      }
    });
  })
module.exports = router;
