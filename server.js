process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('./config/express');
var socket = require('./socket')
var debug = require('debug')('dissys:server');

var mongoose
try{
  mongoose = require('./config/config');
}catch(e){
  console.log("Falling to default mongoose")
  mongoose = require('./config/mongoose')
}

var db = mongoose();
var app = express();
var http = require('http');

var port = normalizePort(process.env.PORT || '3000');

var server = http.createServer(app);
socket(server)
console.log('initialiize socket')

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

console.log("Server mode: " + process.env.NODE_ENV);


/**
 * Normalize a port into a number, string, or false.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
  console.log("listening on port " + addr.port)
}

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