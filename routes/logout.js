var express = require('express');
var router = express.Router();

/* Logout page. */
router.get('/' ,function(req, res, next) {
  console.log('logging out');
  req.session.reset();
  res.redirect('/login');
});

module.exports = router;
