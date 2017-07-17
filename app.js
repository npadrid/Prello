var express = require('express');
var path = require('path');
//var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var cors = require('cors');
var session = require('client-sessions');

var createAccount = require('./routes/createAccount');
var login = require('./routes/login');
var logout = require('./routes/logout')
var user = require('./routes/user');
var boards = require('./routes/boards');
var forgotpw = require('./routes/forgotpassword');
var emailLink = require('./routes/emailLink');
var resetpw = require('./routes/resetpassword');

var User = require('./models/user');

mongoose.connect('mongodb://localhost/Prello');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('connected!');
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  cookieName: 'session',
  secret: '0GBlJZ9EKBt2Zbi2flRPvztczCewBxXK',
  duration: 60*60*1000, // 1 hr
  activeDuration: 5*60*1000, //5 min
  ephemeral: true
}))

app.use(function(req, res, next){
  if(req.session && req.session.user){
    User.findOne({username: req.session.user.username}, function(err, user){
      if(user) {
        req.user = user;
        delete req.user.password;
        req.session.user = user;
      }
      next();
    });
  }
  else {
    next();
  }
})

app.use(cors());
app.use('/', createAccount);
app.use('/createAccount', createAccount);
app.use('/login', login);
app.use('/forgotpassword', forgotpw);
app.use('/emailLink', emailLink);
app.use('/resetpassword', resetpw);
app.use('/logout', logout)
app.use('/user', user);
app.use('/boards', boards);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
