var mongoose = require('mongoose');

module.exports = function() {
    //we should change to acuire url from another file
    var db = mongoose.connect('mongodb://localhost/test')
    
    require('../model/client-model');
    require('../model/group-model');
    require('../model/message-model');
}
