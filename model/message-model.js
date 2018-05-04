var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var messageSchema = new Schema({
    groupName: {
        type: String,
        required: true,
    },
    senderID: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    receivedTime: {
        type: Date,
        default: Date.now(),
    }
});

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;