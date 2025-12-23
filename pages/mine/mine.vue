<template>
	<!-- <view class="shade" v-if="shade">
		<image class="one" v-show="one" src="../../static/红包.svg" mode="" @click="toTwo"></image>
		<image class="two" v-show="two" src="../../static/红包2.svg" mode="" @click="end"></image>
	</view> -->
	<pageBack :titleInfo="titleInfo"></pageBack>
	<view class="content">
		<view class="container">
			<view class="userInfo" v-if="userInfo && Object.keys(userInfo).length > 0">
				<view class="userHeader">
					<view class="headerLeft" @click="toSet">
						<image :src="userInfo.avatarurl" mode=""></image>
						<view class="name">
							<view>
								{{userInfo.nickname}}
							</view>
							<view>
								已连续签到{{signDays}}天
							</view>
							<view>
								当前香火值：{{userInfo.balance || 0}} 点
							</view>
						</view>
					</view>
					<view class="headerRight" @click="signIn()">
						<!-- 立即签到 -->
						立即签到
					</view>
				</view>
			</view>
			<view class="userInfo" v-else>
				<view class="login">
					<view class="loginBtn" @click="toLogin">
						立即登录
					</view>
				</view>
			</view>
			<view class="set">
				<view class="item" v-for="item in otherPage" @click="toPage(item.id,item.url)">
					<view class="itemLeft">
						<image :src="item.svg" mode=""></image>
						{{item.name}}
					</view>
					<view class="itemRight"></view>
				</view>
			</view>
		</view>
	</view>
	<incense-fab></incense-fab>
	<tabBar></tabBar>
	<!-- 	<view class="sign" v-if="sign">
		<image v-if="signSuccess" src="../../static/签到成功.svg" mode=""></image>
		<image v-if="signError" src="../../static/error.svg" mode=""></image>
	</view> -->
</template>

<script>
	import pageBack from "/components/title/title.vue";
	import tabBar from "/components/tabbar/tabbar.vue";
	import IncenseFab from '/components/incense-fab/incense-fab.vue';
	import {
		useUserInfoStore
	} from "@/store/userInfo.js"
	import {
		checkBalanceZeroAPI,
		addBalanceAPI,
		signInAPI,
		getContinuousSignInDaysAPI
	} from "../../apis/user.js"
	export default {
		data() {
			return {
				titleInfo: {
					titleShow: true,
					title: "我的",
					imageUrl: "http://t73sifiwt.hn-bkt.clouddn.com/pageBack/2.webp",
					heightShow: false,
					height: 100
				},
				otherPage: [{
						id: 1,
						name: "我的订单",
						svg: "/static/mine/order.svg",
						url: "/secondPages/myOrder/myOrder"
					},
					{
						id: 2,
						name: "我的证书",
						svg: "/static/mine/order.svg",
						url: "/secondPages/myCertificate/myCertificate"
					},
					// {
					// 	id: 2,
					// 	name: "我的收藏",
					// 	svg: "/static/mine/hezuo.svg",
					// 	url: "/secondPages/agreement/agreement"
					// },
					{
						id: 3,
						name: "游览历史",
						svg: "/static/mine/history.svg",
						url: "/secondPages/tourHistory/tourHistory"
					},
					{
						id: 4,
						name: "联系开发者",
						svg: "/static/mine/kaifa.svg",
						url: "/secondPages/contact/contact"
					},
					{
						id: 5,
						name: "账户设置",
						svg: "/static/mine/set.svg",
						url: "/secondPages/accountSet/accountSet"
					},
					{
						id: 6,
						name: "我的发布",
						svg: "/static/mine/post.svg",
						url: "/secondPages/myPost/myPost"
					}
				],
				userInfo: {},
				shade: false,
				one: false,
				two: false,
				signSuccess: false,
				signError: false,
				sign: false,
				signDays: ""
			};
		},
		components: {
			pageBack,
			tabBar,
			IncenseFab
		},
		onShow() {
			this.userInfo = useUserInfoStore().$state.userInfo
			checkBalanceZeroAPI(this.userInfo.openid).then((res) => {
				this.shade = !res.message
				this.one = !res.message
			})
			this.getDays()
		},
		methods: {
			getDays() {
				getContinuousSignInDaysAPI(this.userInfo.openid).then(res => {
					this.signDays = res.continuousDays
				})
			},
			toTwo() {
				uni.showLoading({
					title: "开启红包中"
				})
				setTimeout(() => {
					uni.clearStorage(),
						uni.hideLoading(),
						this.one = false,
						this.two = true,
						uni.showToast({
							title: "红包开启成功",
							mask: true
						})
				}, 1000)
			},
			end() {
				uni.showLoading({
					title: "领取中"
				})
				addBalanceAPI(this.userInfo.openid).then((res) => {
					if (res.status == 200) {
						uni.hideLoading();
						this.userInfo.balance = 10000;
						this.two = false;
						this.shade = false;
						uni.showToast({
							title: "恭喜你领取成功！",
							mask: true
						})
					} else {
						this.two = false,
							this.shade = false,
							uni.showToast({
								title: "领取失败",
								icon: "error",
								mask: true
							})
					}
				})
			},
			signIn() {
				signInAPI(this.userInfo.openid).then((res) => {
					if (res.status == 2002) {
						this.getDays()
						uni.showModal({
							title: "提示",
							content: "签到成功",
							showCancel: false
						})
					} else {
						this.getDays()
						uni.showModal({
							title: "提示",
							content: res.message,
							showCancel: false,
							icon: "error"
						})
					}
				})
			},
			toLogin() {
				uni.navigateTo({
					url: "/pages/login/login"
				})
			},
			loginOut() {
				uni.showLoading({
					title: "退出登录中"
				})
				setTimeout(() => {
					uni.clearStorage(),
						this.userInfo = {},
						useUserInfoStore().$reset(),
						uni.hideLoading(),
						uni.showToast({
							title: "成功退出登录",
							mask: true
						})
				}, 1000)
			},
			toSet() {
				uni.navigateTo({
					url: "/secondPages/accountSet/accountSet",
				})
			},
			toPage(id, url) {
				uni.navigateTo({
					url: url
				})
			},
		},
		onPageScroll(e) {
			if (e.scrollTop >= 80) {
				this.titleInfo.heightShow = true
			}
			if (e.scrollTop < 80) {
				this.titleInfo.heightShow = false
			}
		},
	};
</script>

<style lang="less" scoped>
	.sign {
		position: absolute;
		z-index: 999;
		width: 100%;
		height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		top: 0%;
		left: 50%;
		transform: translateX(-50%);

		image {
			width: 100%;
			margin-bottom: 200rpx;
		}
	}

	.shade {
		position: absolute;
		z-index: 999;
		width: 100%;
		height: 100vh;
		display: flex;
		align-items: center;
		background-color: rgba(0, 0, 0, 0.8);
		justify-content: center;

		image {
			width: 100%;
			transform: scale(1.5);
			margin-bottom: 200rpx;
		}
	}

	.container {
		position: relative;
		top: 200rpx;
		width: 100%;
		background-color: #FFFBF2;
		border-radius: 40rpx 40rpx 0 0;
		font-family: "阿里妈妈方圆体 VF Regular";

		.userInfo {
			padding: 40rpx 0;
			width: 95%;
			margin: auto;

			.login {
				width: 100%;
				height: 100%;
				display: flex;
				justify-content: center;
				align-items: center;

				.loginBtn {
					width: 260rpx;
					height: 80rpx;
					background-color: #4d0000;
					color: #FFFBF2;
					font-size: 38rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					border-radius: 100rpx;
					margin: auto;
					margin-top: 20rpx;
				}
			}

			.userHeader {
				display: flex;
				align-items: center;
				justify-content: space-between;
				color: #4d0000;

				.headerLeft {
					display: flex;
					align-items: center;

					image {
						width: 120rpx;
						height: 120rpx;
						border-radius: 100%;
					}

					.name {
						padding-left: 20rpx;

						view:first-child {
							font-size: 50rpx;
						}

						view:last-child {
							font-size: 24rpx;
						}
					}
				}

				.headerRight {
					font-size: 28rpx;
					padding: 10rpx 20rpx;
					color: #FFFBF2;
					background-color: #4d0000;
					border-radius: 10rpx;
				}
			}
		}

		.set {
			width: 95%;
			margin: auto;

			.item {
				height: 80rpx;
				border-bottom: 2rpx solid #dddad2;
				line-height: 80rpx;
				padding: 16rpx 0;
				display: flex;
				justify-content: space-between;

				.itemLeft {
					image {
						width: 50rpx;
						height: 50rpx;
						vertical-align: middle;
					}
				}

				.itemRight {
					position: relative;

					&::after {
						position: absolute;
						content: "\203A";
						font-size: 58rpx;
						right: 0%;
						top: 0%;
					}
				}
			}
		}
	}
</style>