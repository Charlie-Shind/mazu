<template>
	<view class="incense-fab" @click="goIncense">
		<!-- <image class="fab-icon" src="/static/add.svg" mode="aspectFit"></image>
		<view class="fab-text">上香</view> -->
		<image src="https://javaweb-ai-ch.oss-cn-beijing.aliyuncs.com/2025/12/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20251223153411_774_2552.png" mode="widthFix"></image>
		<view class="fab-text">公益践行</view> 
	</view>
</template>

<script>
	export default {
		name: 'IncenseFab',
		methods: {
			goIncense() {
				uni.navigateTo({
					url: '/secondPages/incense/incense'
				});
			}
		}
	};
</script>

<style lang="less" scoped>
	.incense-fab {
		position: fixed;
		right: 30rpx;
		bottom: 180rpx;
		z-index: 999;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		color: #fff;
		font-family: '阿里妈妈方圆体 VF Regular', sans-serif;

		image {
			width: 200rpx;
		}
	}

	.fab-icon {
		width: 50rpx;
		height: 50rpx;
		margin-bottom: 6rpx;
	}

	.fab-text {
		color: #C92126;
		font-weight: bold;
		font-size: 24rpx;
		letter-spacing: 2rpx;
	}
</style>