const express = require('express')
const shopHandle = require('../router_handle/shop')
const newShopHandle = require('../router_handle/shopGoods')
const router = express.Router()

router.get('/getShopList', shopHandle.getShopList)
router.get('/getShopGrid', shopHandle.getShopGrid)
router.post('/gridSearchShop', shopHandle.gridSearchShop)
router.post('/getShopDetail', shopHandle.getShopDetail)
router.post('/getAddress', shopHandle.getAddress)
router.post('/getDefaultAddress', shopHandle.getDefaultAddress)
router.post('/addAddress', shopHandle.addAddress)
router.post('/editAddress', shopHandle.editAddress)
router.post('/delAddress', shopHandle.delAddress)
router.post('/getIdAddress', shopHandle.getIdAddress)
router.post('/createOrder', shopHandle.createOrder)
router.post('/shopPayMoney', shopHandle.shopPayMoney)
router.post('/getShopOrder', shopHandle.getShopOrder)
router.post('/collectGoods', shopHandle.collectGoods)
router.post('/judgeCollect', shopHandle.judgeCollect)
router.post('/deleteShopOrder', shopHandle.deleteShopOrder)
router.post('/getOrderInfo', shopHandle.getOrderInfo)
router.post('/editOrder', shopHandle.editOrder)

// 商品列表
router.get('/', newShopHandle.getShopList); // 分页+搜索商品列表
router.get('/grid', newShopHandle.getShopGrid); // 获取分类
router.post('/upload-imgs', newShopHandle.uploadShopImages); // 多图上传
router.post('/', newShopHandle.addShop); // 新增商品
router.put('/:id', newShopHandle.updateShop); // 修改商品（路径参数ID）
router.delete('/:id', newShopHandle.deleteShop); // 删除商品
router.post('/delete-image', newShopHandle.deleteImage); // 单独删除图片
router.get('/orderDetail/:id', newShopHandle.getOrderDetail);
router.get('/order/export', newShopHandle.exportOrderList);
module.exports = router