var Board = require('./models/board');
var permission = function(req, res, next){
  if(req.session.user){
    Board.findOne({_id: req.params.bid}, function(err, board){
      if(!board.users.includes(req.session.user.username)){
        res.redirect('/login');
      }
      next();
    })
  }
  else{
    res.redirect('/login');
  }
}

module.exports = permission;
