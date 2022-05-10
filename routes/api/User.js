const express = require('express');
const router = express.Router();

const CartController = require('../../controller/Api/CartController')
const UserController = require('../../controller/Api/UserController')

router.get('/profile/:id', UserController.getProfile)

router.post('/profile/:id', UserController.setProfile)

router.post('/add-to-cart', CartController.addCart)

router.delete('/delete/:id', CartController.deleteCart)

router.get('/get-cart', CartController.getCart)


module.exports = router;