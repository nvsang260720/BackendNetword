const Comments = require('../../models/Comments')
const Posts = require('../../models/Posts')

class CommentController {
    allComment = async(req, res) => {
       try {
		    const comments = await Comments.find()
			res.render('admin/comments/listComments', { title: 'Admin', comments: comments});
		} catch (error) {
			res.json({ message: 'get ser fail' })
		}
    
    }
	deleteComment = async(req, res) => {
		const commentID = req.params.id;

        try {
            await Comments.findByIdAndDelete(commentID).exec((error, comments) => {
                if(error) return res.status(300).json({ success: false, message: error })
                if(comments){
                    return res.redirect('/admin/all-comment')

                }
            }) 
        } catch (error) {
            return res.status(500).json({ success: false, message: err})
        }
	}
}

module.exports = new CommentController()