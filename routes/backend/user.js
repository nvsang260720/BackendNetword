const express = require('express');
const router = express.Router();
const UserController = require('../../controller/Backend/UserBackend')
const PostController = require('../../controller/Backend/PostBackend')

const uploads = require('../../middleware/uploadImages')

router.get('/', UserController.getUser)

router.get('/view-profile/:id', UserController.getProfile)

router.get('/update-user/:id', UserController.getUpdateUser)

router.post('/delete-user/:id',UserController.deleteUser)

router.post('/post/:id', PostController.deletePost)

module.exports = router;