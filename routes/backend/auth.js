const express = require('express');
const router = express.Router();
const AuthController = require('../../controller/Backend/AuthBackend')

router.get('/login', AuthController.getLogin)

router.post('/login', AuthController.postLogin)


module.exports = router;