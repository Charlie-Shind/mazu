<template>
	<view class="content">
		<view class="container">
			<image class="backImage" src="https://mazu-1320314698.cos.ap-guangzhou.myqcloud.com/prays/mazuback.jpg" mode="">
			</image>
			<view class="zhangYiNa">
				<image class="qian" src="https://mazu-1320314698.cos.ap-guangzhou.myqcloud.com/prays/qian.png" mode=""
					:class="{ 'shake': isShaking }">
				</image>
			</view>
			<view class="share">
				摇一摇 求好签
			</view>
		</view>
	</view>
	<tabBar></tabBar>
</template>

<script>
	import {
		onMounted,
		onUnmounted
	} from 'vue';
	import tabBar from "/components/tabbar/tabbar.vue";

	export default {
		data() {
			return {
				titleInfo: {
					titleShow: true,
					title: "祈福",
					imageUrl: "https://mazu-1320314698.cos.ap-guangzhou.myqcloud.com/pageBack/3.webp",
					heightShow: false
				},
				isShaking: false,
				isProcessing: false // 新增状态变量
			};
		},
		components: {
			tabBar
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
			z-index: 999;
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
		z-index: 999;
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
</style>