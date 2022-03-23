const express = require('express');
const router = express.Router();

const BannerController = require('../../controller/api/BannerController')
const SearchController = require('../../controller/Api/SearchController')

router.post('/add-banner', BannerController.addBanner)

router.get('/get-banner', BannerController.getBanner)

router.post('/search-key', SearchController.postKey)



module.exports = router;