const express = require('express');
const router = express.Router();

const UserController = require('../../controller/Backend/BackendUserController')

router.get('/', UserController.getHome)

module.exports = router;