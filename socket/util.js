let io = require('socket.io')()

let socket
let clientID
let clients = []

const setSocket = (s) => socket = s

const addClient = (client) => clients.push(client)
const removeClient = (client) => clients.splice(clients.indexOf(socket))
const joinGroup = (groupID) => socket.join(groupID)
const leaveGroup = (groupID) => socket.leave(groupID)

const dbAddMember = (groupID) => {} // unimplement
const dbRemoveMember = (groupID) => {} // unimplement

const initializeGroups = () => {
  let groups = getSubscribeGroups() // unimplement
  socket.emit('showGroups', groups)
}
 
const dbAddMSG = () => {
  // update mongo
}

const boardcast = (groupID,msg) => {
  socket.to(groupID).emit('msg',groupID,msg)
}



module.exports = {
  setSocket,
  addClient,
  removeClient,
  dbAddMSG,
  boardcast,
  dbAddMember,
  dbRemoveMember
}