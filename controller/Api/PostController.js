const Posts = require('../../models/Posts')
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
                return res.status(400).json({success: false, message: "missing content user" });

            for (let file of req.files) {
                await cloudinary.uploader.upload(file.path, {
                    upload_preset: 'upload_avata'
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
                })
            .catch((err) => {
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
                    console.log(posts);
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
                    console.log(post);
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
