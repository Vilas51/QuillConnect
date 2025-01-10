const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    comment:{
        type: String,
        required: true
    },
    postId:{
        type: String,
        required: true
    },
    userId:{
        type: String,
        required: true
    },
    name : {
        type: String,
        default : "",
        required : true
    },
    profilePicture : {
        type: String,
        default : "",
        required : true
    },
    reply :[ {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'Comment'
    }],
    likes:[{
        type: mongoose.Schema.Types.ObjectId,
        ref : 'Like'
    }],
},
{timestamps: true})

module.exports = mongoose.model('Comment', commentSchema);