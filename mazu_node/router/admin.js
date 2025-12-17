const express = require('express')
const userHandle = require('../router_handle/user')
const indexHandle = require('../router_handle/index')
const shopHandle = require('../router_handle/shop')
const praysHandle = require('../router_handle/prays') // 祈福相关
const adminHandle = require('../router_handle/admin')
const todoHandle = require('../router_handle/todo')

const router = express.Router()

// 登录接口
router.post('/adminLogin', userHandle.adminLogin)
// 获取用户信息
router.post('/adminGetUserInfo', userHandle.adminGetUserInfo)
// 上传index图片
router.post('/indexUploadImage', indexHandle.indexUploadImage)
// 删除index图片
router.post('/deleteImage', indexHandle.deleteImage)
// 修改接口editIndexContent
router.post('/editIndexContent', indexHandle.editIndexContent)
// 新增接口insertIndexContent
router.post('/insertIndexContent', indexHandle.insertIndexContent)
// 删除接口deleteIndexContent
router.post('/deleteIndexContent', indexHandle.deleteIndexContent)
// 获取订单
router.post('/shopOrderAdmin', shopHandle.shopOrderAdmin)
// 搜索订单
router.post('/selectOrderId', shopHandle.selectOrderId)
// 订单详情orderInfo
router.post('/orderInfo', shopHandle.orderInfo)
// 获取今日订单数量
router.get('/getTodayOrderCount', indexHandle.getTodayOrderCount)
// 获取今日访问数量
router.get('/getTodayVisitCount', indexHandle.getTodayVisitCount)
// 获取今日销售额
router.get('/getTodaySales', indexHandle.getTodaySales)
// 获取昨日销售额
router.get('/getSubSales', indexHandle.getSubSales)
// 获取本周销售额 echarts数据
router.get('/getThisWeekSales', indexHandle.getThisWeekSales)
// 获取上周销售额 echarts数据
router.get('/getLastWeekSales', indexHandle.getLastWeekSales)

// 查询所有admin
router.get('/list', adminHandle.getAdminList)
// 根据ID查询单个admin
router.get('/:id', adminHandle.getAdminById)
// 新增admin
router.post('/', adminHandle.addAdmin)

// 添加头像
router.post('/uploadAvatar', adminHandle.uploadAdminImage);
// 修改admin
router.put('/:id', adminHandle.updateAdmin)
// 删除admin
router.delete('/:id', adminHandle.deleteAdmin)


// 关于todo


module.exports = router