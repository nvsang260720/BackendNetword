const express = require('express');
const router = express.Router();

const UserController = require('../../controller/Backend/UserBackend')

router.get('/', function(req, res)  {
    res.send('Not page')
})

module.exports = router;