<script>
	export default {
		onLoad() {
			uni.hideTabBar();
		},
		onShow() {
			setTimeout(() => {
				uni.hideTabBar();
			}, 100);
		}
	}
</script>

<style>
	/*每个页面公共css */
	@import url('/static/font/Ali.css');

	html,
	page {
		background-color: rgb(255, 251, 242);
		color: #333;
	}

	.page {
		padding-bottom: 200rpx;
	}
</style>