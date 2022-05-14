const express = require('express');
const router = express.Router();
const ProductController = require('../../controller/Backend/ProductsController')
const CategoryController = require('../../controller/Backend/CategoryController')
const AuthController = require('../../controller/Backend/AuthController')
const UserController = require('../../controller/Backend/UserController')

const uploads = require('../../middleware/uploadImages')

router.get('/', UserController.getHome)

router.get('/login', AuthController.getLogin)

router.post('/login', AuthController.postLogin)

router.get('/user', UserController.getUser)

router.post('/user/:id',UserController.deleteUser)

router.get('/user/view-profile/:id', UserController.getProfile)

router.get('/update-user/:id', UserController.getUpdateUser)

router.post('/update-user/:id' ,uploads.single('uploaded_avata'), UserController.postUpdateUser)

router.get('/get-category', CategoryController.getCategory);

router.get('/get-product', ProductController.getProducts)

router.get('/add-product',ProductController.getAddProducts)

router.post('/add-product',ProductController.addProducts)

router.get('/edit-product/:id',ProductController.getEditProducts)

router.post('/edit-product/',ProductController.postEditProducts)



module.exports = router;