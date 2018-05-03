const socket = (server) => {
  let io = require('socket.io')(server)

  let clients = []
  io.on('connect', socket => {
    console.log(socket.id, 'have connected')
    clients.push(socket)

    socket.on('disconnect', () => {
      console.log(socket.id,'have disconnected')
      clients.splice(clients.indexOf(socket))
    })

    socket.on('msg', (msg) => {
      console.log(socket.id, "send a message")
      
      io.emit('msg', 'emit from io' + msg)
    })

    socket.on('join', (msg) => {
      console.log("user want to join a group")

    })

    socket.on('break', (msg) => {

    })
  })
}

module.exports = socket