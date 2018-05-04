var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var Group = require('mongoose').model('Group');
var Client = require('mongoose').model('Client');
var Message = require('mongoose').model('Message');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/createuser', async function (req, res, next) {
  console.log(req.body);

  const { clientID, password, name } = req.body;
  let newUser = new Client({
    clientID: clientID,
    password: password,
    name: name,
    joinedGroups: [],
    lastmsg: [],
    break: []
  });
  await Client.findOne({ clientID: clientID }, function (err, client) {
    if (err) return handleError(err);

    if (client != null) {
      console.log("had")
      res.send("this clientID is already used")
    }

  });
  try {
    await newUser.save();
  }
  catch (err) {
    console.log(err);
  }

  res.send(newUser)
  res.render('login', { tilte: "Login page", msg: "Your ID has been created" })

});
//gruopname client id
router.post('/joingroup', async function (req, res, next) {
  console.log(req.body);

  const { clientID, groupName } = req.body;

  await Group.findOne({ groupName: groupName }, function (err, group) {
    if (err) return handleError(err);
    else if (!group) {
      res.status(400).send('group not found');
    }
    console.log('group2234' + group)

    if (group.members.includes(clientID)) {
      console.log("had")
      res.status(403).send("already in group")
    }
  });
  try {


    await Promise.all([Group.findOneAndUpdate({ groupName: groupName }, { $push: { members: clientID } }),
    Client.findOneAndUpdate({ clientID: clientID }, { $push: { joinedGroups: groupName, "joinedGroups": groupName, "lastmsg": null, "break": false } })
    ]);
    res.send("inserted")
  }
  catch (err) {
    console.log(err);
    res.send(500).send('internal server error');
  }
});


router.post('/leavegroup', async function (req, res, next) {
  const { clientID, groupName } = req.body;
  try {

    let requestGroup = await Group.findOne({ 'groupName': groupName });
    let requestClient = await Client.findOne({ 'clientID': clientID });


    if (!requestGroup || !requestClient) {
      throw {
        'name': 'NullRequestError',
        'message': 'Requested group or client is not found'
      }
    }
    else if (!requestClient.joinedGroups.includes(groupName) || !requestGroup.members.includes(clientID)) {
      throw {
        'name': 'NotExistError',
        'message': 'Either user is not in the group or group does not see client as their user'
      }
    }

    console.log(clientID, groupName)
    await Group.findOneAndUpdate({ groupName: groupName }, { $pull: { members: clientID } });
    // await Client.findOneAndUpdate({ clientID: clientID }, { $pull: { subscribedGroups: groupName } });
    await Client.findOne({ clientID: clientID }, async function (err, client) {
      if (err) return handleError(err);
      var size = client.subscribedGroups.length
      var joins = []
      var breaks = []
      var lastsmgs = []
      for (var i = 0; i < size; i++) {
        if (groupName != client.joinedGroups[i]) {
          joins.push(client.joinedGroups[i])
          breaks.push(client.break[i])
          lastsmgs.push(client.lastmsg[i])
        }
      }
      await Client.findOneAndUpdate({ clientID: clientID }, { $set: { joinedGroups: join, break: breaks, lastmsg: lastsmgs } });
    });
    res.send("leave")
  }
  catch (err) {

    console.log(err);
    res.send(err);
  }
});

router.post('/sendmessage', async function (req, res, next) {
  const { senderID, groupName, text } = req.body;
  console.log(req.body)
  // res.send(req.body)
  let newMessage = new Message({
    senderID: senderID,
    groupName: groupName,
    text: text,
    receivedTime: Date.now()
  });
  try {
    await newMessage.save();
  }
  catch (err) {
    console.log(err);
  }

  res.send(newMessage)
});


router.post('/joined', async (req, res) => {
  let { clientID } = req.body
  let client = await Client.findOne({ clientID })
  res.json(client.joinedGroups)
})

router.post('/readallmessage', async function (req, res, next) {
  const { groupName, clientID } = req.body;
  // res.send(req.body)
  Message.find({ groupName: groupName }, async function (err, messages) {
    var msgList = [];

    messages.forEach(function (msg) {
      var obj = { id: msg._id, senderID: msg.senderID, text: msg.text }
      msgList.push(obj)
    });

    await Client.findOne({ clientID: clientID }, async function (err, user) {
      var msgs = []
      if (user.break == null || !(user.break)) {
        console.log('check' + msgList[msgList.length - 1].id)
        await Client.findOneAndUpdate({ clientID: clientID }, { $set: { lastmsg: msgList[msgList.length - 1].id } });
        res.send(msgList);
      }
      else {
        console.log(msgList.length)
        console.log(user.lastmsg)
        for (var i = 0; i < msgList.length; i++) {
          if (String(user.lastmsg) == String(msgList[i].id)) {
            console.log('index ' + i)
            msgs.push(msgList[i])
            break
          } else {
            msgs.push(msgList[i])
          }
          console.log(i)
        }
        res.send(msgs)
      }
    });
  });
});

router.post('/getunread', async function (req, res, next) {
  const { groupName } = req.body;
  // res.send(req.body)


  Message.find({ groupName: groupName }, function (err, messages) {
    var msgList = [];

    messages.forEach(function (msg) {
      var obj = { senderID: msg.senderID, text: msg.text }
      msgList.push(obj)
    });

    res.send(msgList);
  });

  try {
    await newMessage.save();
  }
  catch (err) {
    console.log(err);
  }

  res.send(newMessage)
});

router.post('/break', async function (req, res, next) {
  const { clientID } = req.body;
  let a = await Client.findOneAndUpdate({ clientID: clientID }, { $set: { break: true } });
  res.send(a)
});
router.post('/unbreak', async function (req, res, next) {
  const { clientID } = req.body;

  Message.find({ groupName: groupName }, async function (err, messages) {
    var msgList = [];

    messages.forEach(function (msg) {
      var obj = { id: msg._id, senderID: msg.senderID, text: msg.text }
      msgList.push(obj)
    });
    let a = await Client.findOneAndUpdate({ clientID: clientID }, { $set: { break: false, lastmsg: msgList[msgList.length - 1] } });


  });
  res.send(a)
});
module.exports = router;
