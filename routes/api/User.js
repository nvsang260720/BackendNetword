const express = require('express');
const router = express.Router();

const UserController = require('../../controller/Api/UserController')
const PostController = require('../../controller/Api/PostController')
const uploads = require('../../middleware/uploadImages')
const CommentController = require('../../controller/Api/CommentController')
const cloudinary = require('../../utils/cloudinary')

//user
router.get('/profile/:id', UserController.getProfile)

router.post('/profile/:id', UserController.setProfile)

router.patch('/upload-avatar/', uploads.single("upload_avatar"), UserController.uploadAvatar)

router.patch('/upload-cover/', uploads.single("upload_cover"), UserController.uploadCover)

//post
router.post('/new-post/', uploads.array("upload_posts", 6), PostController.newPost)

router.post('/delete-post/', PostController.deletePosts)

router.get('/get-post/', PostController.getPost)

router.put('/like-post/:id', PostController.likePost)

// comment post
router.post('/comment-post/:id', CommentController.addComment)

router.get('/comment-post/:id', CommentController.getComment)

router.delete('/comment-post/:id', CommentController.deleteComment)

router.post('/rep-comment/:id', CommentController.addRepComment)

router.post('/rep-comment/delete/:id', CommentController.deleteRepComment)

router.get('/rep-comment/:id', CommentController.getRepComment)

//follow user
router.post('/follow/', UserController.addFollows)

router.post('/un-follow/', UserController.deleteFollow)

router.get('/all-images/:id', UserController.getAllImage)


module.exports = router;