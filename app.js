var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session')
var MySQLStore = require('express-mysql-session')(session);
const mysql = require('mysql2');

var indexRouter = require('./routes/index');
var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
/*
var options = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '',
  database: 'session'
};
*/

var options = {
  host: 'mysql742.umbler.com',
  port: 3306,
  user: 'db-root',
  password: 'leo91167213',
  database: 'session'
};

var sessionStore = new MySQLStore(options);

app.use(session({
  key: 'yuumi',
  secret: 'yuumi',
  store: sessionStore,
  resave: true,
  saveUninitialized: true
}));

function requireHTTPS(req, res, next) {
  // The 'x-forwarded-proto' check is for Heroku
  if (!req.secure && req.get('x-forwarded-proto') !== 'https' && process.env.NODE_ENV !== "development") {
    return res.redirect('https://' + req.get('host') + req.url);
  }
  next();
}

app.use(requireHTTPS);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
