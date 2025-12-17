const express = require('express')
const communityHandle = require('../router_handle/community')
const router = express.Router()

router.get('/getCommunityItem', communityHandle.getCommunityItem)
router.get('/getCommunityTopic', communityHandle.getCommunityTopic)
router.post('/getCommunityItemInfo', communityHandle.getCommunityItemInfo)
router.post('/getTopicInfo', communityHandle.getTopicInfo)
router.post('/getComments', communityHandle.getComments)
router.post('/searchCommunity', communityHandle.searchCommunity)
router.post('/uploadCommunityImage', communityHandle.uploadCommunityImage)
router.post('/uploadCommunity', communityHandle.uploadCommunity)
router.post('/byIdGetCommunity', communityHandle.byIdGetCommunity)
router.post('/addComments', communityHandle.addComments)
router.post('/getMyPostCommunity', communityHandle.getMyPostCommunity)
router.post('/deletePostCommunity', communityHandle.deletePostCommunity)
router.post('/checkMyPostCommunity', communityHandle.checkMyPostCommunity)


// 后端社区话题
router.get('/getList', communityHandle.getCommunityList);
router.post('/uploadCover', communityHandle.uploadCommunityCover);
router.post('/add', communityHandle.addCommunity);
router.put('/update', communityHandle.updateCommunity);
router.delete('/delete', communityHandle.deleteCommunity);
// 帖子管理
const { handleSingleUpload, handleMultipleUpload } = require('../public/middleware/upload.js');
const authMiddleware = require('../public/middleware/auth.js');
// ---------- 社区帖子（community_post）路由 ----------
router.get('/list', communityHandle.getCommunityPostList); // 分页查询用GET
router.post('/detail', communityHandle.getCommunityPostDetail);
router.post('/uploadImages', handleMultipleUpload, communityHandle.uploadPostImages);
router.post('/addPost', authMiddleware, communityHandle.addCommunityPost);
router.post('/updatePost', authMiddleware, communityHandle.updateCommunityPost);
router.post('/deletePost', authMiddleware, communityHandle.deleteCommunityPost);
module.exports = router