var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var groupSchema = new Schema({
    groupID: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    members: {
        type: [Schema.Types.ObjectId],
        default: null,
    },
    groupName: {
        type: String,
        required: true,
        unique: true,
    }
});

mongoose.model('Group',groupSchema);