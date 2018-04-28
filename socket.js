const socket = (server) => {
  let io = require('socket.io')(server)
  io.on('connection',socket => {
    console.log("a user connected")
    socket.on('disconnect',() => {
      console.log('a user disconnected')
    })
    socket.on('hello',(msg) => {
      console.log("message : " + msg)
    })
  })
} 

module.exports = {
  socket
}