const Comments = require('../../models/Comments')

class CommentController {
    allComment = async(req, res) => {
       try {
		    const comments = await Comments.find()
			res.render('admin/comments/listComments', { title: 'Admin', comments: comments});
		} catch (error) {
			res.json({ message: 'get ser fail' })
		}
    
    }
}

module.exports = new CommentController()