const Posts = require('../../models/Posts')
const Comments = require('../../models/Comments')
const User = require('../../models/User')
const uploads = require('../../middleware/uploadImages')
const cloudinary = require('../../utils/cloudinary')

class ManagerComments {
    addComment = async(req, res) => {

        const postId = req.params.id;
        const message = req.body.message
        const userID = req.user.user_id;
        console.log('hello', postId);
        if(!message)
            return res.status(303).json({ success: false, message: "Missing message" })

        try {
            const checkPost = Posts.findById(postId);
            if(!checkPost)
                return res.status(300).json({ success: false, message: "This post could not be found" })
            
            const newComment = Comments({
                postid: postId,
                userid: userID,
                message: message
            })
            await newComment.save().then((comment) =>{
                Posts.findByIdAndUpdate(postId, {
                    "$push" : {
                        "list_comment": {
                            "commentid" : comment._id
                        }
                    }
                }).exec((error, post) => {
                    if(error) return res.status(300).json({ success: false, message: error })
                    if(post){
                        console.log("add comment successfully");
                        return res.status(200).json({
                            success: true, 
                            message: 'add comment successfully'
                        })
                    }
                })

            }).catch(err => {
                return res.status(300).json({ success: false, message: err})
            })   
        } catch (error) {
            return res.status(500).json({ success: false, message: err})
        }

    }
    getComment = async(req, res) => {
        const postId = req.params.id;
        const userID = req.user.user_id;

        const checkPost =await Posts.findById(postId);
        if(!checkPost)
            return res.status(300).json({ success: false, message: "This post could not be found" })
        
        try {
            await Comments.find({postid: postId}).populate({
                path: 'userid',
                select: ['_id','username', 'avatar']
            }).exec((error, comments) => {
                if(error) return res.status(300).json({ success: false, message: error })
                if(comments){
                    console.log("get comment successfully");
                    return res.status(200).json({
                        success: true, 
                        message: 'get comment successfully',
                        comments: comments
                    })
                }
            })
        } catch (error) {
            return res.status(500).json({ success: false, message: err})
        }
        

    }
    deleteComment = async(req, res) => {
        const postId = req.params.id;
        const userID = req.user.user_id;
        const commentID = req.body.commentID

        console.log('hello delete', commentID);
        if(!commentID || !postId)
            return res.status(300).json({ success: false, message: "Can't find comment id and post id" })
        
    }
}
module.exports = new ManagerComments