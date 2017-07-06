var express = require('express');
var router = express.Router();

/* GET boards page. */
router.get('/', function(req, res, next) {
  res.render('boards', { title: 'Prello', href: "stylesheets/boards.css"});
});

module.exports = router;
