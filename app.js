var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require("body-parser");

var indexRouter = require('./routes/index');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', indexRouter);

//MongoDB setup
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
MONGO_URL = "mongodb+srv://sigma-client:0uPSeu7rQw43RHyW@cluster0-vsetw.mongodb.net/test?retryWrites=true&w=majority";
mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: 'bitBrothers'
})
  .then(() =>  console.log('connection successful'))
  .catch((err) => console.error(err));
mongoose.set('useCreateIndex', true);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({
    "message":"error",
    "errorCode":err.status
  });
});

module.exports = app;
