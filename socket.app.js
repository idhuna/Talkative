let socket = require('socket.io')

let io = socket()

io.on('connection',(socket) => {
  console.log('someone have connected')
  socket.on('disconnect',()=>{
    console.log('that one have disconnected')
  })

  socket.on('msg',(msg) => {
    console.log('on msg: ' + msg)
    socket.emit('msg','send back from serve: '+msg)
    io.emit('msg','emit from io'+msg)
  })
})

const myNameSpace = io.of('/my-name')
myNameSpace.on('connection',(socket) => {
  socket.join('room')
  console.log("someone connect to my name space")
  socket.on('msg',(msg) => {
    console.log(':',msg)
    socket.broadcast.to('room').emit('roomOnly','hi prisoner')
  })
})

module.exports = {
  io
}
