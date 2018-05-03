process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('./config/express');

var mongoose
try{
  mongoose = require('./config/config');
}catch(e){
  mongoose = require('./config/mongoose')
}

var db = mongoose();
var app = express();

var port = normalizePort(process.env.PORT || '3000');

app.listen(port);

console.log("Server is listening at http://localhost:" + port);
console.log("Server mode: " + process.env.NODE_ENV);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}