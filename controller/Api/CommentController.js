const Posts = require('../../models/Posts')
const Comments = require('../../models/Comments')
const User = require('../../models/User')
const uploads = require('../../middleware/uploadImages')
const RepComments = require('../../models/RepComment')
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
                            message: 'add comment successfully',
                            comment: newComment
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

        if(!commentID || !postId)
            return res.status(300).json({ success: false, message: "Can't find comment id and post id" })
        try {
            const checkPost =await Posts.findById(postId);
            if(!checkPost)
                return res.status(300).json({ success: false, message: "This post could not be found" })
            
            await Comments.findByIdAndDelete(commentID).exec((error, comments) => {
                if(error) return res.status(300).json({ success: false, message: error })
                if(comments){
                    console.log("Delete comment successfully");
                    Posts.findByIdAndUpdate(postId, {
                        "$pull" : {
                            "list_comment": {
                                "commentid" : comments._id
                            }
                        }
                    }).exec((error, posts) => {
                        if(error) return res.status(300).json({ success: false, message: error })
                        if(posts){
                            return res.status(200).json({
                                success: true, 
                                message: 'Delete comment successfully',
                            })
                        }
                    })
                }
            }) 
        } catch (error) {
            return res.status(500).json({ success: false, message: err})
        }
    }
    getRepComment = async(req, res) => {
        const commentID = req.params.id;
        const userID = req.user.user_id;
        if(!commentID)
            return res.status(300).json({ success: false, message: "Can't find comment id" })
        
        try {
            const checkComment =await Comments.findById(commentID);
            if(!checkComment)
                return res.status(300).json({ success: false, message: "This comment could not be found" })
            await RepComments.find({commentid: commentID}).populate({
                path: 'userid',
                select: ['_id','username', 'avatar']
            }).exec((error, repcomment) => {
                if(error) return res.status(300).json({ success: false, message: error })
                if(repcomment){
                    return res.status(200).json({
                        success: true, 
                        message: 'Get rep comment successfully',
                        repcomment: repcomment
                    })
                }
            })
        } catch (error) {
            
        }
    
    }
    addRepComment = async(req, res) => {
        const commentID = req.params.id;
        const userID = req.user.user_id;
        const message = req.body.message;
 
        if(!message)
            return res.status(300).json({ success: false, message: "Missing message" })

        try {
            const comment =await Comments.findById(commentID);
            const checkUser = await User.findById(userID);
            if(!checkUser)
                return res.status(300).json({ success: false, message: "This account does not exist" })
            if(!comment)
                return res.status(300).json({ success: false, message: "This comment could not be found" })

            const newRepComment =await RepComments({
                commentid: commentID,
                userid: userID,
                message: message
            })
            await newRepComment.save().then((repcomment) => {
                Comments.findByIdAndUpdate(repcomment.commentid, {
                    "$push" : {
                        "rep_comment": newRepComment._id
                    }
                }).then((comment) => {
                    return res.status(200).json({
                        success: true, 
                        message: 'Add rep comment successfully',
                        repcomment: newRepComment
                    })
                }).catch((error) => {
                    res.status(300).json({success: false, message: error });
                }) 
            }).catch((error) => {
                res.status(300).json({success: false, message: error });
            });
        } catch (error) {
            return res.status(500).json({ success: false, message: "server error" })
        }
    }
    deleteRepComment = async(req,res) => {
        const repCommentID = req.params.id;
        const userID = req.user.user_id;
        const commentID = req.body.commentID;
        if(!commentID)
            return res.status(300).json({ success: false, message: "Missing id comment" })

        try {
            const comment =await Comments.findById(commentID);
            const checkUser = await User.findById(userID);
            if(!checkUser)
                return res.status(300).json({ success: false, message: "This account does not exist" })
            if(!comment)
                return res.status(300).json({ success: false, message: "This comment could not be found" })

            await RepComments.findByIdAndDelete(repCommentID).exec((error, repcomment) => {
                if(error) return res.status(300).json({ success: false, message: error })
                if(repcomment){
                    Comments.findByIdAndUpdate(commentID, {
                        "$pull" : {
                            "rep_comment": repcomment._id
                        }
                    }).exec((error, comment) => {
                        if(error) return res.status(300).json({ success: false, message: error })
                        if(comment){
                            return res.status(200).json({
                                success: true, 
                                message: 'Delete rep comment successfully'
                            })
                        }
                    })
                }
            })
            
        } catch (error) {
            return res.status(500).json({ success: false, message: "server error" })
        }
    }
}
module.exports = new ManagerComments