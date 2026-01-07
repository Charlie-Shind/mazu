<template>
	<view class="certificate-page">
		<!-- 页面返回头部组件 -->
		<pageBack :titleInfo="titleInfo"></pageBack>

		<view class="content">
			<view class="container">
				<!-- 未登录状态 -->
				<view class="empty-state" v-if="!userInfo || !userInfo.id">
					<text class="empty-icon"></text>
					<text class="empty-text">请先登录查看证书</text>
					<view class="login-btn" @click="toLogin">立即登录</view>
				</view>

				<!-- 已登录但未获得证书 -->
				<view class="empty-state" v-else-if="!hasCertificate">
					<text class="empty-icon"></text>
					<text class="empty-text">暂未获得证书</text>
					<text class="empty-desc">累计捐献爱心值达到 5000 点即可获得证书</text>
					<view class="progress-box">
						<view class="progress-label">
							<text>当前进度：{{ userInfo.balance || 0 }} / 5000</text>
							<text class="progress-percent">{{ progressPercent }}%</text>
						</view>
						<view class="progress-bar">
							<view class="progress-fill" :style="{ width: progressPercent + '%' }"></view>
						</view>
					</view>
					<view class="goto-btn" @click="goToIncense">前往捐献香火</view>
				</view>

				<!-- 已获得证书 -->
				<view class="certificate-container" v-else>
					<!-- 证书卡片 - 增加ref标识 -->
					<view class="certificate-card" ref="certificateRef" id="certificateDom">
						<!-- 左侧装饰花纹 -->
						<view class="decoration-left">
							<view class="decoration-line"></view>
							<view class="decoration-circle"></view>
							<view class="decoration-line"></view>
						</view>
						
						<!-- 右侧装饰花纹 -->
						<view class="decoration-right">
							<view class="decoration-line"></view>
							<view class="decoration-circle"></view>
							<view class="decoration-line"></view>
						</view>
						
						<!-- 证书标题区域 -->
						<view class="certificate-header">
							<view class="header-icon">✨</view>
							<text class="certificate-title">功德证书</text>
							<text class="certificate-subtitle">Certificate of Merit</text>
							<view class="header-divider"></view>
						</view>
						
						<!-- 证书内容区域 -->
						<view class="certificate-body">
							<view class="certificate-content">
								<view class="name-wrapper">
									<text class="name-label">功德主</text>
									<text class="certificate-name">{{ userInfo.nickname || '善信' }}</text>
								</view>
								
								<view class="merit-wrapper">
									<text class="merit-text">虔诚供奉，功德无量</text>
									<text class="merit-desc">心诚则灵，善念成真</text>
								</view>
								
								<view class="info-wrapper">
									<view class="info-item">
										<text class="info-label">累计爱心值</text>
										<text class="info-value">{{ totalIncense || userInfo.balance }} 点</text>
									</view>
									<view class="info-item">
										<text class="info-label">获得日期</text>
										<text class="info-value">{{ certificateDate }}</text>
									</view>
								</view>
							</view>
							
							<!-- 印章 -->
							<view class="certificate-seal">
								<view class="seal-circle">
									<text class="seal-text">功德</text>
									<text class="seal-text">圆满</text>
								</view>
							</view>
						</view>
						
						<!-- 证书底部 -->
						<view class="certificate-footer">
							<view class="footer-divider"></view>
							<text class="certificate-org">妈祖文化传承</text>
							<text class="certificate-org-en">Mazu Cultural Heritage</text>
						</view>
					</view>
					
					<!-- 操作按钮 -->
					<view class="certificate-actions">
						<view class="action-btn share-btn" @click="shareCertificate">
							<text>分享证书</text>
						</view>
						<view class="action-btn save-btn" @click="saveCertificate">
							<text>保存图片</text>
						</view>
					</view>
					
					<!-- 隐藏的画布 - 用于生成证书图片 -->
					<canvas 
						canvas-id="certificateCanvas" 
						ref="certCanvas"
						style="position: fixed; top: -9999rpx; left: -9999rpx; width: 680px; height: 800px;"
					></canvas>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	// 引入返回头部组件
	import pageBack from '/components/title/title.vue';
	import { useUserInfoStore } from "@/store/userInfo.js";

	export default {
		name: 'MyCertificatePage',
		components: {
			pageBack
		},
		data() {
			return {
				// 头部标题配置
				titleInfo: {
					titleShow: true,
					title: '我的证书',
					imageUrl: 'http://t73sifiwt.hn-bkt.clouddn.com/pageBack/3.webp',
					heightShow: false,
					backShow: true
				},
				userInfo: {},
				totalIncense: 0, // 总爱心值（用于证书显示）
				certificateDate: '', // 获得证书日期
				certificateImage: '' // 证书图片临时路径
			};
		},
		computed: {
			// 是否已获得证书（爱心值 >= 5000）
			hasCertificate() {
				return this.userInfo && this.userInfo.balance >= 5000;
			},
			// 进度百分比
			progressPercent() {
				if (!this.userInfo || !this.userInfo.balance) return 0;
				const percent = (this.userInfo.balance / 5000) * 100;
				return percent > 100 ? 100 : Math.round(percent);
			}
		},
		onLoad() {
			this.loadUserInfo();
		},
		onShow() {
			// 每次显示页面时重新加载用户信息（可能爱心值有更新）
			this.loadUserInfo();
		},
		// 小程序分享钩子
		onShareAppMessage() {
			return {
				title: `我的妈祖功德证书`,
				path: '/pages/certificate/certificate',
				imageUrl: this.certificateImage || ''
			};
		},
		// 朋友圈分享钩子
		onShareTimeline() {
			return {
				title: `我的妈祖功德证书，累计捐献${this.userInfo.balance || 0}点爱心值！`,
				imageUrl: this.certificateImage || ''
			};
		},
		methods: {
			/**
			 * 加载用户信息
			 */
			loadUserInfo() {
				const store = useUserInfoStore();
				this.userInfo = store.$state.userInfo || {};
				
				// 如果已获得证书，记录证书信息
				if (this.hasCertificate) {
					this.totalIncense = this.userInfo.balance || 0;
					// 获取证书日期（如果已保存则读取，否则使用当前日期）
					const savedDate = uni.getStorageSync('certificate_date');
					if (savedDate) {
						this.certificateDate = savedDate;
					} else {
						// 首次达到5000时保存日期
						const now = new Date();
						this.certificateDate = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`;
						uni.setStorageSync('certificate_date', this.certificateDate);
					}
				}
			},
			/**
			 * 前往登录
			 */
			toLogin() {
				uni.navigateTo({
					url: "/pages/login/login"
				});
			},
			/**
			 * 前往捐献香火页面
			 */
			goToIncense() {
				uni.navigateTo({
					url: "/secondPages/incense/incense"
				});
			},
			/**
			 * 小程序专用：将证书节点生成图片（核心修复）
			 */
			async convertCertificateToImage() {
				return new Promise((resolve, reject) => {
					uni.showLoading({
						title: '生成证书中...'
					});

					// 1. 使用小程序选择器获取证书节点信息
					const query = uni.createSelectorQuery().in(this);
					query.select('#certificateDom').boundingClientRect(rect => {
						if (!rect) {
							uni.hideLoading();
							uni.showToast({
								title: '证书节点未找到',
								icon: 'none'
							});
							reject('证书节点未找到');
							return;
						}

						// 2. 使用小程序原生画布生成图片（兼容方案）
						// 方案1：使用wx.canvasToTempFilePath（推荐）
						uni.canvasToTempFilePath({
							x: 0,
							y: 0,
							width: rect.width,
							height: rect.height,
							destWidth: rect.width * 3, // 3倍清晰度
							destHeight: rect.height * 3,
							canvasId: 'certificateCanvas',
							success: (res) => {
								// 方案2：如果直接截图失败，使用手动绘制画布的兜底方案
								if (!res.tempFilePath) {
									this.drawCertificateToCanvas(rect.width, rect.height).then(tempPath => {
										uni.hideLoading();
										this.certificateImage = tempPath;
										resolve(tempPath);
									}).catch(err => {
										uni.hideLoading();
										reject(err);
									});
									return;
								}
								
								uni.hideLoading();
								this.certificateImage = res.tempFilePath;
								resolve(res.tempFilePath);
							},
							fail: (err) => {
								// 兜底方案：手动绘制证书
								this.drawCertificateToCanvas(rect.width, rect.height).then(tempPath => {
									uni.hideLoading();
									this.certificateImage = tempPath;
									resolve(tempPath);
								}).catch(err2 => {
									uni.hideLoading();
									uni.showToast({
										title: '生成证书失败',
										icon: 'none'
									});
									reject(err2);
								});
							}
						}, this);
					}).exec();
				});
			},
			/**
			 * 兜底方案：手动绘制证书到画布
			 */
			drawCertificateToCanvas(width, height) {
				return new Promise((resolve, reject) => {
					// 获取画布上下文
					const ctx = uni.createCanvasContext('certificateCanvas', this);
					const scale = 3; // 缩放比例，提高清晰度
					const w = width * scale;
					const h = height * scale;

					// 1. 绘制证书背景
					ctx.setFillStyle('#FFFBF2');
					ctx.fillRect(0, 0, w, h);
					
					// 2. 绘制证书边框
					ctx.setStrokeStyle('#D4A574');
					ctx.setLineWidth(18);
					ctx.roundRect(10, 10, w - 20, h - 20, 96);
					ctx.stroke();
					
					// 3. 绘制证书标题
					ctx.setFontSize(168);
					ctx.setFillStyle('#4D0000');
					ctx.setTextAlign('center');
					ctx.fillText('功德证书', w / 2, 240);
					
					ctx.setFontSize(66);
					ctx.setFillStyle('#999');
					ctx.fillText('Certificate of Merit', w / 2, 320);
					
					// 4. 绘制分隔线
					ctx.setStrokeStyle('#D4A574');
					ctx.setLineWidth(6);
					ctx.beginPath();
					ctx.moveTo(w / 2 - 600, 380);
					ctx.lineTo(w / 2 + 600, 380);
					ctx.stroke();
					
					// 5. 绘制功德主信息
					ctx.setFontSize(72);
					ctx.setFillStyle('#999');
					ctx.fillText('功德主', w / 2, 500);
					
					ctx.setFontSize(144);
					ctx.setFillStyle('#D4A574');
					ctx.fillText(this.userInfo.nickname || '善信', w / 2, 680);
					
					// 6. 绘制功德文案
					ctx.setFontSize(108);
					ctx.setFillStyle('#4D0000');
					ctx.fillText('虔诚供奉，功德无量', w / 2, 840);
					
					ctx.setFontSize(78);
					ctx.setFillStyle('#999');
					ctx.fillText('心诚则灵，善念成真', w / 2, 940);
					
					// 7. 绘制信息区域
					ctx.setFontSize(72);
					ctx.setFillStyle('#999');
					ctx.fillText('累计爱心值', w / 2 - 400, 1100);
					ctx.fillText('获得日期', w / 2 + 400, 1100);
					
					ctx.setFontSize(84);
					ctx.setFillStyle('#D4A574');
					ctx.fillText(`${this.totalIncense || this.userInfo.balance} 点`, w / 2 - 400, 1220);
					ctx.fillText(this.certificateDate, w / 2 + 400, 1220);
					
					// 8. 绘制印章
					ctx.setStrokeStyle('#D4A574');
					ctx.setLineWidth(12);
					ctx.arc(w - 420, 1400, 420, 0, 2 * Math.PI);
					ctx.stroke();
					
					ctx.setFontSize(78);
					ctx.setFillStyle('#D4A574');
					ctx.fillText('功德', w - 420, 1360);
					ctx.fillText('圆满', w - 420, 1460);
					
					// 9. 绘制底部信息
					ctx.setStrokeStyle('#D4A574');
					ctx.setLineWidth(6);
					ctx.beginPath();
					ctx.moveTo(w / 2 - 600, 1700);
					ctx.lineTo(w / 2 + 600, 1700);
					ctx.stroke();
					
					ctx.setFontSize(96);
					ctx.setFillStyle('#4D0000');
					ctx.fillText('妈祖文化传承', w / 2, 1820);
					
					ctx.setFontSize(60);
					ctx.setFillStyle('#999');
					ctx.fillText('Mazu Cultural Heritage', w / 2, 1900);
					
					// 绘制完成，生成图片
					ctx.draw(false, () => {
						uni.canvasToTempFilePath({
							x: 0,
							y: 0,
							width: w,
							height: h,
							destWidth: w,
							destHeight: h,
							canvasId: 'certificateCanvas',
							success: (res) => {
								resolve(res.tempFilePath);
							},
							fail: (err) => {
								reject(err);
							}
						}, this);
					});
				});
			},
			/**
			 * 分享证书（支持好友/朋友圈）
			 */
			async shareCertificate() {
				try {
					// 1. 生成证书图片
					const imagePath = await this.convertCertificateToImage();
					
					// 2. 显示分享选项
					uni.showActionSheet({
						itemList: ['分享给微信好友', '分享到朋友圈'],
						success: (res) => {
							if (res.tapIndex === 0) {
								// 分享给好友
								uni.shareAppMessage({
									title: `我的妈祖功德证书`,
									path: '/pages/certificate/certificate',
									imageUrl: imagePath,
									success: () => {
										uni.showToast({
											title: '分享成功',
											icon: 'success'
										});
									},
									fail: (err) => {
										console.error('分享好友失败：', err);
										uni.showToast({
											title: '分享失败，请重试',
											icon: 'none'
										});
									}
								});
							} else if (res.tapIndex === 1) {
								// 分享到朋友圈
								uni.shareTimeline({
									title: `我的妈祖功德证书，累计捐献${this.userInfo.balance || 0}点爱心值！`,
									imageUrl: imagePath,
									success: () => {
										uni.showToast({
											title: '分享成功',
											icon: 'success'
										});
									},
									fail: (err) => {
										console.error('分享朋友圈失败：', err);
										uni.showToast({
											title: '分享失败，请重试',
											icon: 'none'
										});
									}
								});
							}
						},
						fail: (err) => {
							console.error('取消分享：', err);
						}
					});
				} catch (err) {
					console.error('分享证书失败：', err);
					uni.showToast({
						title: '分享失败，请重试',
						icon: 'none'
					});
				}
			},
			/**
			 * 保存证书图片到相册
			 */
			async saveCertificate() {
				try {
					// 1. 生成证书图片
					const imagePath = await this.convertCertificateToImage();
					
					// 2. 检查相册权限
					const settingRes = await uni.getSetting();
					if (!settingRes.authSetting['scope.writePhotosAlbum']) {
						// 申请权限
						try {
							await uni.authorize({
								scope: 'scope.writePhotosAlbum'
							});
						} catch (authErr) {
							// 用户拒绝授权，引导到设置页
							uni.showModal({
								title: '提示',
								content: '需要您授权保存图片到相册的权限',
								confirmText: '去设置',
								success: (modalRes) => {
									if (modalRes.confirm) {
										uni.openSetting();
									}
								}
							});
							return;
						}
					}
					
					// 3. 保存图片到相册
					uni.saveImageToPhotosAlbum({
						filePath: imagePath,
						success: () => {
							uni.showToast({
								title: '保存成功',
								icon: 'success'
							});
						},
						fail: (err) => {
							console.error('保存图片失败：', err);
							uni.showToast({
								title: '保存失败，请重试',
								icon: 'none'
							});
						}
					});
				} catch (err) {
					console.error('保存证书失败：', err);
					uni.showToast({
						title: '保存失败，请重试',
						icon: 'none'
					});
				}
			}
		}
	};
</script>

<style lang="less" scoped>
	.certificate-page {
		background-color: #fffbf2;
		min-height: 100vh;
	}

	.content {
		position: relative;
		top: 200rpx;
		width: 100%;
		background-color: #FFFBF2;
		border-radius: 40rpx 40rpx 0 0;
		padding-bottom: 100rpx;
	}

	.container {
		width: 95%;
		margin: 0 auto;
		padding: 40rpx 0;
	}

	// 空状态样式
	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 120rpx 40rpx;
		min-height: 600rpx;

		.empty-icon {
			font-size: 140rpx;
			margin-bottom: 50rpx;
			animation: float 3s ease-in-out infinite;
		}

		.empty-text {
			font-size: 40rpx;
			color: #4d0000;
			font-weight: 600;
			margin-bottom: 24rpx;
			font-family: '阿里妈妈数黑体 Bold';
		}

		.empty-desc {
			font-size: 28rpx;
			color: #666;
			text-align: center;
			margin-bottom: 60rpx;
			line-height: 1.8;
			padding: 0 40rpx;
		}

		.login-btn,
		.goto-btn {
			width: 320rpx;
			height: 88rpx;
			background: linear-gradient(135deg, #d4a574 0%, #c8965e 100%);
			border-radius: 44rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			color: #fff;
			font-size: 32rpx;
			font-weight: 600;
			margin-top: 20rpx;
			box-shadow: 0 10rpx 30rpx rgba(196, 150, 94, 0.4);
			transition: all 0.3s;

			&:active {
				transform: scale(0.95);
				box-shadow: 0 6rpx 20rpx rgba(196, 150, 94, 0.3);
			}
		}

		// 进度条样式
		.progress-box {
			width: 100%;
			margin-top: 50rpx;
			padding: 40rpx 30rpx;
			background: linear-gradient(135deg, #fff9e6 0%, #fffbf2 100%);
			border-radius: 20rpx;
			box-shadow: 0 4rpx 20rpx rgba(212, 165, 116, 0.15);

			.progress-label {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 24rpx;
				font-size: 28rpx;
				color: #333;

				.progress-percent {
					color: #d4a574;
					font-weight: 600;
					font-size: 32rpx;
				}
			}

			.progress-bar {
				width: 100%;
				height: 20rpx;
				background: #e8e8e8;
				border-radius: 10rpx;
				overflow: hidden;
				position: relative;
				box-shadow: inset 0 2rpx 4rpx rgba(0, 0, 0, 0.1);

				.progress-fill {
					height: 100%;
					background: linear-gradient(90deg, #d4a574 0%, #c8965e 50%, #d4a574 100%);
					background-size: 200% 100%;
					border-radius: 10rpx;
					transition: width 0.5s ease;
					animation: shimmer 2s infinite;
					box-shadow: 0 2rpx 8rpx rgba(212, 165, 116, 0.4);
				}
			}
		}
	}

	@keyframes float {
		0%, 100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-20rpx);
		}
	}

	@keyframes shimmer {
		0% {
			background-position: -200% 0;
		}
		100% {
			background-position: 200% 0;
		}
	}

	// 证书容器样式
	.certificate-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 0 20rpx;
	}

	// 顶部图标
	.certificate-top-icon {
		font-size: 80rpx;
		margin-bottom: 30rpx;
		animation: float 3s ease-in-out infinite;
	}

	// 证书卡片样式
	.certificate-card {
		width: 100%;
		max-width: 680rpx;
		background: linear-gradient(135deg, #fffef8 0%, #fffbf2 50%, #fffef8 100%);
		border: 6rpx solid #d4a574;
		border-radius: 32rpx;
		padding: 20rpx;
		margin-bottom: 50rpx;
		box-shadow: 
			0 20rpx 60rpx rgba(212, 165, 116, 0.25),
			0 0 0 2rpx rgba(255, 255, 255, 0.8) inset,
			0 0 40rpx rgba(212, 165, 116, 0.1) inset;
		position: relative;
		overflow: visible;

		// 背景装饰
		&::before {
			content: '';
			position: absolute;
			top: -100rpx;
			right: -80rpx;
			width: 500rpx;
			height: 500rpx;
			background: radial-gradient(circle, rgba(212, 165, 116, 0.08) 0%, transparent 70%);
			border-radius: 50%;
			pointer-events: none;
		}

		&::after {
			content: '';
			position: absolute;
			bottom: -80rpx;
			left: -60rpx;
			width: 450rpx;
			height: 450rpx;
			background: radial-gradient(circle, rgba(212, 165, 116, 0.08) 0%, transparent 70%);
			border-radius: 50%;
			pointer-events: none;
		}

		// 左侧装饰
		.decoration-left {
			position: absolute;
			left: 20rpx;
			top: 50%;
			transform: translateY(-50%);
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: 20rpx;
			z-index: 0;

			.decoration-line {
				width: 2rpx;
				height: 80rpx;
				background: linear-gradient(180deg, transparent 0%, #d4a574 50%, transparent 100%);
			}

			.decoration-circle {
				width: 16rpx;
				height: 16rpx;
				border: 2rpx solid #d4a574;
				border-radius: 50%;
				background: #fffbf2;
			}
		}

		// 右侧装饰
		.decoration-right {
			position: absolute;
			right: 20rpx;
			top: 50%;
			transform: translateY(-50%);
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: 20rpx;
			z-index: 0;

			.decoration-line {
				width: 2rpx;
				height: 80rpx;
				background: linear-gradient(180deg, transparent 0%, #d4a574 50%, transparent 100%);
			}

			.decoration-circle {
				width: 16rpx;
				height: 16rpx;
				border: 2rpx solid #d4a574;
				border-radius: 50%;
				background: #fffbf2;
			}
		}

		// 证书头部
		.certificate-header {
			text-align: center;
			margin-bottom: 60rpx;
			position: relative;
			z-index: 1;

			.header-icon {
				font-size: 50rpx;
				margin-bottom: 20rpx;
			}

			.certificate-title {
				display: block;
				font-size: 56rpx;
				font-weight: bold;
				color: #4d0000;
				margin-bottom: 12rpx;
				font-family: '阿里妈妈数黑体 Bold';
				letter-spacing: 4rpx;
				text-shadow: 0 2rpx 4rpx rgba(77, 0, 0, 0.1);
			}

			.certificate-subtitle {
				display: block;
				font-size: 22rpx;
				color: #999;
				font-style: italic;
				letter-spacing: 2rpx;
				margin-bottom: 24rpx;
			}

			.header-divider {
				width: 200rpx;
				height: 2rpx;
				background: linear-gradient(90deg, transparent 0%, #d4a574 50%, transparent 100%);
				margin: 0 auto;
			}
		}

		// 证书主体
		.certificate-body {
			position: relative;
			z-index: 1;
			min-height: 400rpx;

			.certificate-content {
				text-align: center;

				.name-wrapper {
					margin-bottom: 50rpx;
					padding: 30rpx 0;
					border-top: 1rpx dashed rgba(212, 165, 116, 0.3);
					border-bottom: 1rpx dashed rgba(212, 165, 116, 0.3);

					.name-label {
						display: block;
						font-size: 24rpx;
						color: #999;
						margin-bottom: 16rpx;
					}

					.certificate-name {
						display: block;
						font-size: 48rpx;
						font-weight: 600;
						color: #d4a574;
						font-family: '阿里妈妈数黑体 Bold';
						letter-spacing: 2rpx;
					}
				}

				.merit-wrapper {
					margin-bottom: 50rpx;

					.merit-text {
						display: block;
						font-size: 36rpx;
						color: #4d0000;
						margin-bottom: 16rpx;
						line-height: 1.6;
						font-weight: 500;
					}

					.merit-desc {
						display: block;
						font-size: 26rpx;
						color: #999;
						font-style: italic;
					}
				}

				.info-wrapper {
					display: flex;
					justify-content: space-around;
					padding: 30rpx 20rpx;
					background: linear-gradient(135deg, rgba(212, 165, 116, 0.05) 0%, rgba(200, 150, 94, 0.05) 100%);
					border-radius: 16rpx;
					margin-bottom: 30rpx;

					.info-item {
						display: flex;
						flex-direction: column;
						align-items: center;
						gap: 12rpx;

						.info-label {
							font-size: 24rpx;
							color: #999;
						}

						.info-value {
							font-size: 28rpx;
							color: #d4a574;
							font-weight: 600;
						}
					}
				}
			}

			// 印章
			.certificate-seal {
				position: absolute;
				bottom: 70rpx;
				right: 30rpx;
				z-index: 2;

				.seal-circle {
					width: 140rpx;
					height: 140rpx;
					border: 4rpx solid #d4a574;
					border-radius: 50%;
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 249, 230, 0.95) 100%);
					box-shadow: 0 4rpx 12rpx rgba(212, 165, 116, 0.3);

					.seal-text {
						font-size: 26rpx;
						color: #d4a574;
						font-weight: 600;
						line-height: 1.2;
						transform: rotate(-12deg);
						font-family: '阿里妈妈数黑体 Bold';
					}
				}
			}
		}

		// 证书底部
		.certificate-footer {
			text-align: center;
			margin-top: 60rpx;
			padding-top: 30rpx;
			position: relative;
			z-index: 1;

			.footer-divider {
				width: 200rpx;
				height: 2rpx;
				background: linear-gradient(90deg, transparent 0%, #d4a574 50%, transparent 100%);
				margin: 0 auto 24rpx;
			}

			.certificate-org {
				display: block;
				font-size: 32rpx;
				color: #4d0000;
				font-weight: 600;
				margin-bottom: 8rpx;
				font-family: '妈祖祖庙';
			}

			.certificate-org-en {
				display: block;
				font-size: 20rpx;
				color: #999;
				font-style: italic;
			}
		}
	}

	// 操作按钮样式
	.certificate-actions {
		display: flex;
		justify-content: space-between;
		width: 100%;
		max-width: 680rpx;
		gap: 24rpx;
		padding: 0 20rpx;

		.action-btn {
			flex: 1;
			height: 88rpx;
			border-radius: 44rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			gap: 12rpx;
			font-size: 32rpx;
			font-weight: 600;
			transition: all 0.3s;
			position: relative;
			overflow: hidden;

			.btn-icon {
				font-size: 36rpx;
			}

			&.share-btn {
				background: #fff;
				color: #d4a574;
				border: 3rpx solid #d4a574;
				box-shadow: 0 4rpx 16rpx rgba(212, 165, 116, 0.2);

				&::before {
					content: '';
					position: absolute;
					top: 50%;
					left: 50%;
					width: 0;
					height: 0;
					border-radius: 50%;
					background: rgba(212, 165, 116, 0.1);
					transform: translate(-50%, -50%);
					transition: width 0.3s, height 0.3s;
				}

				&:active {
					transform: scale(0.96);
					
					&::before {
						width: 300rpx;
						height: 300rpx;
					}
				}
			}

			&.save-btn {
				background: linear-gradient(135deg, #d4a574 0%, #c8965e 100%);
				color: #fff;
				box-shadow: 0 8rpx 24rpx rgba(196, 150, 94, 0.4);

				&:active {
					transform: scale(0.96);
					box-shadow: 0 4rpx 16rpx rgba(196, 150, 94, 0.3);
				}
			}
		}
	}
</style>