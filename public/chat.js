console.log('from chat.js')
var socket = io(`http://192.168.137.1:${port}`)
// var socket = io('http://localhost')

async function fetchFromURLtest(){
  let d = await fetch("https://api.chucknorris.io/jokes/random")
  console.log(d)
}

async function fetchGroups(){
  let groups = await fetch("group/all").then(res => res.json())
  console.log("fetchGroups",groups)
}


// we set these in pug
console.log("clientID",clientID)
let msges = {}
socket.joinedGroups = []

socket.on('test',msg => console.log(msg))

socket.on('connect', () => {
  console.log(`we're connected`, socket.connected)
  socket.emit("clientID",clientID)
})

socket.on('disconnect', () => {
  // console.log('disconnect')
  // if(port === 3000) port = 3004
  // else port = 3000
  // socket = io(`http://192.168.137.1:${port}`,{reconnection: false})
  // socket.connect();
  console.log(`we're disconnected`)
})

socket.on('reconnect_attempt', () => {
  console.log('attemp_to_reconnect')
  console.log("port",port)
})

socket.on('msg',(groupName,msg) => {
  console.log('receive: ',groupName,msg)

})

socket.on('init',msges => {
  console.log("init")
  socket.msges = msges || {}
  console.log(socket.msges)
})

socket.on('update',(groupName,msg) => {
  console.log('we have to update this group',groupName)
  console.log('new msg',msg)
  socket.msges[groupName] = msg
  if(groupName === $('#chatHeader').text())changeChat(groupName)
})

socket.on('groups',groups => {
  console.log("update groups")
  socket.joinedGroups = groups
  console.log(socket.joinedGroups)
  groups.forEach(group => genGroup(group))
  Object.keys(socket.msges).forEach(group => {
    if(!groups.includes(group)) genUnGroup(group)
  })
})

socket.on('newGroup',groupName => {
  console.log('there is new group')
  genUnGroup(groupName)
})

$('#join').click(() => {
  console.log("join!!")
})

function sendMSG(){
  let msg = $('#btn-input').val()
  let groupName = $('#chatHeader').text()
  if(groupName === " Select Some Chat"){
    alert("Please chose group to send some message")
    $('#btn-input').val('')
    return
  }
  console.log("sending...",msg)
  socket.emit('msg',groupName,clientID,msg)
  $('#btn-input').val('')
}

$(document).ready(function(){
    console.log("doc rdy");
    let msg
    $('#btn-chat').click(() =>{
      sendMSG()
    })
    $('#btn-input').keypress(function(e) {
      if(e.which == 13) {
          sendMSG()
        }
    });
    $('.list-group').on('click','a.joinedGroup',() => {
      console.log('rerender chat')
      let id = $(this)[0].activeElement.id
      let groupName = id.substr(7)
      changeChat(groupName)
    })
})

const createGroup = () =>{
  let groupName = $('#nameGroup').val()
  fetch('group/creategroup',{
    method: "POST",
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      groupName:groupName,
      clientID:clientID
    })
  }).then(res => res.json()).then(data => {
    console.log(data)
    let groupName = data.groupName
    socket.emit('msg',groupName,clientID,'I create this group')
    console.log(socket)
    
    socket.joinedGroups.push(groupName)
    genGroup(groupName)
    socket.emit('newGroup', groupName)
    socket.emit('getmsg',groupName)
  })
}

$('#createGroup').submit((e) => {
    console.log("createGroup")
    e.preventDefault()
    createGroup()
})


$('#addGroupBtn').click(()=>{
  var group = $('#nameGroup').val()
  if(group.length > 0){
      console.log("hi",group)
      createGroup()
  }
})

async function changeChat(groupName){
  if(!socket.joinedGroups.includes(groupName)) return
  console.log('changing chat...')
  $('#chatMessage li').remove()
  let msg = socket.msges[groupName]
  msg.forEach(i => {
    if(i.senderID === clientID) addMyChat(i.senderID,i.text)
    else addAnotherChat(i.senderID,i.text)
  })
  $('#chatMessage li').last()[0].scrollIntoView();
}
