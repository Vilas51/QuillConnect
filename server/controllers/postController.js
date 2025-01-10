//create post
//getAllPost
//deletePost

const Post = require('../models/postSchema');
const user = require('../models/userSchema');

exports.createPost = async (req, res) => {
    const newPost = new Post(req.body);
    try{
        const savedPost = await newPost.save();
        const User = await user.findById(req.body.userId);
        await User.updateOne({$push : {posts : newPost._id}})
        res.status(200).json(
            {
                success: true,
                message: 'Post created successfully',
                data : savedPost   
            } 
        )

    }catch(err){
        res.status(500).json(err);
    }
}

exports.getAllPost = async (req, res) => {
    const currentUser = await user.findById(req.params.id);
    try{
        const userPosts = await Post.find({userId: req.params.id});
        
        const friendPosts = await Promise.all(
            currentUser.followings.map((friendId) => {
                return Post.find({ userId: friendId });
            })
        )
        res.status(200).json({
            success : true,
            message : "All posts fetched successfully",
            data : userPosts.concat(...friendPosts).sort((p1,p2)=>{
                return new Date(p2.createdAt) - new Date(p1.createdAt);
            })
        })
    }catch(err){
        res.status(500).json(err);
    }
}

exports.getPost = async (req, res) => {
    try{
        const id = req.params.id;
        const post = await Post.findById(id);
        res.status(200).json({
            success: true,
            message: 'single post fetched successfully',
            data: post
        })
    }catch(err){
        res.status(500).json(err);
    }
}

exports.addBookmark = async (req, res) => {
    try{
        const id = req.params.id;
        const userId = req.body.userId;
        const post = await user.findByIdAndUpdate(userId,{ $push : {bookmarks : id}});
        res.status(200).json({
            success: true,
            message: 'single bookmark added successfully',
            data: post
        })
    }catch(err){
        res.status(500).json(err);
    }
}

exports.deleteBookmark = async (req, res) => {
    try{
        const id = req.params.id;
        const userId = req.body.userId;
        const post = await user.findByIdAndUpdate(userId,{ $pull : {bookmarks : id}});
        res.status(200).json({
            success: true,
            message: 'single bookmark added successfully',
            data: post
        })
    }catch(err){
        res.status(500).json(err);
    }
}


exports.deletePost = async (req, res) => {
    try{

        const {id} = req.params;
        const userId = req.body.userId;
        console.log("userId",userId);

        const post = await Post.findByIdAndDelete(id);
        console.log("post",post);
        const postArray = await user.findByIdAndUpdate(userId,{ $pull : {posts : id}});
        console.log("postArray",postArray);
        if(postArray.bookmarks.includes(id)){
            const bookmarkpost = await user.findByIdAndUpdate(userId,{ $pull : {bookmarks : id}});
            console.log("bookmarkpost",bookmarkpost);
        }
        res.status(200).json({
            success: true,
            message: 'Post deleted successfully',
            data: post
        })

    }catch(err){
        res.status(500).json(err);
    }
}

exports.likeUnlikePost = async(req,res)=>{
    try{
        const post = await Post.findById(req.params.id);
        const userId  = req.body.userId;
        if(!post.likes.includes(req.body.userId)){
            const likedPost = await post.updateOne({$push : {likes : userId}});
            res.status(200).json({
                success : true,
                message : "Liked successful to post",
                data : likedPost
            });
        }else{
            const unlikedPost = await post.updateOne({$pull : {likes : userId}});
            res.status(200).json({
                success : true,
                message : "Unliked successful to post",
                data : unlikedPost
            });
        }

    }catch(err){
        res.status(500).json(err);
    }
}

exports.getAllUserPost = async(req,res)=>{
    try{
        const posts = await Post.find({userId : req.params.id});
        res.status(200).json({
            success : true,
            message : "All posts fetched successfully",
            data : posts
        })
    }catch(err){
        res.status(500).json(err);
    }
}

