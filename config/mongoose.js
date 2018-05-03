var mongoose = require('mongoose');


module.exports = async function() {
    require('../model/client-model');
    require('../model/group-model');
    require('../model/message-model');
    //we should change to acuire url from another file
    await mongoose.connect('mongodb://localhost/test').catch((err) => console.log(err));
    mongoose.Promise = global.Promise;
    
    var db = mongoose.connection;
    db.once('open', function() {
        console.log('mongodb connected!!');

        
    });
    
    console.log('model loaded');
    
    return db;
}
