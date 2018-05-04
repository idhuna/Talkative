var path = require('path');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


module.exports = function() {
    var app = express();
    
    // view engine setup
    console.log(path.join(__dirname, '../views'));
    // app.set('views', path.join(__dirname, '../views'));
    app.set('view engine', 'pug');
    
    app.use(logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded({extended: false}));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, '../public')));

    var chatRouter = require('../routes/chat')
    var usersRouter = require('../routes/users')
    var groupRouter = require('../routes/group')
    var loginRouter = require('../routes/login')
    var registerRouter = require('../routes/register')
    
    app.use('/chat', chatRouter);
    app.use('/users', usersRouter);
    app.use('/group', groupRouter);
    app.use('/register', registerRouter);
    app.use('/', loginRouter);

    // catch 404 and forward to error handler
    app.use(function (req, res, next) {
      next(createError(404));
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

    return app;
}

