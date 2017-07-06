var express = require('express');
var checkLogin = require('../checkLogin')
var router = express.Router();

/* GET boards page. */
router.get('/', checkLogin, function(req, res, next) {
  res.render('boards', { title: 'Boards', href: "stylesheets/boards.css"});
});

module.exports = router;
