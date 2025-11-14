import request from "../utils/request";

// 获取主页轮播图
export const getCarouselAPI = () => {
	return request({
		url: "/index/getCarousel",
		method: "GET"
	})
}

// 获取主页动态
export const getNewsAPI = () => {
	return request({
		url: "/index/getNews",
		method: "GET"
	})
}

// 获取主页文创作品
export const getCreativityAPI = () => {
	return request({
		url: "/index/getCreativity",
		method: "GET"
	})
}

// 获取主页推荐
export const getRecommendAPI = () => {
	return request({
		url: "/index/getRecommend",
		method: "GET"
	})
}

// 获取新闻
export const getindexGridNewsAPI = () => {
	return request({
		url: "/index/getindexGridNews",
		method: "GET"
	})
}

// 获取福文化
export const getindexGridFuCultureAPI = () => {
	return request({
		url: "/index/getindexGridFuCulture",
		method: "GET"
	})
}

// 获取信俗活动
export const getindexGridFaithAPI = () => {
	return request({
		url: "/index/getindexGridFaith",
		method: "GET"
	})
}

// 获取妈祖文化
export const getindexGridMazuCultureAPI = () => {
	return request({
		url: "/index/getindexGridMazuCulture",
		method: "GET"
	})
}

// 获取天下宫庙
export const getindexGridPalaceTempleAPI = () => {
	return request({
		url: "/index/getindexGridPalaceTemple",
		method: "GET"
	})
}

// 获取数字出版
export const getindexGridPublicationAPI = () => {
	return request({
		url: "/index/getindexGridPublication",
		method: "GET"
	})
}

// 获取妈祖文创
export const getindexGridCultureCreativityAPI = () => {
	return request({
		url: "/index/getindexGridCultureCreativity",
		method: "GET"
	})
}

// 获取两岸旅游
export const getindexGridTourismAPI = () => {
	return request({
		url: "/index/getindexGridTourism",
		method: "GET"
	})
}

// ===================== 以下是获取grid宫格内详情页面的接口 ===================== //

export const getindexNewsItemAPI = ({
	id
}) => {
	return request({
		url: "/index/getindexNewsItem",
		method: "POST",
		data: {
			id
		}
	})
}

export const getindexFuCultureItemAPI = ({
	id
}) => {
	return request({
		url: "/index/getindexFuCultureItem",
		method: "POST",
		data: {
			id
		}
	})
}

export const getindexFaithItemAPI = ({
	id
}) => {
	return request({
		url: "/index/getindexFaithItem",
		method: "POST",
		data: {
			id
		}
	})
}

export const getindexMazuCultureItemAPI = ({
	id
}) => {
	return request({
		url: "/index/getindexMazuCultureItem",
		method: "POST",
		data: {
			id
		}
	})
}

export const getindexPalaceTempleItemAPI = ({
	id
}) => {
	return request({
		url: "/index/getindexPalaceTempleItem",
		method: "POST",
		data: {
			id
		}
	})
}

export const getindexPublicationItemAPI = ({
	id
}) => {
	return request({
		url: "/index/getindexPublicationItem",
		method: "POST",
		data: {
			id
		}
	})
}

export const getindexCultureCreativityItemAPI = ({
	id
}) => {
	return request({
		url: "/index/getindexCultureCreativityItem",
		method: "POST",
		data: {
			id
		}
	})
}

export const getindexTourismItemAPI = ({
	id
}) => {
	return request({
		url: "/index/getindexTourismItem",
		method: "POST",
		data: {
			id
		}
	})
}
// ===================== ============================== ===================== //