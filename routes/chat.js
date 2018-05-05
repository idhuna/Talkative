var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var Client = mongoose.model('Client');

/* GET home page. */

router.post('/', async function (req, res, next) {
  console.log("logged in", req.body)
  let { clientID, password} = req.body

  let client = await Client.find({ clientID })
  if(client.length !== 1 || client[0].password !== password) res.render('login',{title:"Login page",err: "Wrong username or password"})
  else {
    let clientName = client.name
    let port = process.env.PORT
    res.render('index', { title: 'Talkactive', clientID, port })
  };
});

module.exports = router;
