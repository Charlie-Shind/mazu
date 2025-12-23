// const domain = 'https://duoxie.cc.cd/mazu';
const domain = 'https://111.230.37.198';
export const base_url = `${domain}:${wx.getSystemInfoSync().platform === 'devtools' ? 8899 : 6869}`;
export const ai_base_url = 'http://127.0.0.1:8080';
const timeout = 50000;

const aiWhiteList = ['/user/user/chat', '/user/image/generateimg', '/user/image/mazuCarousel'];

function isAiWhiteList(url) {
	return aiWhiteList.includes(url);
}

export default (params) => {
	let url = params.url;
	let method = (params.method || "get").toLowerCase();
	let data = params.data || {};

	// 核心修改：强制AI白名单接口走ai_base_url，无视useAiUrl参数
	const finalBaseUrl = isAiWhiteList(url) ? ai_base_url : domain;

	const token = uni.getStorageSync('token');
	let header = {
		'Content-Type': 'application/json;charset=UTF-8',
		'Tenant-Id': uni.getStorageSync('tenantId') || 'xxx',
		...params.header // 外部传入的头优先
	};

	// 非AI白名单接口：添加Token头（保留原有认证逻辑）
	if (!isAiWhiteList(url)) {
		header['Blade-Auth'] = token || '';
		header['Authorization'] = token || '';
	}

	// ========== 修复：POST请求头不覆盖AI接口的自定义头 ==========
	if (method === "post" && !isAiWhiteList(url)) { // AI接口的POST不覆盖头
		header = {
			'Content-Type': 'application/json'
		};
	}

	// 调试：打印关键信息，方便排查
	console.log('===== 请求调试信息 =====');
	console.log('请求地址:', finalBaseUrl + url); // 验证是否为127.0.0.1:8080
	console.log('是否为AI接口:', isAiWhiteList(url)); // 验证是否命中白名单
	console.log('是否免Token:', isAiWhiteList(url));
	console.log('请求头:', header);

	return new Promise((resolve, reject) => {
		// 移除：uni.showLoading 加载框
		uni.request({
			url: finalBaseUrl + url,
			method: method,
			header: header,
			data: data,
			timeout,
			success(response) {
				if (response.statusCode == 200) {
					resolve(response.data);
				} else {
					// 优化：AI接口401不弹登录提示（免Token接口无需登录）
					if (response.statusCode === 401 && isAiWhiteList(url)) {
						uni.showToast({
							title: 'AI接口请求失败，无需登录',
							icon: 'none',
							duration: 2000
						});
					} else {
						switch (response.statusCode) {
							case 401:
								uni.showModal({
									title: "提示",
									content: "请登录",
									showCancel: false
								});
								break;
							case 404:
								uni.showToast({
									title: '请求地址不存在...',
									duration: 2000
								});
								break;
							default:
								uni.showToast({
									title: `请求错误：${response.statusCode}`,
									icon: 'none',
									duration: 2000
								});
								break;
						}
					}
					reject(response);
				}
			},
			fail(err) {
				console.error('请求失败详情:', err);
				// 修复：小程序error图标兼容问题，统一用none
				if (err.errMsg.indexOf('request:fail') !== -1) {
					uni.showToast({
						title: '网络异常，请检查连接',
						icon: "none",
						duration: 2000
					});
				} else if (err.errMsg.includes('timeout')) {
					uni.showToast({
						title: '请求超时，请稍后重试',
						icon: "none",
						duration: 2000
					});
				} else {
					uni.showToast({
						title: '未知异常',
						icon: "none",
						duration: 2000
					});
				}
				reject(err);
			},
			complete() {
				// 移除：uni.hideLoading 加载框关闭
			}
		});
	}).catch(() => {
		// 移除：catch中的uni.hideLoading
	});
};