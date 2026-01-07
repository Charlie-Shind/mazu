const domain = 'https://duoxie.cc.cd/mazu/node';
// const domain = 'https://111.230.37.198';
// 正确拼接base_url（区分环境端口）
export const base_url = `${domain}${wx.getSystemInfoSync().platform === 'devtools' ? '' : ''}`;
export const ai_base_url = 'http://47.95.210.123:8080';
const timeout = 50000;

const aiWhiteList = ['/user/user/chat', '/user/image/generateimg', '/user/image/mazuCarousel'];

function isAiWhiteList(url) {
	return aiWhiteList.includes(url);
}

export default (params) => {
	let url = params.url;
	let method = (params.method || "get").toLowerCase();
	let data = params.data || {};

	// 修复：使用拼接好的base_url，而非原始domain
	const finalBaseUrl = isAiWhiteList(url) ? ai_base_url : base_url;

	const token = uni.getStorageSync('token');
	// 初始化请求头：先保留外部传入的头，再设置默认头（外部头优先）
	let header = {
		'Content-Type': 'application/json;charset=UTF-8',
		'Tenant-Id': uni.getStorageSync('tenantId') || 'xxx',
		...params.header // 外部传入的头优先
	};

	// 非AI白名单接口：添加Token头（保留原有认证逻辑）
	console.log('是否为非AI接口：', !isAiWhiteList(url));
	console.log('获取到的token：', token); // 打印token，确认是否真的存在
	if (!isAiWhiteList(url) && token) { // 增加token存在判断，避免传入空字符串
		header['Blade-Auth'] = token;
		header['Authorization'] = token;
	}

	// 修复：POST请求不覆盖整个header，只补充Content-Type（避免Token头丢失）
	if (method === "post" && !isAiWhiteList(url)) {
		// 只设置Content-Type，不覆盖原有header（用赋值而非重新定义）
		header['Content-Type'] = 'application/json';
	}

	// 调试：打印关键信息，方便排查
	console.log('===== 请求调试信息 =====');
	console.log('请求地址:', finalBaseUrl + url);
	console.log('是否为AI接口:', isAiWhiteList(url));
	console.log('是否免Token:', isAiWhiteList(url));
	console.log('最终请求头:', header); // 打印最终请求头，确认Token是否存在

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