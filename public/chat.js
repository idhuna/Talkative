console.log('from chat.js')
var socket = io('http://localhost:3002/test')
socket.on('connect', ()=> {
  console.log(`we're connected`,socket.connected)
})
  
$('form').submit(() => {
  let msg = $('#btn-input').val()
  console.log(msg)
  socket.emit('hello',msg)
  return false
})