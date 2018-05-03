let {io} = require('../socket.app')
let port = 3002

io.listen(port)
console.log(`socket listening at port ${port}`)