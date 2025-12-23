<template>
	<pageBack :titleInfo="titleInfo"></pageBack>
	<view class="content">
		<view class="payMoney">
			<view>
					{{ grid === '公益' ? '捐赠所需金额' : '兑换所需香火值' }}
			</view>
			<view class="money">
					<text>{{ grid === '公益' ? '金额' : '香火值' }}</text>{{price}}
			</view>
		</view>
		<view class="payToast">
			30分钟内未兑换系统将自动取消订单
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
					title: "兑换",
					imageUrl: "http://t73sifiwt.hn-bkt.clouddn.com/pageBack/1.webp",
					heightShow: false,
					backShow: true
				},
				patMent: [{
					id: 1,
					name: `香火值兑换（可用：${useUserInfoStore().$state.userInfo.balance}）`,
					svg: "/static/shopPay.svg"
				}],
				price: null,
				order_id: null,
				grid: null,
				currentPaymentMethod: 1
			};
		},
		components: {
			pageBack
		},
		onLoad(options) {
			this.price = options.price
			this.order_id = options.order_id
			this.grid = options.grid
			// 根据商品类型更新页面文本
			if (this.grid === '公益') {
				this.titleInfo.title = '捐赠'
				this.patMent[0].name = `金额捐赠`
			}
		},
		methods: {
			selectPaymentMethod(id) {
				this.currentPaymentMethod = id;
			},
			// 支付按钮
			confirmPay() {
				uni.showLoading({
					title: this.grid === '公益' ? "捐赠中" : "兑换中",
					mask: true
				});
				setTimeout(() => {
					// 公益商品特殊处理：直接成功，等价增加用户香火值
					if (this.grid === '公益') {
						uni.hideLoading();
						// 等价增加用户香火值（捐赠金额=增加的香火值）
						const store = useUserInfoStore();
						const donatedAmount = Number(this.price);
						store.$state.userInfo.balance = Number(store.$state.userInfo.balance || 0) + donatedAmount;
						
						uni.showToast({
							title: "捐赠成功",
							mask: true
						})
						setTimeout(() => {
							uni.navigateBack({
								delta: 1
							})
						}, 1000)
					} else {
						// 普通商品原有逻辑
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
							default:
								return uni.showToast({
									title: "未知错误 请联系管理员",
									icon: 'none'
								})
								break;
						}
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