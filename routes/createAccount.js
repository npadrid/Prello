var express = require('express');
var router = express.Router();

/* GET create account page. */
router.get('/', function(req, res, next) {
  res.render('createAccount', { title: 'Create Account', href: "stylesheets/createAccount.css"});
});

module.exports = router;
