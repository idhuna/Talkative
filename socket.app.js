let socket = require('socket.io')

let io = socket()

io.on('connection',(socket) => {
  console.log('someone have connected',socket.id)
  socket.on('disconnect',()=>{
    console.log('that one have disconnected')
  })

  socket.on('msg',(msg) => {
    console.log('on msg: ' + msg)
    socket.emit('msg','send back from serve: '+msg)
    io.emit('msg','emit from io'+msg)
  })

  socket.on('join',(msg) => {
    console.log("user want to join a group")
    
  })

  socket.on('break',(msg) => {

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
