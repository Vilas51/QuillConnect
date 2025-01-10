const Comment = require('../models/commentsSchema');
const Post = require('../models/postSchema')
exports.createComment = async (req, res) => {
    try{
        const postId = req.params.id;
        const {comment,userId,profilePicture, name} = req.body;
        const newComment = await Comment.create({comment, name, profilePicture, postId, userId});
        
        // Push the comment ID to the corresponding post's comments array
        const updateUser = await Post.findByIdAndUpdate(postId, { $push: { comments: newComment._id } });
        
        res.status(200).json(
            {
                success: true,
                message: 'Comment created successfully',
                data : newComment   
            } 
        )
        
    }catch(err){
        res.status(500).json(err);
    }
}

exports.likeUnlikeComment = async (req, res) => {
    try{
        const commentId = req.params.id;
        const userId = req.body.userId;

        const comment = await Comment.findById(commentId);
        if(comment.likes.includes(userId)){
            const unlikedComment = await comment.updateOne({$pull : {likes : userId}});
            res.status(200).json({
                success : true,
                msg : "Comment DisLiked", 
                data : unlikedComment
            }) 
        }else{
            const likedComment = await comment.updateOne({$push : {likes : userId}});
            res.status(200).json({
                success : true,
                msg : "Comment Liked",
                data : likedComment
            })
        }

    }catch(err){
        res.status(500).json(err);
    }
} 

exports.getAllComment = async (req, res) => {
    try{
        const {id} = req.params;
        const allComments = await Comment.find({postId : id})
        res.status(200).json({
            success : true,
            msg : "All comments are fetched",
            data : allComments.sort((p1,p2)=>{
                return new Date(p2.createdAt) - new Date(p1.createdAt);
            })
        })
    }catch(err){
        res.status(500).json(err);
    }
}

exports.deleteComment = async (req, res) =>{
    try{
        const {id} = req.params;
        const comment = await Comment.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: 'Comment deleted successfully',
            data: comment
        })

    }catch(error){
        res.status(500).json(error);
    }
}



