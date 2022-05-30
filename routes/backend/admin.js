const express = require('express');
const router = express.Router();
const AuthController = require('../../controller/Backend/AuthBackend')
const UserController = require('../../controller/Backend/UserBackend')
const PostController = require('../../controller/Backend/PostBackend')

router.get('/', UserController.getHome)

router.get('/login', AuthController.getLogin)

router.post('/login', AuthController.postLogin)

router.get('/all-post', PostController.allPost)

router.get('/all-comment', PostController.allPost)



module.exports = router;