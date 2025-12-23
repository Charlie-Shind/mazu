<template>
	<pageBack :titleInfo="titleInfo"></pageBack>
	<view class="content">

	</view>
</template>
<script>
	import pageBack from "/components/title/title.vue";
	import {
		useUserInfoStore
	} from "@/store/userInfo.js"
	export default {
		data() {
			return {
				titleInfo: {
					titleShow: true,
					title: "隐私协议",
					imageUrl: "http://t73sifiwt.hn-bkt.clouddn.com/pageBack/1.webp",
					heightShow: false,
					backShow: true
				}
			};
		},
		components: {
			pageBack
		}
	}
</script>

<style lang="less" scoped>
	.content {
		padding-bottom: 200rpx;
		position: relative;
		top: 200rpx;
		width: 100%;
		min-height: 300rpx;
		background-color: rgb(255, 251, 241);
		border-radius: 40rpx 40rpx 0 0;
		overflow: hidden;
		padding: 40rpx 0;
	}
</style>