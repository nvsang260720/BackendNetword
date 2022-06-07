const express = require('express');
const router = express.Router();
const UserController = require('../../controller/Backend/UserBackend')
const PostController = require('../../controller/Backend/PostBackend')
const CommentController = require('../../controller/Backend/CommentBackend')


router.get('/', UserController.getHome)

router.get('/all-post', PostController.allPost)

router.get('/all-comment', CommentController.allComment)

router.delete('/comment/:id', CommentController.deleteComment)



module.exports = router;