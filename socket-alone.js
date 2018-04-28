let socket = require('socket.io')

// let io = socket(3002, {
//   path: '/test',
// })

let io = socket()

io.on('connection',(socket) => {
  console.log('someone have connected')
  socket.on('disconnect',()=>{
    console.log('that one have disconnected')
  })
})

io.listen(3002)
