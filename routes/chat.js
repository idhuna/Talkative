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

setTimeout(()=>console.log("o0Saul1hSTpIJ9XGAAAF have connected"),60000)
setTimeout(()=>console.log("7IO3H_fBRKI68sFRAAAG have connected"),60000)
setTimeout(()=>console.log("3004Ltm-5vl_jIoYAAAC have connected"),60000)

module.exports = router;
