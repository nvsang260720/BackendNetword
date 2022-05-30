const express = require('express');
const router = express.Router();

const UserController = require('../../controller/Backend/UserBackend')

router.get('/', UserController.getHome)

module.exports = router;