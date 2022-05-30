const Posts = require('../../models/Posts')
const Comments = require('../../models/Comments')
const User = require('../../models/User')
const uploads = require('../../middleware/uploadImages')
const cloudinary = require('../../utils/cloudinary')

class PostUser {
    newPost = async(req, res) => {
        let pictureFiles = req.files;
        var listUrl = [];
        const { content } = req.body;
        const userID = req.user.user_id;

        if(!content)
            return res.status(400).json({ success: false, message: "missing content post" });
        try {
            const user = await User.findById({_id: userID})
            if(!user)
                return res.status(400).json({success: false, message: "Account does not exist" });

            for (let file of req.files) {
                await cloudinary.uploader.upload(file.path, {
                    upload_preset: 'upload_avata',
                    folder: userID
                }).then(result => {
                    listUrl.push(result.url);
                })
                .catch(err => {
                    console.log(err);
                });
            }
            const newPost = await Posts({ownerid:userID, content:content, images: listUrl});
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
                }).catch((err) => {
                    res.status(300).json({success: false, message: err });
                });
           
        } catch (error) {
            res.status(500).json({success: false, message: error });
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
                    return res.status(200).json({
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
        const userId = req.user.user_id
        if(!userId)
            return res.status(300).json({ success: false, message: "missing token" })
        try {
            const checkUser = await User.findById(userId)
            if(!checkUser)
                return res.status(300).json({ success: false, message: "Account does not exist" }) 
               
            await Posts.find({ownerid: userId})
            .populate({
                path: 'ownerid',
                select: ['username', 'avatar']
            })
            .exec((error, post) => {
                if(error) return res.status(300).json({ success: false, message: error })
                if(post){
                    return res.status(200).json({
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
        const postId = req.params.id
        const userId = req.user.user_id 
        const {statusLike} = req.body
        if(!postId)
            return res.status(300).json({ success: false, message: "Missing id Post" })
        try {
            const checkUser = await User.findById(userId)
            const checkPost = await Posts.findById(postId)
            if(!checkUser || !checkPost)
                return res.status(300).json({ success: false, message: "Account or Posts does not exist" }) 

            await Posts.findById(postId)
            .exec((error, post) => {
                if(error) return res.status(300).json({ success: false, message: error })
                if(post){
                    const liked = []
                    liked.push(post.like)
                    const arrayLike = liked.flat(Infinity)
                    
                    var checkID = arrayLike.map(function(e) {
                        return e.userid;
                    }).includes(userId);

                    if (checkID == false) {
                        Posts.findByIdAndUpdate({_id: postId},
                            {
                            "$push" : {
                                "like" : {
                                    userid : userId,
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
                        Posts.findByIdAndUpdate({_id: postId},
                            {
                            "$set" : {
                                "like" : {
                                    userid : userId,
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
    deletePosts = async(req, res) => {
        const postId = req.body.postID
        const userId = req.user.user_id 
        if(!postId)
            return res.status(303).json({ success: false, message: "Missing id Post" })

        try {
            const checkPost = await Posts.findById(postId)
            if(!checkPost)
                return res.status(300).json({ success: false, message: 'Post not found' })

            await Posts.findByIdAndDelete(postId).exec((error, post) => {
                if(error) return res.status(300).json({ success: false, message: error })
                if(post){
                    User.findByIdAndUpdate(userId, {
                        "$pull" : {
                            "posts": post._id
                        }
                    }).exec((error, user) => {
                        if(error) return res.status(300).json({ success: false, message: error })
                        if(user){
                            return res.status(200).json({
                                success: true, 
                                message: 'Delete post successfully'
                            })
                        }
                    })
                    
                }
            })
        } catch (error) {
            return res.status(500).json({ success: false, message: "error server" })
        }
    }
}

module.exports = new PostUser()
