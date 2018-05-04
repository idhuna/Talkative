var express = require('express');
var router = express.Router();
const request = require('request');
const servers = ['http://localhost:3000', 'http://localhost:3004' ];
let cur = 0; 

/* GET home page. */
const handler =(req, res) => {
  // let _req
  // _req = request({ url: servers[cur] + req.url }).on('error', error => {
  //   res.status(500).send(error.message);
  // _req = await request({ url: servers[0] + req.url }).on('error', async error => {
  //   await req.pipe(request({ url: servers[1] + req.url })).pipe(res);
  // });
    req.pipe(request({ url: servers[0] + req.url }))
    .on('error', error => {
      console.log('error')
      req.pipe(request({ url: servers[1] + req.url })).pipe(res);
    })
    .pipe(res);
      // req.pipe(request({ url: servers[1] + req.url }))
    console.log("hello")
}
// };
const server = express().get('*', handler).post('*', handler);
server.listen(8000)
console.log("listen at 8000")
module.exports = router;
