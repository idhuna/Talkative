let {
  setSocket,
  addClient,
  removeClient,
  dbsendMSG,
  dbAddMember,
  dbRemoveMember,
  notify
  } = require('./util')

const socket = (server) => {
  let io = require('socket.io')(server)
  console.log("here in socket");

  let buffer = []

  io.on('connect', socket => {
    let clientID
    let clientBreak = []
    let groupsBuffer = {}

    console.log(socket.id, 'have connected')
    setSocket(socket)
    // initializeGroups()

    socket.on('disconnect', () => {
      console.log(socket.id, 'have disconnected')
      removeClient(socket)
    })

    socket.on('msg', async (groupName,clientID,text) => {
      console.log(socket.id, "send a message")
      buffer.push({groupName,clientID,text})
      while(buffer.length > 0) {
        let {groupName, clientID, text} = buffer.pop()
        await dbsendMSG(groupName,clientID,text)
        await notify(groupName,clientID)
      }
      // dbsendMSG(groupName, clientID, text) // unimplement
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
