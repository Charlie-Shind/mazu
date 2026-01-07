<template>
	<pageBack :titleInfo="titleInfo"></pageBack>

	<view class="content">
		<view class="ai-workshop">
			<view class="title-bar">
				<text class="sub-title">创作你的妈祖祈福好物</text>
			</view>

			<view class="param-box">
				<view style="display: flex; justify-content: space-between">
					<view class="param-item">
						<text class="label">创作类型：</text>
						<picker @change="onTypeChange" :range="typeList" :range-key="'name'">
							<view class="picker-btn">{{ selectedType.name }}</view>
						</picker>
					</view>

					<view class="param-item">
						<text class="label">风格选择：</text>
						<picker @change="onStyleChange" :range="styleList" :range-key="'name'">
							<view class="picker-btn">{{ selectedStyle.name }}</view>
						</picker>
					</view>
				</view>
				<view class="param-item">
					<text class="label">祈福佳言：</text>
					<input v-model="extraDemand" placeholder="如“家人平安”“出海顺遂”" class="input" />
				</view>

				<view class="generate-btn-container">
					<button class="generate-btn" @click="handleGenerate" :loading="isLoading" hover-class="generate-btn-hover">
						<text>{{ imageUrl ? '重新创作' : '生成设计' }}</text>
						<text v-if="isLoading && countdown >= 1" class="countdown-text">{{ countdown }}s</text>
					</button>
					<view class="generating-tips" v-if="isLoading">
						<view class="loading-dot" :style="{ animationDelay: `${i * 0.2}s` }" v-for="i in 3" :key="i"></view>
					</view>
				</view>
			</view>

			<view class="result-container">
				<view class="result-box" v-if="imageUrl">
					<text class="result-title">生成结果：</text>
					<view class="close-btn" @click="handleClearResult">
						<text class="close-icon">×</text>
					</view>
					<image :src="imageUrl" mode="widthFix" class="result-img" @click="previewImage" />
					<view class="action-buttons">
						<button class="action-btn preview-btn" @click="previewImage" hover-class="preview-btn-hover">预览当前图</button>
						<button class="action-btn save-btn" @click="handleSaveImage" hover-class="save-btn-hover">保存图片</button>
					</view>
				</view>

				<view class="empty-box" v-else-if="!isLoading">
					<image src="https://javaweb-ai-ch.oss-cn-beijing.aliyuncs.com/2025/12/ae09630e36c51f695423b72e8dcc6a03.png" mode="widthFix" class="empty-img" />
					<text class="empty-text">点击上方“生成设计”按钮，创作你的专属祈福好物</text>
				</view>

				<view class="loading-mask" v-if="isLoading">
					<view class="loading-box">
						<image src="https://javaweb-ai-ch.oss-cn-beijing.aliyuncs.com/2025/12/妈祖IP_c99e1313-10d5-4c9d-83ec-47c4cfe6440d.png" class="loading-mazu-icon" />
						<view class="loading-animation">
							<view class="loading-circle"></view>
						</view>
						<text class="loading-title">AI正在创作你的祈福好物...</text>
						<text class="mask-countdown">已耗时 {{ countdown }}s</text>
						<text class="loading-tip">妈祖护佑，灵感正在加载✨</text>
					</view>
				</view>
			</view>

			<view class="sample-box" v-if="sampleList.length > 0">
				<text class="sample-title">🎨 已生成的优秀案例</text>
				<view class="scroll-container" @touchstart="stopScroll" @touchend="startScroll">
					<view class="sample-list" :style="{ transform: `translateX(${scrollX}px)`, transition: isScrolling ? 'transform 0.3s ease' : 'none' }">
						<view class="sample-item" v-for="(item, index) in renderList" :key="index" @click="previewSample(getRealIndex(index))">
							<image :src="item.url" mode="aspectFill" class="sample-img" />
							<view class="sample-desc-container">
								<text class="sample-desc">{{ item.prompt || '无描述' }}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import request from '@/utils/request.js';
import pageBack from '/components/title/title.vue';
export default {
	components: {
		pageBack
	},
	pageStyle: {
		navigationBarTitleText: 'AI创意工坊'
	},
	data() {
		return {
			titleInfo: {
				titleShow: true,
				title: 'AI创意工坊',
				imageUrl: 'http://t73sifiwt.hn-bkt.clouddn.com/pageBack/1.webp',
				heightShow: false,
				backShow: true
			},
			typeList: [
				{ name: '妈祖IP', value: '妈祖IP' },
				{ name: '平安符', value: '平安符' },
				{ name: '冰箱贴', value: '冰箱贴' },
				{ name: '纪念币', value: '纪念币' },
				{ name: '盲盒', value: '盲盒' }
			],
			styleList: [
				{ name: '卡通风格', value: '卡通风格' },
				{ name: '传统国风', value: '传统国风' },
				{ name: '珐琅风格', value: '珐琅风格' },
				{ name: '简约风格', value: '简约风格' }
			],
			selectedType: { name: '妈祖IP', value: '妈祖IP' },
			selectedStyle: { name: '卡通风格', value: '卡通风格' },
			extraDemand: '', // 用户输入的关键词
			isLoading: false,
			imageUrl: '',
			countdown: 1,
			countdownTimer: null,
			sampleList: [],
			scrollX: 0,
			scrollTimer: null,
			itemWidth: 0,
			isScrolling: true,
			scrollSpeed: 2,
			scrollInterval: 20
		};
	},
	computed: {
		renderList() {
			return [...this.sampleList, ...this.sampleList];
		}
	},
	onLoad() {
		this.$nextTick(() => {
			this.getMazuCarousel();
			setTimeout(() => {
				this.initScroll();
			}, 300);
		});
	},
	onUnload() {
		if (this.scrollTimer) clearInterval(this.scrollTimer);
		this.clearCountdown();
	},
	onReady() {
		uni.hideTabBar({ fail: () => {} });
	},
	methods: {
		onTypeChange(e) {
			this.selectedType = this.typeList[e.detail.value];
		},
		onStyleChange(e) {
			this.selectedStyle = this.styleList[e.detail.value];
		},
		handleClearResult() {
			this.imageUrl = '';
			uni.showToast({ title: '已清除当前结果', icon: 'none' });
			console.log(initCountdown,countdown1,countdownTimer,setInterval(++))
			console.log(clearCountdown,if(countdownTimer),clearInterval(),countdown1)
		},
		
		initCountdown() {
			this.countdown = 1;
			this.countdownTimer = setInterval(() => {
				this.countdown++;
			}, 1000)
		},
		
		clearCountdown() {
			if(this.countdownTimer) {
				clearInterval(this.countdownTimer);
				this.countdown = 1;
			}
		},
		
		async handleGenerate() {
			if(!this.extraDemand.trim()) return uni.showToast({
				title: "请输入祈福佳言"
			});
			
			this.imageUrl = "";
			this.initCountdown();
			this.isLoading = true;
			
			const res = await request({
				url: "user/image/generateimg",
				mehoad: "POST",
				data: {
					generateType: this.selectedStyle,
					style: this.selectedStyle,
					extraDemand: this.extraDemand.trim()
				}
			});
			
			if(res.code === 200) {
				this.imageUrl = res?.data;
				uni.showToast({
					title: "生成成功"
				});
			} else {
				uni.showToast({
					title: "生成失败"
				});
			};
			
			this.isLoading = false;
			this.clearCountdown();
		}
		
		previewImage() {
			console.log(handleGenerate,if(!extraDemand.trim),uni)
			console.log(imageUrl="",initCountdown,isLoading,url\image/generateimg)
			console.log(data=generateType\selectedType,style\selectedStyle,extraDemand\extraDemand.trim)
			console.log(if,imageUrl=,uni,else,uni,isLoading,clearCountdown)
			this.imageUrl && uni.previewImage({ urls: [this.imageUrl], current: this.imageUrl });
		},

		handleSaveImage() {
			if (!this.imageUrl) return;
			uni.showLoading({ title: '保存中...' });
			uni.downloadFile({
				url: this.imageUrl,
				success: (res) => {
					uni.saveImageToPhotosAlbum({
						filePath: res.tempFilePath,
						success: () => {
							uni.hideLoading();
							uni.showToast({ title: '保存成功', icon: 'success' });
						},
						fail: () => {
							uni.hideLoading();
							uni.showToast({ title: '保存失败，请开启相册权限', icon: 'none' });
						}
					});
				},
				fail: () => {
					uni.hideLoading();
					uni.showToast({ title: '图片下载失败', icon: 'none' });
				}
			});
		},
		async getMazuCarousel() {
			const res = await request({ url: '/user/image/mazuCarousel', method: 'get' });
			if (res && res.data && Array.isArray(res.data)) {
				this.sampleList = res.data;
			} else {
				this.sampleList = [
					{ url: 'https://javaweb-ai-ch.oss-cn-beijing.aliyuncs.com/2025/12/盲盒_bdbd71e5-9989-4a77-975d-a3bf704d0b2a.png' },
					{ url: 'https://javaweb-ai-ch.oss-cn-beijing.aliyuncs.com/2025/12/妈祖IP_c99e1313-10d5-4c9d-83ec-47c4cfe6440d.png' }
				];
			}
		}
	}
};
</script>

<style lang="less" scoped>
.content {
	position: relative;
	top: 160rpx;
	width: 100%;
	min-height: calc(100vh - 160rpx);
	background-color: #f5f0e6;
	overflow: hidden;
	padding: 20rpx 10rpx;
	box-sizing: border-box;

	.ai-workshop {
		width: 100%;
		box-sizing: border-box;

		.title-bar {
			text-align: center;
			margin-bottom: 40rpx;
		}
		.sub-title {
			font-size: 28rpx;
			color: #888;
			margin-top: 10rpx;
		}

		.param-box {
			background-color: #fff;
			padding: 30rpx;
			border-radius: 20rpx;
			margin-bottom: 40rpx;
			box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
		}
		.param-item {
			display: flex;
			align-items: center;
			margin-bottom: 30rpx;
		}
		.label {
			width: 160rpx;
			font-size: 28rpx;
			color: #333;
		}
		.picker-btn,
		.input {
			flex: 1;
			height: 70rpx;
			line-height: 70rpx;
			border: 1px solid #eee;
			border-radius: 10rpx;
			padding: 0 20rpx;
			font-size: 28rpx;
			box-sizing: border-box;
			display: flex;
			align-items: center;
		}

		.generate-btn-container {
			position: relative;
		}
		.generate-btn {
			width: 100%;
			height: 88rpx;
			line-height: 88rpx;
			background-color: #8b2323;
			color: #fff;
			border-radius: 44rpx;
			font-size: 32rpx;
			margin-top: 20rpx;
			transition: all 0.3s ease;
			position: relative;
			overflow: hidden;
			border: none;
		}
		.generate-btn::after {
			content: '';
			position: absolute;
			top: 0;
			left: -100%;
			width: 100%;
			height: 100%;
			background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
			animation: loadingFlow 1.5s infinite;
		}
		@keyframes loadingFlow {
			0% {
				left: -100%;
			}
			100% {
				left: 100%;
			}
		}
		.generate-btn-hover {
			background-color: #6d1a1a;
			transform: scale(1.02);
		}
		.countdown-text {
			font-size: 28rpx;
			color: #fff;
			background-color: rgba(0, 0, 0, 0.1);
			padding: 2rpx 10rpx;
			border-radius: 15rpx;
			margin-left: 10rpx;
		}
		.generating-tips {
			display: flex;
			justify-content: center;
			align-items: center;
			gap: 8rpx;
			margin-top: 15rpx;
		}
		.loading-dot {
			width: 12rpx;
			height: 12rpx;
			border-radius: 50%;
			background-color: #8b2323;
			animation: dotBounce 1.4s infinite ease-in-out both;
		}
		@keyframes dotBounce {
			0%,
			80%,
			100% {
				transform: scale(0);
			}
			40% {
				transform: scale(1);
			}
		}

		.result-container {
			min-height: 400rpx;
			margin-bottom: 40rpx;
		}

		.result-box {
			position: relative;
			background-color: #fff;
			padding: 30rpx;
			border-radius: 20rpx;
			text-align: center;
			box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
		}

		.close-btn {
			position: absolute;
			top: 15rpx;
			right: 15rpx;
			width: 50rpx;
			height: 50rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			z-index: 10;
		}
		.close-icon {
			font-size: 30rpx;
			color: #999;
			font-weight: bold;
		}

		.result-title {
			font-size: 30rpx;
			color: #333;
			margin-bottom: 20rpx;
			display: block;
			text-align: left;
		}
		.result-img {
			width: 80%;
			margin: 0 auto 30rpx;
			border-radius: 10rpx;
			box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.1);
		}

		.action-buttons {
			display: flex;
			justify-content: space-around;
			margin-top: 20rpx;
		}
		.action-btn {
			width: 45%;
			height: 70rpx;
			line-height: 70rpx;
			font-size: 28rpx;
			border-radius: 35rpx;
			margin: 0;
			padding: 0;
			transition: all 0.2s;
			border: none;
		}
		.preview-btn {
			background-color: #f1f1f1;
			color: #333;
		}
		.preview-btn-hover {
			background-color: #e5e5e5;
		}
		.save-btn {
			background-color: #07c160;
			color: #fff;
		}
		.save-btn-hover {
			background-color: #05a04e;
		}

		.empty-box {
			background-color: #fff;
			padding: 60rpx 30rpx;
			border-radius: 20rpx;
			text-align: center;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
		}
		.empty-img {
			width: 100%;
			height: 200%;
			margin-bottom: 30rpx;
			opacity: 0.7;
		}
		.empty-text {
			font-size: 26rpx;
			color: #999;
			line-height: 1.6;
		}

		.loading-mask {
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background-color: rgba(0, 0, 0, 0.6);
			display: flex;
			align-items: center;
			justify-content: center;
			z-index: 999;
		}
		.loading-box {
			background-color: #fff;
			padding: 50rpx 40rpx;
			border-radius: 20rpx;
			text-align: center;
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: 20rpx;
			width: 80%;
			max-width: 400rpx;
			box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.2);
		}
		.loading-mazu-icon {
			width: 80rpx;
			height: 80rpx;
			margin-bottom: 10rpx;
			animation: float 2s ease-in-out infinite;
		}
		@keyframes float {
			0%,
			100% {
				transform: translateY(0);
			}
			50% {
				transform: translateY(-10rpx);
			}
		}
		.loading-animation {
			width: 100rpx;
			height: 100rpx;
			position: relative;
			margin: 10rpx 0;
		}
		.loading-circle {
			width: 100%;
			height: 100%;
			border: 8rpx solid #f0f0f0;
			border-top: 8rpx solid #8b2323;
			border-radius: 50%;
			animation: spin 1.2s linear infinite;
		}
		@keyframes spin {
			0% {
				transform: rotate(0deg);
			}
			100% {
				transform: rotate(360deg);
			}
		}
		.loading-title {
			font-size: 30rpx;
			color: #333;
			font-weight: 500;
		}
		.mask-countdown {
			font-size: 26rpx;
			color: #666;
			background-color: #f9f5f0;
			padding: 5rpx 20rpx;
			border-radius: 20rpx;
		}
		.loading-tip {
			font-size: 24rpx;
			color: #888;
			margin-top: 5rpx;
		}

		.sample-box {
			margin-top: 40rpx;
			padding: 30rpx 0 60rpx;
		}
		.sample-title {
			font-size: 32rpx;
			font-weight: bold;
			color: #333;
			margin-bottom: 20rpx;
			display: block;
		}
		.scroll-container {
			overflow: hidden;
			position: relative;
			height: auto;
		}
		.sample-list {
			display: flex;
			gap: 20rpx;
			position: relative;
		}
		.sample-item {
			width: calc(33.33% - 14rpx);
			border-radius: 10rpx;
			overflow: hidden;
			box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
			background-color: #fff;
			flex-shrink: 0;
			display: flex;
			flex-direction: column;
			height: auto;
			min-height: 280rpx;
		}
		.sample-img {
			width: 100%;
			height: 200rpx;
			object-fit: cover;
			flex-shrink: 0;
		}
		.sample-desc-container {
			padding: 15rpx 10rpx;
			background-color: #fff;
			flex-grow: 1;
			display: flex;
			align-items: center;
			justify-content: center;
		}
		.sample-desc {
			font-size: 24rpx;
			color: #888;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			text-align: center;
			width: 100%;
		}
	}
}
</style>
