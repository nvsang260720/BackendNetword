const express = require('express');
const router = express.Router();

const UserController = require('../../controller/Api/UserController')
const PostController = require('../../controller/Api/PostController')
const uploads = require('../../middleware/uploadImages')


router.get('/profile/:id', UserController.getProfile)

router.post('/profile/:id', UserController.setProfile)

router.patch('/upload-avatar/:id', uploads.single("upload_avatar"), UserController.uploadAvatar)

router.patch('/upload-cover/:id', uploads.single("upload_cover"), UserController.uploadCover)

router.post('/new-post/', PostController.newPost)

module.exports = router;