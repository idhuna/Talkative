var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var Group = require('mongoose').model('Group');
var Client = require('mongoose').model('Client');
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
  try {
    await newUser.save();
  }
  catch (err) {
    console.log(err);
  }

  res.send(newUser)

});

router.post('/joingroup', async function (req, res, next) {
  console.log(req.body);

  const { clientID, groupID } = req.body;

  await Group.findOne({ groupID: groupID }, function (err, group) {
    if (err) return handleError(err);
    var obj = JSON.parse(JSON.stringify({
      clientID
    }));
    console.log(group)
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
    await Group.findOneAndUpdate({ groupID: groupID }, { $push: { members: clientID } });
    res.send("insert")

  }
  catch (err) {
    console.log(err);
  }




});


router.post('/leavegroup', async function (req, res, next) {
  const { clientID, groupID } = req.body;
  try {
    console.log(clientID, groupID)
    await Group.findOneAndUpdate({ groupID: groupID }, { $pull: { members: clientID } });
    res.send("leave")
  }
  catch (err) {
    console.log(err);
  }
});

module.exports = router;
