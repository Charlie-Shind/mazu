<template>
	<view class="content">
		<image class="imageBack"
			src="http://t73sifiwt.hn-bkt.clouddn.com/index/1040g2sg3170fnkhck4dg5p68qdqap5st2d183v0%21nd_dft_wlteh_webp_3.webp"
			mode="aspectFill">
		</image>
		<view class="logo">
			<image src="../../static/logo.png" mode=""></image>
			<view class="text">
				福泽海韵
			</view>
		</view>
		<view class="loginBtn" @click="login">
			微信登录
		</view>
	</view>
</template>

<script>
	import {
		getOpenIdAPI,
		wxLoginAPI,
		userVisitCountAPI
	} from "@/apis/user.js"
	import {
		useUserInfoStore
	} from "@/store/userInfo.js"
	import {
		useCounterStore
	} from "@/store/switchTab.js";
	export default {
		data() {
			return {

			};
		},
		methods: {
			back() {
				uni.navigateBack({
					delta: 1
				})
			},
			login() {
				uni.showLoading({
					mask: true,
					title: '登陆中'
				})
				uni.login({
					provider: 'weixin',
					success: function(loginRes) {
						console.log(1123)
						// 登录成功
						uni.getUserInfo({
							provider: 'weixin',
							success: function(info) {
								getOpenIdAPI(loginRes.code).then((res) => {
									console.log(loginRes.code)
									if (res.status == 200) {
										wxLoginAPI({
											openid: res.message.openid,
											nickname: info.userInfo.nickName,
											avatarurl: info.userInfo.avatarUrl,
											gender: info.userInfo.gender
										}).then((res) => {
											if (res.status == 200) {
												uni.setStorageSync('isLoggedIn',
													true);
												uni.setStorageSync('token',
													res.token);
												useUserInfoStore().$state
													.userInfo = res.user
												useCounterStore().$state
													.currentTab = 4;
												setTimeout(() => {
													uni.switchTab({
														url: "/pages/mine/mine"
													})
												}, 1000)
												userVisitCountAPI(res.user.id)
													.then((res) => {
														console.log(res
															.message);
														uni.showToast({
															title: '登录成功',
															mask: true
														})
													})
											} else {
												uni.showToast({
													title: res.message,
													icon: "error"
												})
											}
										})
									} else {
										uni.showToast({
											title: res.message.errmsg,
											icon: "error"
										})
									}
								}).catch((err) => {
									uni.showToast({
										title: err,
										icon: "error"
									})
								})
							}
						})
					},
					fail: function(err) {
						// 登录授权失败
						// err.code是错误码
						uni.showToast({
							title: err,
							icon: "error"
						})
					},
				});
			}
		}
	}
</script>

<style lang="less">
	.content {
		height: 100vh;
		width: 100vw;
		position: relative;
		font-family: "妈祖祖庙" !important;

		.imageBack {
			height: 100%;
			width: 100%;
			position: absolute;
		}

		.logo {
			position: absolute;
			top: 15%;
			left: 50%;
			transform: translateX(-50%);
			color: #fff;

			image {
				width: 240rpx;
				height: 240rpx;
				border-radius: 20rpx;
			}

			.text {
				text-align: center;
				font-weight: bold;
				font-size: 60rpx;
			}
		}

		.loginBtn {
			color: #4d0000;
			font-size: 46rpx;
			padding: 10rpx 20rpx;
			width: 450rpx;
			height: 80rpx;
			background-color: #f8f8f8;
			display: flex;
			justify-content: center;
			align-items: center;
			border-radius: 100rpx;
			position: absolute;
			bottom: 15%;
			left: 50%;
			transform: translateX(-50%);
		}
	}
</style>