let io = require('socket.io')()


module.exports = {
  setSocket,
  removeClient,
  dbsendMSG,
  boardcast,
  dbAddMember,
  dbRemoveMember,
  notify,
  setClientID
}