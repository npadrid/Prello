var express = require('express');
var mongoose = require('mongoose');
var checkLogin = require('../checkLogin');
var checkPermission = require('../checkPermission');
var User = require('../models/user');
var Board = require('../models/board');
var List = require('../models/list');
var Card = require('../models/cards')
var Comments = require('../models/comments');
var cors = require('cors');

var router = express.Router();

/* GET boards page. */
//show only boards user has permission to
router.get('/', checkLogin, function(req, res, next) {
  Board.find({users: req.user.username}, function(err, boards){
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
    { title: req.body.title,
      users: [req.user.username]
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
router.get('/:bid', checkPermission, function(req, res) {
  Board.findOne({_id: req.params.bid}, function(err, board){
    if(err){
      console.log(err);
    }
    else{
      res.render('board', { title: board.title, href: "../stylesheets/board.css", username: req.session.user.username});
    }
  })
});

//add user
router.post('/:bid/member', function(req,res){
  User.findOne({username: req.body.user}, function(err, user){
    if(user){
      Board.findOne({_id: req.params.bid}, function(err, board){
        if(err){
          console.log(err);
        } else {
          for(var i = 0; i < board.users.length; i++){
            if(board.users[i] == req.body.user){
              res.send('dup user');
              break;
            }
            else {
              board.users.push(req.body.user);
              board.markModified('users');
              board.save(function(err, board){
                if(err){
                  console.log(err);
                } else {
                  res.json(board);
                }
              })
              break;
            }
          }
        }
      })
    }
    else {
      res.send('no user');
    }
  })
})

//get board list
router.get('/:bid/list', function(req, res) {
  List.find({bid: req.params.bid}, function(err, lists){
    if(err){
      console.log(err);
    }
    else{
      res.json(lists);
    }
  })
});

//post new list
router.post('/:bid/list', function(req, res) {
  var newList = new List({
    title: req.body.title,
    bid: req.params.bid
  })
  newList.save(function(err, list){
    if(err){
      console.log(err);
    }
    else {
      res.json(list);
    }
  })
});

// router.patch('/', function(req, res){
// })

//delete list
router.delete('/:bid/list/:lid', function(req, res){
  List.findOne({_id: req.params.lid}, function(err, list){
    if(err){
      console.log(err);
    }
    else{
      list.remove();
      res.json();
    }
  })
})

//post new card
router.post('/:bid/list/:lid/card', function(req, res) {
  var newCard = new Card({ author: req.session.user.username,
    title: req.body.title
  });
  List.findOne({_id: req.params.lid}, function(err, list){
    list.cards.push(newCard);
    list.save(function(err){
      if(err){
        console.log(err);
      }
      else{
        res.json(newCard);
      }
    })
  })
});

//update card info
router.patch('/:bid/list/:lid/card/:cid', function(req, res){
  List.findOne({_id: req.params.lid}, function (err, list) {
    if (err) {
      console.log(err);
    } else {
      for(var i = 0; i < list.cards.length; i++){
        if(list.cards[i]._id == req.params.cid){
          list.cards[i] = req.body.card;
          list.markModified('cards');
          list.save(function(err){
            if(err){
              console.log(err);
            }
          })
          break;
        }
      }
    }
  });
})

//post comment
router.post('/:bid/list/:lid/card/:cid/comment', function(req,res){
  List.findOne({_id: req.params.lid}, function (err, list) {
    if (err) {
      console.log(err);
    } else {
      for(var i = 0; i < list.cards.length; i++){
        if(list.cards[i]._id == req.params.cid){
          console.log(list.cards[i]);
          var comment = {
            author: req.session.user.username,
            content: req.body.content,
            postDate: req.body.date,
            postTime: req.body.time
          }
          if(list.cards[i].comments){
            console.log('has comments');
            list.cards[i].comments.push(comment);
          }
          else{
            console.log('creating comments array');
            list.cards[i].comments = [comment];
          }
          list.markModified('cards');
          list.save(function(err, list){
            if(err){
              console.log(err);
            } else {
              res.json(comment);
            }
          })
        }
      }
    }
  })
})

//delete card
router.delete('/:bid/list/:lid/card/:cid', function(req, res){
  List.findOne({_id:req.params.lid}, function(err, list){
    if (err) {
      console.log(err);
    } else {
      for(var i = 0; i < list.cards.length; i++){
        if(list.cards[i]._id == req.params.cid){
          list.cards.splice(i, 1);
          list.save(function(err){
            if(err){
              console.log(err);
            }
          })
          break;
        }
      }
    }
  });
})

module.exports = router;
