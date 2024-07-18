var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var session = require('express-session');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var branchesRouter = require('./routes/branches');

var loginRouter = require('./routes/loginRoute');
var signUpRouter = require('./routes/signUpRoute');
var adminRouter = require('./routes/adminRoute');
var authRouter = require('./routes/authRoute');
var eventRouter = require('./routes/eventRoute');
var announcementRouter = require('./routes/announcementRoute');
var db = require("./utils/db");
var mailRouter = require("./routes/mailRoute");

var app = express();

app.use(function(req, res, next) {
  req.pool = db.dbConnectionPool;
  next();
});


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({
  secret:'wdc group 11',
  resave: false ,
  saveUninitialized: true,
  cookie: {secure: false}
}));

app.use(function(req, res, next){
  console.log("The current user is: "+ req.session.userID);
  console.log("The current user role is: "+ req.session.userRole);
  console.log("The current branch of the manager is: "+ req.session.branchID);
  next();
});

app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/', branchesRouter);
app.use('/', loginRouter);
app.use('/', signUpRouter);
app.use('/', announcementRouter);
app.use('/', eventRouter);
app.use('/', mailRouter);


app.use('/admin', adminRouter);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/', authRouter);
module.exports = app;



