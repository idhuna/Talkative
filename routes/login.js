let express = require('express')
let router = express.Router()

router.get('/',(req,res) => {
  res.render('login',{title: "Login page"})
})

module.exports = router