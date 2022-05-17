const express = require('express');
const router = express.Router();
const UserController = require('../../controller/Backend/UserController')

const uploads = require('../../middleware/uploadImages')

router.get('/', UserController.getUser)

router.get('/view-profile/:id', UserController.getProfile)

router.get('/update-user/:id', UserController.getUpdateUser)

router.post('/delete-user/:id',UserController.deleteUser)

router.patch('/upload-avatar/:id' ,uploads.single('uploaded_avata'), UserController.postUpdateUser)

router.patch('/upload-cover/:id' ,uploads.single('uploaded_cover'), UserController.postUpdateUser)


module.exports = router;