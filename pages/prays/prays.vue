<template>
	<view class="content">
		<view class="container">
			<image class="backImage" src="http://t73sifiwt.hn-bkt.clouddn.com/prays/mazuback.jpg" mode="">
			</image>
			<view class="zhangYiNa">
				<image class="qian" src="http://t73sifiwt.hn-bkt.clouddn.com/prays/qian.png" mode=""
					:class="{ 'shake': isShaking }">
				</image>
			</view>
			<view class="share">
				摇一摇 求好签
			</view>
		</view>
	</view>
	<incense-fab></incense-fab>
	<tabBar></tabBar>
	
	<!-- 首次进入提示弹窗 -->
	<uni-popup ref="firstVisitPopup" type="center" :isMaskClick="false">
		<view class="first-visit-popup">
			<view class="popup-header">
				<text class="popup-title">温馨提示</text>
			</view>
			<view class="popup-content">
				<text class="popup-text">本功能仅供娱乐体验，所有内容纯属虚构，请勿当真。</text>
				<text class="popup-text">愿您平安喜乐，万事顺遂！</text>
			</view>
			<view class="popup-footer">
				<view class="popup-btn" @click="closeFirstVisitPopup">我知道了</view>
			</view>
		</view>
	</uni-popup>
</template>

<script>
	import {
		onMounted,
		onUnmounted
	} from 'vue';
	import tabBar from "/components/tabbar/tabbar.vue";
	import IncenseFab from '/components/incense-fab/incense-fab.vue';

	export default {
		data() {
			return {
				titleInfo: {
					titleShow: true,
					title: "祈福",
					imageUrl: "http://t73sifiwt.hn-bkt.clouddn.com/pageBack/3.webp",
					heightShow: false
				},
				isShaking: false,
				isProcessing: false // 新增状态变量
			};
		},
		components: {
			tabBar,
			IncenseFab
		},
		onLoad() {
			// 检查是否首次进入
			this.checkFirstVisit();
		},
		onShow() {
			this.startShakeListener();
			console.log('我被触发辣1');
		},
		onHide() {
			this.stopShakeListener();
			console.log('我被触发辣2');
		},
		methods: {
			/**
			 * 检查是否首次进入
			 */
			checkFirstVisit() {
				const hasVisited = uni.getStorageSync('prays_first_visit');
				if (!hasVisited) {
					// 首次进入，显示弹窗
					setTimeout(() => {
						this.$refs.firstVisitPopup.open();
					}, 300);
				}
			},
			/**
			 * 关闭首次进入弹窗
			 */
			closeFirstVisitPopup() {
				// 标记已访问
				uni.setStorageSync('prays_first_visit', true);
				this.$refs.firstVisitPopup.close();
			},
			startShakeListener() {
				this.handleShake = this.handleShake.bind(this);
				this.gyroscopeChangeHandler = uni.onGyroscopeChange(this.handleShake);
				uni.startGyroscope({
					interval: "normal"
				});
			},
			stopShakeListener() {
				if (this.gyroscopeChangeHandler) {
					this.gyroscopeChangeHandler();
					this.gyroscopeChangeHandler = null;
				}
				uni.stopGyroscope();
			},
			handleShake(res) {
				if (this.isProcessing) return; // 如果正在处理则返回

				if (Math.abs(res.x) > 20 || Math.abs(res.y) > 4 || Math.abs(res.z) > 3) {
					this.isProcessing = true; // 开始处理

					uni.showLoading({
						title: "求签中",
						mask: true
					})
					this.randomNumber = Math.floor(Math.random() * 60) + 1; // 生成 1 到 60 之间的随机数
					this.isShaking = true;

					setTimeout(() => {
						this.isShaking = false;
					}, 2000);

					setTimeout(() => {
						uni.hideLoading();
						uni.navigateTo({
							url: `/secondPages/praysDetail/praysDetail?randomPrays=${this.randomNumber}`
						});
						this.isProcessing = false; // 结束处理
					}, 3000);
				}
			},
		}
	};
</script>


<style lang="less">
	.container {
		position: relative;
		height: calc(100vh - 250rpx);
		width: 100%;
		background-color: rgb(255, 251, 241);
		border-radius: 40rpx 40rpx 0 0;

		.backImage {
			width: 100%;
			height: calc(100vh - 120rpx);
			// position: absolute;
			float: left;
			top: 0%;
			left: 0%;
			z-index: 1;
		}

		.zhangYiNa {
			position: absolute;
			height: 100vh;
			display: flex;
			justify-content: center;
			align-items: center;
			width: 100%;
		}

		.qian {
			height: 700rpx;
			width: 570rpx;
			z-index: 99;
		}
	}

	.qian.shake {
		animation: shake 0.5s infinite;
	}

	.share {
		position: absolute;
		left: 50%;
		transform: translate(-50%, 0%);
		bottom: 5%;
		z-index: 99;
		font-size: 52rpx;
		font-family: '阿里妈妈数黑体 Bold' !important;
		font-weight: bold;
	}

	@keyframes shake {
		0% {
			transform: rotate(0deg);
		}

		25% {
			transform: rotate(-10deg);
		}

		50% {
			transform: rotate(10deg);
		}

		75% {
			transform: rotate(-10deg);
		}

		100% {
			transform: rotate(0deg);
		}
	}

	// 首次进入弹窗样式
	.first-visit-popup {
		width: 600rpx;
		background: #fff;
		border-radius: 24rpx;
		overflow: hidden;
		box-shadow: 0 10rpx 40rpx rgba(0, 0, 0, 0.15);

		.popup-header {
			height: 100rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			background: linear-gradient(135deg, #d4a574 0%, #c8965e 100%);
			border-bottom: 1rpx solid rgba(255, 255, 255, 0.2);

			.popup-title {
				color: #fff;
				font-size: 36rpx;
				font-weight: 600;
			}
		}

		.popup-content {
			padding: 40rpx 30rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			min-height: 200rpx;

			.popup-text {
				color: #333;
				font-size: 28rpx;
				line-height: 1.8;
				text-align: center;
				margin-bottom: 20rpx;

				&:last-child {
					margin-bottom: 0;
					color: #d4a574;
					font-weight: 500;
				}
			}
		}

		.popup-footer {
			border-top: 1rpx solid #eee;

			.popup-btn {
				height: 100rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 32rpx;
				font-weight: 600;
				color: #fff;
				background: linear-gradient(135deg, #d4a574 0%, #c8965e 100%);
				transition: all 0.2s;

				&:active {
					opacity: 0.8;
				}
			}
		}
	}
</style>