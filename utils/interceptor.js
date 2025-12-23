const whiteList = [
	'/secondPages/news/news',
	'/secondPages/faith/faith',
	'/secondPages/cultureCreativity/cultureCreativity',
	'/secondPages/fuCulture/fuCulture',
	'/secondPages/mazuCulture/mazuCulture',
	'/secondPages/palaceTemple/palaceTemple',
	'/secondPages/publication/publication',
	'/secondPages/tourism/tourism',
	'/secondPages/gridDetail/gridDetail',
	'/secondPages/communityDetail/communityDetail',
	'/secondPages/topicDetail/topicDetail',
	'/secondPages/search/search',
	'/secondPages/shopDetail/shopDetail',
	'/secondPages/contact/contact',
	// 开发所需
	// '/secondPages/commitOrder/commitOrder',
	// '/secondPages/setAddress/setAddress',
	// '/secondPages/addAddress/addAddress',
	'/secondPages/praysDetail/praysDetail'
];

let navigateToCount = 0;

function hasPermission(url) {
	// 从本地存储中获取登录状态  
	const isLoggedIn = uni.getStorageSync('isLoggedIn');

	// 仅获取 URL 的路径部分（去掉参数）  
	const urlPath = url.split('?')[0];

	// 如果 URL 在白名单中或用户已登录, 则允许访问  
	return whiteList.includes(urlPath) || isLoggedIn;
}

uni.addInterceptor('navigateTo', {
	invoke(e) {
		if (!hasPermission(e.url)) {
			// 递增 navigateToCount  
			navigateToCount++;

			// 如果计数小于 2, 导航登录页面  
			if (navigateToCount < 2) {
				uni.navigateTo({
					url: '/pages/login/login'
				});
				return false;
			} else {
				// 重置计数  
				navigateToCount = 0;
				return true;
			}
		}
		return true;
	},
	success(e) {
		// 处理导航成功的情况  
	}
});