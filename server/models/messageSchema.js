const mongoose = require('mongoose');

const messagesSchema = new mongoose.Schema({
    conversationId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'conversation'
    },
    senderId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'user'
    },
    message : {
        type : String,
        required: true
    },
},
{timestamps: true})

module.exports = mongoose.model('Messages', messagesSchema);