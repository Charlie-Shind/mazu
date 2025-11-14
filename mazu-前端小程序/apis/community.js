import request from "../utils/request";

// 获取话题
export const getCommunityTopicAPI = () => {
	return request({
		url: "/community/getCommunityTopic",
		method: "GET"
	})
}

// 获取帖子
export const getCommunityItemAPI = () => {
	return request({
		url: "/community/getCommunityItem",
		method: "GET"
	})
}

// 获取帖子详情
export const getCommunityItemInfoAPI = ({
	id
}) => {
	return request({
		url: "/community/getCommunityItemInfo",
		method: "POST",
		data: {
			id
		}
	})
}

// 获取话题页面内容
export const getTopicInfoAPI = ({
	id
}) => {
	return request({
		url: "/community/getTopicInfo",
		method: "POST",
		data: {
			id
		}
	})
}

// 获取评论
export const getCommentAPI = ({
	id
}) => {
	return request({
		url: "/community/getComments",
		method: "POST",
		data: {
			id
		}
	})
}

// 搜索帖子
export const searchCommunityAPI = ({
	content
}) => {
	return request({
		url: "/community/searchCommunity",
		method: "POST",
		data: {
			content
		}
	})
}

// 发布帖子
export const uploadCommunityAPI = ({
	title,
	content,
	imageUrl,
	grid_id,
	user_id
}) => {
	return request({
		url: "/community/uploadCommunity",
		method: "POST",
		data: {
			title,
			content,
			imageUrl,
			grid_id,
			user_id
		}
	})
}

// 通过id数组获取帖子（游览历史）
export const byIdGetCommunityAPI = (ids) => {
	return request({
		url: "/community/byIdGetCommunity",
		method: "POST",
		data: {
			ids
		}
	})
}

// 新增评论
export const addCommentsAPI = ({
	post_id,
	user_id,
	reply_content,
	superior_id,
	comment_id,
	mainId
}) => {
	return request({
		url: "/community/addComments",
		method: "POST",
		data: {
			post_id,
			user_id,
			reply_content,
			superior_id,
			comment_id,
			mainId
		}
	})
}

// 查询帖子是否为我发布的接口
export const checkMyPostCommunityAPI = ({
	user_id,
	id
}) => {
	return request({
		url: "/community/checkMyPostCommunity",
		method: "POST",
		data: {
			user_id,
			id
		}
	})
}

// 获取我发布的帖子
export const getMyPostCommunityAPI = ({
	user_id
}) => {
	return request({
		url: "/community/getMyPostCommunity",
		method: "POST",
		data: {
			user_id
		}
	})
}

// 删除帖子
export const deletePostCommunityAPI = ({
	user_id,
	id
}) => {
	return request({
		url: "/community/deletePostCommunity",
		method: "POST",
		data: {
			user_id,
			id
		}
	})
}