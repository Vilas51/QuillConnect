const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        default : ""
    },
    username:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{ 
        type: String,
        required: true
    },
    followers:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    followings:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    friendRequests:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    posts:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }],
    bookmarks : [
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
        }
    ],
    profilePicture:{
        type: String,
        default: "https://firebasestorage.googleapis.com/v0/b/sharefun-dc053.appspot.com/o/media%2Fimages%2FdefaultProfilePicture.jpg?alt=media&token=12594fa8-81ef-4aa9-9263-24d9ed6cf36f"
    },
    coverPicture : { 
        type: String,
        default: "https://firebasestorage.googleapis.com/v0/b/sharefun-dc053.appspot.com/o/media%2Fimages%2FdefaultCoverPicture.jpg?alt=media&token=58b1c85c-7969-4c0a-8860-a24c2f7d7281"
    },
    location : {
        type: String,
        default: ""
    },
    bio:{
        type: String,
        default: ""
    },

},
{timestamps: true})

module.exports = mongoose.model('User', userSchema);