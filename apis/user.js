import request from "../utils/request";

// 获取微信openid
export const getOpenIdAPI = (code) => {
	return request(({
		url: '/user/wxGetOpenId',
		method: 'POST',
		data: {
			code
		}
	}))
}

// 根据id判断 注册or登录
export const wxLoginAPI = ({
	openid,
	nickname,
	avatarurl,
	gender
}) => {
	return request({
		url: "/user/wxLogin",
		method: 'POST',
		data: {
			openid,
			nickname,
			avatarurl,
			gender
		}
	})
}

// 修改昵称
export const editNicknameAPI = ({
	name,
	id
}) => {
	return request({
		url: "/user/editNickname",
		method: 'POST',
		data: {
			name,
			id
		}
	})
}

// 修改头像
export const editUserHeaders = (data) => {
	return uni.uploadFile({
		url: '/user/editUserHeaders',
		filePath: data.filePath,
		name: 'img',
		formData: {
			id: data.id
		},
		header: {
			'content-type': 'multipart/form-data',
			'Authorization': uni.getStorageSync('token')
		}
	})
}

// 统计用户访问量
export const userVisitCountAPI = (userId) => {
	return request({
		url: "/user/userVisitCount",
		method: "POST",
		data: {
			userId
		}
	})
}

// 查询用户余额
export const checkBalanceZeroAPI = (openid) => {
	return request({
		url: "/user/checkBalanceZero",
		method: "POST",
		data: {
			openid
		}
	})
}

// 增加余额
export const addBalanceAPI = (openid) => {
	return request({
		url: "/user/addBalance",
		method: "POST",
		data: {
			openid
		}
	})
}

// 签到
export const signInAPI = (openid) => {
	return request({
		url: "/user/signIn",
		method: "POST",
		data: {
			openid
		}
	})
}

// 获取该用户签到天数
export const getContinuousSignInDaysAPI = (openid) => {
	return request({
		url: "/user/getContinuousSignInDays",
		method: "POST",
		data: {
			openid
		}
	})
}

// 模拟微信支付供奉香火，成功后累积香火值
export const incensePayAPI = ({
	user_id,
	amount,
	pay_method = 'wechat'
}) => {
	return request({
		url: "/user/incensePay",
		method: "POST",
		data: {
			user_id,
			amount,
			pay_method
		}
	})
}

// 统计访问量（不仅限于用户）
export const visitCountAPI = () => {
	return request({
		url: "/user/visitCount",
		method: "POST"
	})
}