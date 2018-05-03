var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

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



module.exports = router;
