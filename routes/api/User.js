const express = require('express');
const router = express.Router();

const CartController = require('../../controller/Api/CartController')
const UserController = require('../../controller/Api/UserController')
const uploads = require('../../middleware/uploadImages')


router.get('/profile/:id', UserController.getProfile)

router.post('/profile/:id', UserController.setProfile)

router.patch('/upload-avatar/:id', uploads.single("upload_avatar"), UserController.uploadAvatar)

router.post('/add-to-cart', CartController.addCart)

router.delete('/delete/:id', CartController.deleteCart)

router.get('/get-cart', CartController.getCart)


module.exports = router;