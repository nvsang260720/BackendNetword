const express = require('express');
const router = express.Router();

const UserControler = require('../../controller/Backend/BackendUserController')

router.get('/', UserControler.getHome)

module.exports = router;