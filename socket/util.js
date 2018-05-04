let io = require('socket.io')()
let fetch = require('node-fetch')

let socket
let clientID
let clients = []

const setSocket = (s) => socket = s

const addClient = (client) => clients.push(client)
const removeClient = (client) => clients.splice(clients.indexOf(socket))
const joinGroup = (groupName) => socket.join(groupName)
const leaveGroup = (groupName) => socket.leave(groupName)

const dbAddMember = (groupName) => {} // unimplement
const dbRemoveMember = (groupName) => {} // unimplement

const initializeGroups = () => {
  let groups = getSubscribeGroups() // unimplement
  socket.emit('showGroups', groups)
}
 
const dbsendMSG = async (groupName,senderID,text) => {
  // update mongo
  console.log("updating mongo")
  await fetch('http://localhost:3000/users/sendmessage',{
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body:JSON.stringify({
      groupName,senderID,text
    })
  }).catch(e => console.error(e))
}

const boardcast = (groupName,msg) => {
  socket.to(groupName).emit('msg',groupName,msg)
}



module.exports = {
  setSocket,
  addClient,
  removeClient,
  dbsendMSG,
  boardcast,
  dbAddMember,
  dbRemoveMember
}