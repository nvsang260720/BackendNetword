
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
        const {statusLike} = req.body
        console.log("Status like: " + statusLike);
        console.log("User id: " + userID)
        if(!postID)
            return res.status(300).json({ success: false, message: "missing id Post" })
        try {
            const checkPost = Posts.findById({userid: postID})
            await Posts.findById(postID)
            .exec((error, post) => {
                if(error) return res.status(300).json({ success: false, message: error })
                if(post){
                    const liked = []
                    liked.push(post.like)
                    const arrayLike = liked.flat(Infinity)
                    
                    var checkID = arrayLike.map(function(e) {
                        return e.userid;
                    }).includes(userID);

                    if (checkID == false) {
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
                                    message: 'status: ' + 1 + ' successfully'
                                })
                            }
                        })
                    }
                    else{
                        Posts.findByIdAndUpdate({_id: postID},
                            {
                            "$set" : {
                                "like" : {
                                    userid : userID,
                                    liked : statusLike

                                }
                            }
                        }).exec((error, post) => {
                            if(error) return res.status(300).json({ success: false, message: error })
                            if(post){
                                return res.status(200)
                                .json({
                                    success: true, 
                                    message: 'status: ' + statusLike + ' successfully'
                                })
                            }
                        })
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
