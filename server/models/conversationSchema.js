const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
    members : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'user'
    }],
    groupName : {
        type : String,
        default : ""
    }
},
{timestamps: true})

module.exports = mongoose.model('conversation', conversationSchema);