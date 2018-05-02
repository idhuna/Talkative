console.log('from chat.js')
var socket = io('http://localhost:3002/')

socket.on('connect', () => {
  console.log(`we're connected`, socket.connected)
  console.log(socket)
})

socket.on('roomOnly',(msg) => {
  console.log('from room',msg)
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