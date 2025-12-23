<template>
	<pageBack :titleInfo="titleInfo"></pageBack>
	<view class="content2">
		<view class="wxImage">
			<!-- 	<image src="../../static/wx.jpg" mode="" @longpress="handleLongPress"></image> -->
			<image :show-menu-by-longpress="true" src="http://t73sifiwt.hn-bkt.clouddn.com/wx.jpg" @click="previewImage" mode="aspectFit"></image>
		</view>
	</view>
</template>

<script>
	import {
		onMounted,
		onUnmounted
	} from 'vue';
	import pageBack from "/components/title/title.vue";

	export default {
		data() {
			return {
				titleInfo: {
					titleShow: true,
					title: "联系开发者",
					imageUrl: "http://t73sifiwt.hn-bkt.clouddn.com/pageBack/3.webp",
					heightShow: false,
					backShow: true
				},
				isShaking: false
			};
		},
		components: {
			pageBack
		},
		methods: {
			previewImage(e) {
				console.log('e', e);
				uni.previewImage({
					// 需要预览的图片链接列表
					urls: [],
					// 为当前显示图片的链接/索引值
					current: 'http://t73sifiwt.hn-bkt.clouddn.com/wx.jpg',
					// 图片指示器样式	
					indicator: 'default',
					// 是否可循环预览
					loop: false,
					// 长按图片显示操作菜单，如不填默认为保存相册
					// longPressActions:{
					// 	itemList:[this.l('发送给朋友'),this.l]
					// },
					success: res => {
						console.log('res', res);
					},
					fail: err => {
						console.log('err', err);
					}
				});
			}

			// handleLongPress() {
			// 	uni.scanCode({
			// 		onlyFromCamera: true,
			// 		success: (res) => {
			// 			// 获取扫描结果  
			// 			const contactInfo = {
			// 				firstName: '开发者',
			// 				photoFilePath: '/static/wx.jpg',
			// 				weChatNumber: res.result
			// 			};
			// 			// 添加微信好友  
			// 			uni.addPhoneContact({
			// 				...contactInfo,
			// 				success: () => {
			// 					this.showQRCodeTips('添加成功');
			// 				},
			// 				fail: () => {
			// 					this.showQRCodeTips('添加失败');
			// 				}
			// 			});
			// 		},
			// 		fail: () => {
			// 			this.showQRCodeTips('扫描失败');
			// 		}
			// 	});
			// },
			// showQRCodeTips(message) {
			// 	uni.showModal({
			// 		title: '提示',
			// 		content: message,
			// 		showCancel: false,
			// 		confirmText: '知道了'
			// 	});
			// }
		}
	};
</script>

<style lang="less">
	html {
		background-color: #fff !important;
	}

	page {
		background-color: #fff !important;
	}

	.content2 {
		padding-bottom: 200rpx;
		position: relative;
		top: 200rpx;
		width: 100%;
		min-height: 300rpx;
		background-color: #fff;
		border-radius: 40rpx 40rpx 0 0;
		overflow: hidden;
		padding: 40rpx 0;

		.wxImage {
			display: flex;
			justify-content: center;
			align-items: center;
			padding: 50rpx 0;
			position: relative;

			&::after {
				font-family: '阿里妈妈数黑体 Bold' !important;
				content: '长按扫码添加开发者微信';
				position: absolute;
				bottom: 30rpx;
				color: #666;
				font-size: 32rpx;
				text-align: center;
				width: 100%;
				height: 200rpx;
				background-color: #fff;
				line-height: 200rpx;
			}

			image {
				height: 900rpx;
				border-radius: 20rpx;
				object-fit: contain;
			}
		}
	}
</style>