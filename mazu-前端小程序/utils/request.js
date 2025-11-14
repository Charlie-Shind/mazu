// export const base_url = 'http://113.45.142.234:8889'
// export const base_url = 'http://139.159.229.212:8889'
// export const base_url = 'http://47.122.115.28:8889'

const domain = 'http://47.122.115.28';
export const base_url = `${domain}:${wx.getSystemInfoSync().platform === 'devtools' ? 8889 : 6869}`;
// export const base_url = 'https://www.biyesheji.icu'

// 本地
// export const base_url = 'http://127.0.0.1:8889'
const timeout = 5000

export default (params) => {
	let url = params.url;
	let method = params.method || "get";
	let data = params.data || {};
	const token = uni.getStorageSync('token');
	let header = {
		'Blade-Auth': uni.getStorageSync('token') || '',
		'Content-Type': 'application/json;charset=UTF-8',
		'Authorization': token,
		'Tenant-Id': uni.getStorageSync('tenantId') || 'xxx',
		...params.header
	}
	if (method == "post") {
		header = {
			'Content-Type': 'application/json'
		};
	}
	return new Promise((resolve, reject) => {
		// 显示 loading 动画  
		uni.showLoading({
			title: '加载中...',
			mask: true
		});
		uni.request({
			url: base_url + url,
			method: method,
			header: header,
			data: data,
			timeout,
			success(response) {
				const res = response
				if (res.statusCode == 200) {
					resolve(res.data);
				} else {
					switch (res.statusCode) {
						case 401:
							// 处理未登录的情况  
							uni.showModal({
								title: "提示",
								content: "请登录",
								showCancel: false,
								// 这里可以添加跳转到登录页面的逻辑  
							});
							break;
						case 404:
							uni.showToast({
								title: '请求地址不存在...',
								duration: 2000,
							})
							break;
						default:
							uni.showToast({
								title: '请重试...',
								duration: 2000,
							})
							break;
					}
					reject(res);
				}
			},
			fail(err) {
				console.log('错误' + err)
				if (err.errMsg.indexOf('request:fail') !== -1) {
					uni.showToast({
						title: '网络异常',
						icon: "error",
						duration: 2000
					})
				} else {
					uni.showToast({
						title: '未知异常',
						duration: 2000
					})
				}
				reject(err);
			},
			// 请求结束时隐藏 loading 动画  
			complete() {
				uni.hideLoading();
			}
		});
	}).catch(() => {
		// 隐藏 loading 动画  
		uni.hideLoading();
	});
};