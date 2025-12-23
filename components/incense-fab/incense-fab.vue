<template>
	<view class="incense-fab" @click="goIncense">
		<!-- <image class="fab-icon" src="/static/add.svg" mode="aspectFit"></image>
		<view class="fab-text">上香</view> -->
		<image src="http://t73sifiwt.hn-bkt.clouddn.com/index/c1c063e459d748ba8f7527f84615cd5c.gif" mode="widthFix"></image>
		<view class="fab-text">供奉上香</view> 
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