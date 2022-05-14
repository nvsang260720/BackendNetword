const express = require('express');
const router = express.Router();
const AuthController = require('../../controller/Backend/AuthController')
const UserController = require('../../controller/Backend/UserController')

router.get('/', UserController.getHome)

router.get('/login', AuthController.getLogin)

router.post('/login', AuthController.postLogin)


module.exports = router;