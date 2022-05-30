const express = require('express');
const router = express.Router();

const PostController = require('../../controller/Api/PostController')
const UserController = require('../../controller/Api/UserController')

router.get('/all-post', PostController.allPost)

router.get('/all-user', UserController.getAllUser)

// router.get('/get-banner', BannerController.getBanner)


module.exports = router;