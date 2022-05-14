
const Posts = require('../../models/Posts')
class PostUser {
    newPost = async(req, res) => {
        const listImage = []
        const imagePath = req.files
        const { content } = req.body
        imagePath.forEach(file => {
            listImage.push(file.filename)
        });
        const id =  req.user
        console.log(id)
        if (!content)
            return res
                .json({ success: false, message: 'missing description for post' })
        try {
            const newPost = new Posts({ 
                idOwner: req.user._id,
                content: content,
                images: listImage 
            })
            await newPost.save()
            res.json({ success: true,message: 'created successfully',data: newPost })
        } catch (error) {
            console.log(error)
            res.json({ success: false, message: 'server error' })
        }
    }
}

module.exports = new PostUser()
