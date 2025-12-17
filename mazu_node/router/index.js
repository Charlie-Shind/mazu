const express = require('express')
const indexHandle = require('../router_handle/index')
const router = express.Router()

router.get('/getCarousel', indexHandle.getCarousel)
router.get('/getCreativity', indexHandle.getCreativity)
router.get('/getRecommend', indexHandle.getRecommend)
router.get('/getindexGridNews', indexHandle.getindexGridNews)
router.get('/getindexGridFuCulture', indexHandle.getindexGridFuCulture)
router.get('/getindexGridFaith', indexHandle.getindexGridFaith)
router.get('/getindexGridMazuCulture', indexHandle.getindexGridMazuCulture)
router.get('/getindexGridPalaceTemple', indexHandle.getindexGridPalaceTemple)
router.get('/getindexGridPublication', indexHandle.getindexGridPublication)
router.get('/getindexGridCultureCreativity', indexHandle.getindexGridCultureCreativity)
router.get('/getindexGridTourism', indexHandle.getindexGridTourism)
router.post('/getindexNewsItem', indexHandle.getindexNewsItem)
router.post('/getindexFuCultureItem', indexHandle.getindexFuCultureItem)
router.post('/getindexFaithItem', indexHandle.getindexFaithItem)
router.post('/getindexMazuCultureItem', indexHandle.getindexMazuCultureItem)
router.post('/getindexPalaceTempleItem', indexHandle.getindexPalaceTempleItem)
router.post('/getindexPublicationItem', indexHandle.getindexPublicationItem)
router.post('/getindexCultureCreativityItem', indexHandle.getindexCultureCreativityItem)
router.post('/getindexTourismItem', indexHandle.getindexTourismItem)

// 删除图片
router.post('/deleteImg', indexHandle.deleteImage)

module.exports = router