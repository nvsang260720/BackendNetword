
class PostUser {
    newPost = async(req, res) => {
        const listImage = []
        const imagePath = req.files
        imagePath.forEach(file => {
            listImage.push(file.filename)
        });
        console.log(listImage)
        console.log(req.body)
    }
}

module.exports = new PostUser()
