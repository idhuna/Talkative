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
    var obj = JSON.parse(JSON.stringify({
      clientID
    }));
    console.log('group2234' + group)
    var inGroup = false;
    for (var i = 0; i < group.members.length; i++) {
      if (String(group.members[i]) == clientID) {
        inGroup = true
      }
    }

    if (inGroup) {
      console.log("had")
      res.send("already in group")
    }
  });
  try {
    await Group.findOneAndUpdate({ groupName: groupName }, { $push: { members: clientID } });
    await Client.findOneAndUpdate({ clientID: clientID }, { $push: { subscribedGroups: groupName } });
    res.send("insert")
  }
  catch (err) {
    console.log(err);
  }
});


router.post('/leavegroup', async function (req, res, next) {
  const { clientID, groupName } = req.body;
  try {
    console.log(clientID, groupName)
    await Group.findOneAndUpdate({ groupName: groupName }, { $pull: { members: clientID } });
    await Client.findOneAndUpdate({ clientID: clientID }, { $pull: { subscribedGroups: groupName } });
    res.send("leave")
  }
  catch (err) {

    console.log(err);
  }
});

router.post('/sendmessage', async function (req, res, next) {
  const { senderID, groupName, text } = req.body;
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
module.exports = router;
