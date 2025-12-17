const express = require('express')
const praysHandle = require('../router_handle/prays')
const router = express.Router()

router.get('/getRandomPrays', praysHandle.getRandomPrays)
// 祈福增删改查
router.get('/getAllPrays', praysHandle.getAllPrays) // 获取全部祈福数据（使用分页）
router.post('/uploadPraysImage', praysHandle.uploadPraysImage)
router.post('/addPraysData', praysHandle.addPraysData)
router.post('/updatePraysData', praysHandle.updatePraysData)
router.post('/deletePraysData', praysHandle.deletePraysData)

module.exports = router