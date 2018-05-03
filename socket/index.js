let {
  setSocket,
  addClient,
  removeClient
  } = require('./util')

const socket = (server) => {
  let io = require('socket.io')(server)

  io.on('connect', socket => {
    let clientID
    let clientBreak = []
    let groupsBuffer = {}

    console.log(socket.id, 'have connected')
    setSocket(socket)
    initializeGroups()
    
    socket.on('disconnect', () => {
      console.log(socket.id, 'have disconnected')
    })

    socket.on('msg', (groupID,msg) => {
      console.log(socket.id, "send a message")
      dbAddMsg(groupID, clientID, msg) // unimplement
      boardcast(clients,groupID,msg) // unimplement
    })

    socket.on('join', (groupID) => {
      console.log("user want to join a group")
      dbAddMember(groupID)
      joinGroup(groupID)
    })

    socket.on('leave', (groupID) => {
      console.log("user want to leave a group")
      dbRemoveMember(groupID)
      leaveGroup(groupID)
    })

    socket.on('break', (data) => {

    })
  })
}

module.exports = socket