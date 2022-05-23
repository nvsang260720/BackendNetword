
const Posts = require('../../models/Posts');
const User = require('../../models/User');
class ManagerPost {
    allPost = async(req, res) => {
        try {
			const allPost = await Posts.find()
			res.render('admin/posts/listPosts', { title: 'Manager Post', posts: allPost});
		} catch (error) {
			res.json({ message: 'get ser fail' })
		}
    }
	deletePost = async(req, res) => {
		 const postId = req.params.id
		console.log("postId :",postId);
		if(!postId) 
			return res.json("fail id user")

		try {
			await Posts.findOneAndDelete({_id :postId})
			.then((post) => {
				console.log(post.ownerid)
				User.findByIdAndUpdate(post.ownerid, {	
					$pull: {
						posts:  post._id
					}
            	})
				.exec((error, user) => {
					if(error) return res.redirect('/admin')
					if(user){
						return res.redirect('/admin/all-post')
					}
				})	
			})
			.catch((err) => {
				return res.status(400).json({ err: err });
			});
		} catch (error) {
			console.log(error)
			res.status(500).json({ success: false, message: 'Internal server error' })
		}
	}
}

module.exports = new ManagerPost();