// let {
//   addClient,
//   removeClient,
//   dbsendMSG,
//   dbAddMember,
//   dbRemoveMember,
//   notify,
//   init
//   } = require('./util')

let fetch = require('node-fetch')
let _url = 'http://localhost:3000/'

let clients = []
let buffer = []

const socket = (server) => {
  let io = require('socket.io')(server)
  console.log("here in socket");


  io.on('connect', socket => {

    console.log(socket.id, 'have connected')
    
    const init = async (clientID) => {
      socket.cid = clientID
      socket.joinedGroups = await fetchPOST('users/joined',{clientID})
      console.log(socket.joinedGroups)
      var msges = {}
      let arr = await Promise.all(socket.joinedGroups.map(async groupName => {
        socket.join(groupName)
        msges[groupName] = await fetchPOST('users/readallmessage',{groupName:groupName,clientID:socket.cid})
        return msges
      }))
      msges = arr[arr.length-1]
      console.log('initializing')
      
      socket.emit('groups',socket.joinedGroups)
      socket.emit('init',msges)
      clients.push(socket)
      console.log("clientID set", socket.cid)
      console.log("clients length",clients.length)
    }
    
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
      await fetchPOST('users/sendmessage',{groupName,senderID,text})
    }
    
    const boardcast = (groupName,msg) => {
      socket.to(groupName).emit('msg',groupName,msg)
    }
    
    const notify = (groupName) => {
      console.log(clients.length)
      clients.forEach(async client => {
        let msg = await fetchPOST('users/readallmessage',{groupName,clientID:client.cid})
        console.log("notifying", client.id)
        io.to(client.id).emit('update',groupName,msg)
      })
    }
    
    const fetchPOST = (url,body) => {
      return fetch(_url + url,{
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body:JSON.stringify(body)
      }).then(res => res.json())
    }

    socket.on('clientID', (clientID) => {
      init(clientID)
    })

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
