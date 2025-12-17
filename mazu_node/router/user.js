const express = require('express')
const userHandle = require('../router_handle/user')
const router = express.Router()

router.post('/wxGetOpenId', userHandle.wxGetOpenId)
router.post('/wxLogin', userHandle.wxLogin)
router.post('/editNickname', userHandle.editNickname)
router.post('/editUserHeaders', userHandle.editUserHeaders)
router.post('/userVisitCount', userHandle.userVisitCount)
router.post('/visitCount', userHandle.visitCount)
router.post('/checkBalanceZero', userHandle.checkBalanceZero)
router.post('/addBalance', userHandle.addBalance)
router.post('/signIn', userHandle.signIn)
router.post('/getContinuousSignInDays', userHandle.getContinuousSignInDays)
const userController = require('../router_handle/wxuser')

// 头像上传
router.post('/upload-avatar', userController.uploadUserAvatar)
// 增删改查
router.get('/list', userController.getUserList)
router.get('/:id', userController.getUserById)
router.get('/openid/:openid', userController.getUserByOpenid)
router.post('/', userController.addUser)
router.put('/:id', userController.updateUser)
router.delete('/:id', userController.deleteUser)

module.exports = router
module.exports = router