const express = require('express');
const router = express.Router();
const AuthController = require('../../controller/Backend/AuthController')
const UserController = require('../../controller/Backend/BackendUserController')
const PostController = require('../../controller/Backend/PostController')

router.get('/', UserController.getHome)

router.get('/login', AuthController.getLogin)

router.post('/login', AuthController.postLogin)

router.get('/all-post', PostController.allPost)



module.exports = router;