const express = require('express');
const router = express.Router();

const UserController = require('../../controller/Api/UserController')
const PostController = require('../../controller/Api/PostController')
const uploads = require('../../middleware/uploadImages')


router.get('/profile/:id', UserController.getProfile)

router.post('/profile/:id', UserController.setProfile)

router.post('/upload-avatar/', uploads.single("upload_avatar"), UserController.uploadAvatar)

router.patch('/upload-cover/', uploads.single("upload_cover"), UserController.uploadCover)

router.post('/new-post/', uploads.array("upload_posts", 6), PostController.newPost)

router.get('/post/:id', PostController.getPost)

router.put('/like-post/:id', PostController.likePost)

module.exports = router;