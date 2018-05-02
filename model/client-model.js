var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var clientSchema = new Schema({
    clientID: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    name: {
        type: String,
        required: true,
    },

});

mongoose.model('client', clientSchema);