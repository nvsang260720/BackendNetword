const express = require('express');
const router = express.Router();

const UserController = require('../../controller/Api/UserController')
const PostController = require('../../controller/Api/PostController')
const uploads = require('../../middleware/uploadImages')
const cloudinary = require('../../utils/cloudinary')

router.get('/profile/:id', UserController.getProfile)

router.post('/profile/:id', UserController.setProfile)

router.patch('/upload-avatar/', uploads.single("upload_avatar"), UserController.uploadAvatar)

router.patch('/upload-cover/', uploads.single("upload_cover"), UserController.uploadCover)

router.post('/new-post/', uploads.array("upload_posts", 6), PostController.newPost)

router.post('/delete-post/', PostController.deletePosts)

router.get('/get-post/', PostController.getPost)

router.put('/like-post/:id', PostController.likePost)

router.post('/follow/', UserController.addFollows)

router.post('/un-follow/', UserController.deleteFollow)


module.exports = router;