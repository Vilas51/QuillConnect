const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'user'
    },
    media:{
        type: String,
        default : ""
    },
    caption:{
        type: String,
        required: true
    },
    likes:[{
        type: mongoose.Schema.Types.ObjectId,
        ref : 'Like'
    }],
    comments:[{
        type: mongoose.Schema.Types.ObjectId,
        ref : 'Comment'
    }],
    date : {
        type: Date,
        default: Date.now
    },
},
{timestamps: true})

module.exports = mongoose.model('Post', postSchema);