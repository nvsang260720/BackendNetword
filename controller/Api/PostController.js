
const Posts = require('../../models/Posts')
const User = require('../../models/User')
const uploads = require('../../middleware/uploadImages')

class PostUser {
    newPost = async(req, res) => {
        const listImage = []
        const imagePath = req.files
        const { userid, content } = req.body

        // imagePath.forEach(file => {
        //     listImage.push(file.filename)
        // });
        
        console.log(JSON.stringify(req.body))
        

    }
}

module.exports = new PostUser()
