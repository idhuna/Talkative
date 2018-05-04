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
let _url = `http://192.168.137.1:${process.env.PORT}/`
// let _url = 'http://localhost/'

let clients = []
let groups = []
let buffer = []

process.on('unhandledRejection', error => {
  // Will print "unhandledRejection err is not defined"
  console.log('unhandledRejection', error.message)
  console.error(error)
});

const socket = async (server) => {
  let io = require('socket.io')(server)
  console.log("here in socket");
  groups = await fetchPOST('group/all',{})
  
  
  io.on('connect', socket => {
    
    console.log(socket.id, 'have connected')
    
    const init = async (clientID) => {
      socket.cid = clientID
      socket.joinedGroups = await fetchPOST('users/joined',{clientID})
      console.log(socket.joinedGroups)
      var msges = {}
      console.log("groups",groups)
      let arr = await Promise.all(groups.map(async groupName => {
        socket.join(groupName)
        msges[groupName] = await fetchPOST('users/readallmessage',{groupName:groupName,clientID:socket.cid})
        return msges
      }))
      msges = arr[arr.length-1]
      console.log('initializing')
      
      socket.emit('init',msges)
      socket.emit('groups',socket.joinedGroups)
      clients.push(socket)
      console.log("clientID set", socket.cid)
      console.log("clients length",clients.length)
    }
    
    const removeClient = (client) => clients.splice(clients.indexOf(socket))
    
    const joinGroup = (groupName) => socket.join(groupName)
    const leaveGroup = (groupName) => socket.leave(groupName)
    
    const dbAddMember = (groupName) => {} // unimplement
    const dbRemoveMember = (groupName) => {} // unimplement
    
    const dbsendMSG = async (groupName,senderID,text) => {
      // update mongo
      console.log("updating mongo")
      await fetchPOST('users/sendmessage',{groupName,senderID,text})
    }
    
    const boardcast = (groupName,msg) => {
      socket.to(groupName).emit('msg',groupName,msg)
    }
    
    const notify = (groupName) => {
      console.log("clients.length",clients.length)
      clients.forEach(async client => {
        let msg = await fetchPOST('users/readallmessage',{groupName,clientID:client.cid})
        console.log("notifying", client.id)
        io.to(client.id).emit('update',groupName,msg)
      })
    }
    
    

    socket.on('clientID', (clientID) => {
      init(clientID)
    })

    socket.on('disconnect', () => {
      console.log(socket.id, 'have disconnected')
      removeClient(socket)
    })

    socket.on('newGroup', groupName => {
      groups.push(groupName)
      socket.broadcast.emit('newGroup',groupName)
    })

    socket.on('msg', async (groupName,clientID,text) => {
      console.log(socket.id, "send a message")
      buffer.push({groupName,clientID,text})
      while(buffer.length > 0) {
        let {groupName, clientID, text} = buffer.shift()
        await dbsendMSG(groupName,clientID,text)
        await notify(groupName,clientID)
      }
      // dbsendMSG(groupName, clientID, text) // unimplement
      // boardcast(clients,groupName,msg) // unimplement
    })

    socket.on('getmsg', async groupName => {
      let msg = await fetchPOST('users/readallmessage',{groupName,clientID:socket.cid})
      console.log("updating msg", msg)
      socket.emit('update',groupName,msg)
    }) 

    socket.on('join', (groupName) => {
      console.log("user want to join a group")
      fetchPOST('users/joingroup',{groupName,clientID:socket.cid})
      joinGroup(groupName)
    })

    socket.on('leave', (groupName) => {
      console.log("user want to leave a group")
      leaveGroup(groupName)
    })

    socket.on('break', (data) => {

    })
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


module.exports = socket
