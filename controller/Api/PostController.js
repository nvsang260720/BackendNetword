
const Posts = require('../../models/Posts')
const User = require('../../models/User')
const uploads = require('../../middleware/uploadImages')

class PostUser {
    newPost = async(req, res) => {
        const listImage = [];
        const imagePath = req.files;
        const { content } = req.body;
        const userID = req.user.user_id;
        imagePath.forEach(file => {
            listImage.push(file.filename);
        });
        if(!content)
            return res.status(400).json({ success: false, message: "missing content post" });
        try {
            const user = User.findById({userID})
            if(!user)
                return res.status(400).json({success: false, message: "missing content user" });

            const newPost = Posts({ownerid:userID, content:content, images:listImage});
            await newPost.save()
                .then((newPost) => {
                    User.findByIdAndUpdate( userID, {
                        "$push" : {
                            "posts": newPost._id
                        }
                    })
                    .exec((error, user) => {
                        if(error) return res.status(300).json({ success: false, message: error })
                        if(user){
                            console.log("add posts successfully");
                            return res.status(200).json({
                                success: true, 
                                message: 'add posts successfully', 
                                post: newPost
                            })
                        }
                    })
                })
            .catch((err) => {
                res.status(300).json({success: false, message: err });
            });
           
        } catch (error) {
            res.status(500).json({success: false, message: err });
        }
    }

    allPost = async(req, res) => {
        try {
            await Posts.find()
            .populate({
                path: 'ownerid',
                select: ['username', 'avatar']
            })
            .exec((error, posts) => {
                if(error) return res.status(300).json({ success: false, message: error })
                if(posts){
                    res.status(200)
                    .json({
                        success: true, 
                        message: 'get post successfully', 
                        posts: posts
                    })
                }
            })
        } catch (error) {
            res.status(500)
            .json({
                success: false, 
                message: error, 
            })
        }
    }
    getPost = async(req, res) => {
        const userID = req.user.user_id
        if(!userID)
            return res.status(300).json({ success: false, message: "missing token" })
        try {
            await Posts.find({ownerid: userID})
            .populate({
                path: 'ownerid',
                select: ['username', 'avatar']
            })
            .exec((error, post) => {
                if(error) return res.status(300).json({ success: false, message: error })
                if(post){
                    res.status(200)
                    .json({
                        success: true, 
                        message: 'get post successfully', 
                        posts: post
                    })
                }
            })
        } catch (error) {
            res.status(500)
            .json({
                success: false, 
                message: error, 
            })
        }
    }
    likePost = async(req, res) => {
        const postID = req.params.id
        const userID = req.user.user_id 
        console.log(userID);
        if(!postID)
            return res.status(300).json({ success: false, message: "missing id Post" })
        try {
            const checkPost = Posts.findById({userid: postID})
            await Posts.findById(postID)
            .exec((error, post) => {
                if(error) return res.status(300).json({ success: false, message: error })
                if(post){
                    var liked = []
                    liked.push(post.like)
                   
                    if (typeof liked !== 'undefined' && liked.length > 0) {
                        // the array is defined and has at least one element 
                        console.log("hello")
                        Posts.findByIdAndUpdate({_id: postID},
                            {
                            "$push" : {
                                "like" : {
                                    userid : userID,
                                    liked : 1

                                }
                            }
                        }).exec((error, post) => {
                            if(error) return res.status(300).json({ success: false, message: error })
                            if(post){
                                return res.status(200)
                                .json({
                                    success: true, 
                                    message: 'liked this post successfully', 
                                    posts: post
                                })
                            }
                        })
                    }
                    else{
                        console.log(liked);
                    }
                   
  
                }
            })
        } catch (error) {
           res.status(200).json({
                success: false, 
                message: error
            }) 
        }
    }
}

module.exports = new PostUser()
