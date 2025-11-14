<template>
	<pageBack :titleInfo="titleInfo"></pageBack>
	<view class="content">
		<view class="payMoney">
			<view>
				支付金额
			</view>
			<view class="money">
				<text>￥</text>{{price}}
			</view>
		</view>
		<view class="payToast">
			30分钟内未支付系统将自动取消订单
		</view>
		<view class="payMent">
			<view class="mentItem" v-for="item in patMent" :class="{ active: currentPaymentMethod === item.id }"
				@click="selectPaymentMethod(item.id)">
				<image :src="item.svg" mode=""></image>
				<view class="ment">
					{{item.name}}
				</view>
				<view class="radio" :class="{ 'active': currentPaymentMethod === item.id }"></view>
			</view>
		</view>
		<view class="payButton">
			<view class="" @click="confirmPay">
				确认支付
			</view>
		</view>
	</view>
</template>

<script>
	import pageBack from "/components/title/title.vue";
	import {
		useUserInfoStore
	} from "/store/userInfo.js"
	import {
		shopPayMoneyAPI
	} from "../../apis/shop.js"
	export default {
		data() {
			return {
				titleInfo: {
					titleShow: true,
					title: "支付",
					imageUrl: "https://mazu-1320314698.cos.ap-guangzhou.myqcloud.com/pageBack/1.webp",
					heightShow: false,
					backShow: true
				},
				patMent: [{
						id: 1,
						name: `余额支付(${useUserInfoStore().$state.userInfo.balance})`,
						svg: "/static/shopPay.svg"
					},
					{
						id: 2,
						name: "微信支付",
						svg: "/static/weChat.svg"
					}
				],
				price: null,
				order_id: null,
				currentPaymentMethod: null
			};
		},
		components: {
			pageBack
		},
		onLoad(options) {
			this.price = options.price
			this.order_id = options.order_id
		},
		methods: {
			selectPaymentMethod(id) {
				this.currentPaymentMethod = id;
			},
			// 支付按钮
			confirmPay() {
				if (this.currentPaymentMethod === null) {
					// 用户没有选择支付方式  
					uni.showToast({
						title: "请选择付款方式",
						icon: "none"
					});
					return;
				}
				uni.showLoading({
					title: "付款中",
					mask: true
				});
				setTimeout(() => {
					switch (this.currentPaymentMethod) {
						case 1:
							shopPayMoneyAPI({
								pay_money: this.price,
								pay_ment: this.currentPaymentMethod,
								order_id: this.order_id,
								user_id: useUserInfoStore().$state.userInfo.id
							}).then((res) => {
								if (res.status == 200) {
									// 更新pinia数据
									useUserInfoStore().$state.userInfo.balance = res.new_balance
									uni.showToast({
										title: res.message,
										mask: true
									})
									setTimeout(() => {
										uni.navigateBack({
											delta: 1
										})
									}, 1000)
								} else {
									uni.showToast({
										title: res.message,
										icon: 'none',
										mask: true
									})
								}
							})
							break;
						case 2:
							console.log("微信支付");
							break;
						default:
							return uni.showToast({
								title: "未知错误 请联系管理员",
								icon: 'none'
							})
							break;
					}
				}, 1000)
			},
		},

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
		padding: 20rpx 0;
		font-family: "阿里妈妈方圆体 VF Regular" !important;

		.payMoney {
			text-align: center;
			padding: 40rpx 0;

			.money {
				padding: 20rpx 0;
				font-size: 56rpx;
				font-weight: bold;
				letter-spacing: 4rpx;

				text {
					font-size: 40rpx;
				}
			}
		}

		.payToast {
			text-align: center;
			color: rgb(140, 0, 0);
		}

		.payMent {
			width: 80%;
			margin: auto;

			.mentItem {
				display: flex;
				justify-content: space-between;
				height: 100rpx;
				align-items: center;
				border-bottom: 2rpx solid rgba(0, 0, 0, 0.1);
				padding: 20rpx 0;

				&.active {
					.radio {
						&.active {
							background-color: #4d0000;
							border-color: #4d0000;
						}
					}
				}

				image {
					width: 60rpx;
					height: 60rpx;
					border-radius: 100%;
				}

				.ment {
					width: 70%;
					text-align: left;
					font-size: 34rpx;
				}

				.radio {
					width: 40rpx;
					height: 40rpx;
					border: 2rpx solid #000;
					border-radius: 100%;
				}
			}
		}

		.payButton {
			padding: 40rpx 0;
			width: 100%;
			height: 160rpx;
			display: flex;
			justify-content: center;
			align-items: center;

			view {
				width: 70%;
				height: 100rpx;
				background-color: #4d0000;
				color: #fff;
				display: flex;
				justify-content: center;
				align-items: center;
				border-radius: 20rpx;
			}
		}
	}
</style>