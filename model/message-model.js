var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var messageSchema = new Schema({
    groupID: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    senderID: {
        type: Schema.Types.ObjectId,
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

mongoose.model('message',messageSchema);