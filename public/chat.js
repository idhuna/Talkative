console.log('from chat.js')
var socket = io('http://localhost:3000/')

socket.on('connect', () => {
  console.log(`we're connected`, socket.connected)
  console.log("this is our socket",socket)
})

socket.on('disconnect', () => {
  console.log(`we're disconnected`)
})

socket.on('msg',(msg) => {
  console.log('receive: ',msg)
})


$('form').submit(() => {
  let msg = $('#btn-input').val()
  console.log('emit to serve',msg)
  socket.emit('msg', msg)
  return false
})