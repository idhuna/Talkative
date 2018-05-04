let {
  setSocket,
  addClient,
  removeClient,
  dbsendMSG,
  dbAddMember,
  dbRemoveMember
  } = require('./util')

const socket = (server) => {
  let io = require('socket.io')(server)
  console.log("here in socket");

  io.on('connect', socket => {
    let clientID
    let clientBreak = []
    let groupsBuffer = {}

    console.log(socket.id, 'have connected')
    setSocket(socket)
    // initializeGroups()

    socket.on('disconnect', () => {
      console.log(socket.id, 'have disconnected')
    })

    socket.on('msg', (groupName,msg) => {
      console.log(socket.id, "send a message")
      console.log(groupName,msg)
      dbsendMSG(groupName, clientID, msg) // unimplement
      // boardcast(clients,groupName,msg) // unimplement
    })

    socket.on('join', (groupName) => {
      console.log("user want to join a group")
      dbAddMember(groupName)
      joinGroup(groupName)
    })

    socket.on('leave', (groupName) => {
      console.log("user want to leave a group")
      dbRemoveMember(groupName)
      leaveGroup(groupName)
    })

    socket.on('break', (data) => {

    })
  })
}

module.exports = socket
