var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var groupSchema = new Schema({
    groupName: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    members: {
        type: [String],
        default: null,
    },
    
});

const Group = mongoose.model('Group',groupSchema);

module.exports = Group;