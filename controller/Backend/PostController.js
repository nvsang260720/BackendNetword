
const Posts = require('../../models/Posts')
class ManagerPost {
    allPost = async(req, res) => {
        try {
			const allPost = await Posts.find()
            console.log(allPost);
			res.render('admin/posts/listPosts', { title: 'Manager Post', posts: allPost});
		} catch (error) {
			res.json({ message: 'get ser fail' })
		}
    }
}

module.exports = new ManagerPost();