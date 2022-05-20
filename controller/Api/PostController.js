
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
            return res.status(400).json({ message: "missing content post" });
        try {
            const user = User.findById({userID})
            if(!user)
                return res.status(400).json({ message: "missing content user" });

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
                            console.log(user);
                            return res.status(200).json({
                                success: true, 
                                message: 'set profile successfully', 
                                user: user
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
            return res.status(300).json({ success: false, message: "missing id Post" })
        try {
            await Posts.find({ownerid: userID})
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
        console.log(postID);

    }
}

module.exports = new PostUser()
