
const Posts = require('../../models/Posts')
const User = require('../../models/User')
const uploads = require('../../middleware/uploadImages')

class PostUser {
    newPost = async(req, res) => {
        const listImage = [];
        const imagePath = req.files;
        const { content } = req.body;
        const userID = req.user.user_id;

        await imagePath.forEach(file => {
            listImage.push(file.filename);
        });
        
        try {
            if (content) {
                const data = Posts({
                    ownerid: userID,
                    content: content,
                    images: listImage
                });
                await Posts.create(data, (err, newPost) => {
                    if (err) {
                        return res.status(500).json({ error: err });
                    } else if (!newPost) {
                        return res.status(400).json({ message: "No Post found" });
                    } else if (newPost) {
                        User.findByIdAndUpdate(userID, {
                        "$push" : {
                                "posts": newPost._id
                            }
                        })
                        .exec((error, user) => {
                            if(error) return res.json({ success: false, message: error })
                            if(user){
                                res.json({
                                    success: true, 
                                    message: 'set profile successfully', 
                                    user: user
                                })
                            }
                        })
                    }
                })   
            }
        } catch (error) {
            res.json({ success: false, message: error })
        }

    }
}

module.exports = new PostUser()
