<template>
	<view v-if="contentInfo">
		<pageBack :titleInfo="titleInfo"></pageBack>
		<view class="content">
			<!-- 公益商品使用捐款人信息输入，普通商品使用地址选择 -->
			<template v-if="contentInfo[0]?.grid === '公益'">
				<view class="donor-info">
					<view class="title">
						捐款人信息
					</view>
					<view class="input-group">
						<text class="label">姓名</text>
						<input v-model="donorName" type="text" placeholder="请输入捐款人姓名" />
					</view>
					<view class="input-group">
						<text class="label">联系方式</text>
						<input v-model="donorPhone" type="number" placeholder="请输入捐款人联系方式" />
					</view>
					<view class="input-group">
						<text class="label">捐赠留言</text>
						<input v-model="note" type="text" placeholder="请填写捐赠留言（可选）" />
					</view>
				</view>
			</template>
			<template v-else>
				<view class="address" @click="toEditAdress">
					<view class="left">
						<image src="../../static/dizhi.svg" mode=""></image>
					</view>
					<view class="center" v-if="address">
						<view class="one">
							<text>{{address?.name}}</text>
							<text>{{address?.mobile}}</text>
						</view>
						<view class="two">
							<view>
								<text>{{address?.province_id}}</text>
								<text>{{address?.city_id}}</text>
								<text>{{address?.district_id}}</text>
							</view>
							<view>
								<text>{{address?.remark}}</text>
							</view>
						</view>
					</view>
					<view class="center" v-else style="font-size: 42rpx;">
						<view class="">
							您还没有默认收货地址
						</view>
						<view class="">
							点击去选择收货地址
						</view>
					</view>
					<view class="right"></view>
				</view>
			</template>
			<view class="info">
				<view class="title">
					{{ contentInfo[0]?.grid === '公益' ? '捐赠项目' : '商品信息' }}
				</view>
				<view class="shopInfo">
					<image :src="contentInfo[0]?.imageUrl[0]" mode="aspectFill"></image>
					<view class="shopDetail">
						<view>
							<text
								v-if="contentInfo[0]?.shopname.length>12">{{contentInfo[0]?.shopname.slice(0,13)}}...</text>
							<text v-else>{{contentInfo[0]?.shopname}}</text>
						</view>
						<view class="border">
							<template v-if="contentInfo[0]?.grid === '公益'">
								<text>爱心捐赠</text>
								<text>公益项目</text>
								<text>透明公开</text>
							</template>
							<template v-else>
								<text>退货包运费</text>
								<text>全场包邮</text>
								<text>7天无理由退货</text>
							</template>
						</view>
						<view class="price">
							{{ contentInfo[0]?.grid === '公益' ? '捐赠金额' : '香火值' }} {{contentInfo[0]?.price}} <text>x1</text>
						</view>
					</view>
				</view>
			</view>
			<view class="separate"></view>
			<view class="count">
				<view class="">
					<text>{{ contentInfo[0]?.grid === '公益' ? '捐赠金额款项' : '商品合计（香火值）' }}</text>
					<text>{{contentInfo[0]?.price}}</text>
				</view>
				<view class="" v-if="contentInfo[0]?.grid !== '公益'">
					<text>运费</text>
					<text>0</text>
				</view>
				<view class="" v-if="contentInfo[0]?.grid !== '公益'">
					<text>活动优惠</text>
					<text style="color: rgb(170, 0, 0);">-0</text>
				</view>
				<view class="" v-if="contentInfo[0]?.grid !== '公益'">
					<text>{{ contentInfo[0]?.grid === '公益' ? '捐赠留言' : '备注' }}</text>
					<input v-model="note" type="text" :placeholder="contentInfo[0]?.grid === '公益' ? '请填写捐赠留言' : '请填写备注信息'" />
				</view>
			</view>
		</view>
		<view class="tab" :class="{ isIos: isIos }">
			<view class="view">
				<view class="collection">
					{{ contentInfo[0]?.grid === '公益' ? '所需捐赠金额' : '所需香火值' }} <text>{{contentInfo[0]?.price}}</text>
				</view>
				<view class="buy" @click="commitOrder">
					{{ contentInfo[0]?.grid === '公益' ? '提交捐赠' : '提交兑换' }}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		useUserInfoStore
	} from "/store/userInfo.js"
	import pageBack from "/components/title/title.vue";
	import {
		getShopDetailAPI,
		getAddressAPI,
		getDefaultAddressAPI,
		createOrderAPI
	} from "/apis/shop.js"
	export default {
		data() {
		return {
			titleInfo: {
				titleShow: true,
				title: "创建订单",
				imageUrl: "http://t73sifiwt.hn-bkt.clouddn.com/pageBack/1.webp",
				heightShow: false,
				backShow: true
			},
			contentInfo: {},
			address: {},
			note: "",
			// 捐款人信息字段
			donorName: "",
			donorPhone: ""
		};
		},
		components: {
			pageBack
		},
		onShow() {
			let that = this
			uni.$on('addressData', function(data) {
				that.address = data
			});
		},
		onLoad(option) {
			getShopDetailAPI(option.shopId).then((res) => {
				this.contentInfo = res.message.map((item) => {
					return {
						...item,
						imageUrl: JSON.parse(item.imageUrl)
					}
				})
			});
			this.getDefault()
		},
		onUnload() {
			uni.$off('addressData')
		},
		methods: {
			// 修改收货地址页面
			toEditAdress() {
				uni.navigateTo({
					url: "/secondPages/setAddress/setAddress"
				})
			},
			// 获取默认地址
			getDefault() {
				getDefaultAddressAPI(useUserInfoStore().$state.userInfo.id).then((res) => {
					this.address = res.message[0]
				})
			},
			commitOrder() {
			// 先显示loading  
			uni.showLoading({
				title: "提交订单中",
				mask: true
			});

			setTimeout(() => {
				uni.hideLoading()
				// 检查商品信息  
				if (!this.contentInfo || typeof this.contentInfo === 'undefined' || this.contentInfo.length ===
					0) {
					uni.hideLoading(); // 隐藏loading  
					uni.showToast({
						title: "商品错误，请重新下单",
						icon: "none"
					});
					return;
				}

				// 根据商品类型检查不同的信息
				if (this.contentInfo[0]?.grid === '公益') {
					// 公益商品检查捐款人信息
					if (!this.donorName || !this.donorPhone) {
						uni.hideLoading();
						uni.showToast({
							title: "请填写完整的捐款人信息",
							icon: "none"
						});
						return;
					}
				} else {
					// 普通商品检查地址信息
					if (!this.address || typeof this.address === 'undefined') {
						uni.hideLoading();
						uni.showToast({
							title: "请选择收货地址",
							icon: "none"
						});
						return;
					}
				}

				// 调用API创建订单，根据商品类型传递不同参数
				createOrderAPI({
					user_id: useUserInfoStore().$state.userInfo.id,
					address_id: this.contentInfo[0]?.grid === '公益' ? null : this.address.id,
					payment: this.contentInfo[0].price,
					note: this.note,
					shop_id: this.contentInfo[0].id,
					donor_name: this.donorName,
					donor_phone: this.donorPhone
				}).then((res) => {
					if (res.status == 200) {
						uni.showToast({
							title: res.message,
							mask: true
						})
						setTimeout(() => {
							uni.redirectTo({
								url: `/secondPages/orderPage/orderPage?price=${this.contentInfo[0].price}&order_id=${res.order_no}&grid=${this.contentInfo[0].grid}`
							});
						}, 1000)
					}
				})
			}, 1000)
		}
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
		padding: 20rpx 0;
		font-family: "阿里妈妈方圆体 VF Regular" !important;

		.donor-info {
			width: 90%;
			margin: auto;
			padding: 20rpx 0;

			.title {
				font-weight: bold;
				padding-bottom: 20rpx;
			}

			.input-group {
			display: flex;
			align-items: center;
			height: 100rpx;
			border-bottom: 2rpx solid rgba(0, 0, 0, 0.04);
			width: 100%;

			.label {
				width: 20%;
				font-size: 28rpx;
			}

			input {
				width: 80%;
				font-size: 28rpx;
				height: 60rpx;
				border: none;
				background-color: transparent;
			}
			}
		}

		.address {
			height: 160rpx;
			width: 100%;
			border-bottom: 2rpx solid rgba(0, 0, 0, 0.05);
			display: flex;
			justify-content: space-between;
			align-items: center;
			position: relative;
			padding-bottom: 20rpx;

			.left {
				width: 10%;
				display: flex;
				justify-content: center;
				align-items: center;

				image {
					width: 50rpx;
					height: 50rpx;
				}
			}

			.center {
				width: 80%;
				display: flex;
				flex-direction: column;
				height: 100%;
				justify-content: center;

				.one {
					font-size: 38rpx;
					padding: 10rpx 0;

					text {
						padding-right: 20rpx;
					}
				}

				.two {
					font-size: 24rpx;

					text {
						padding-right: 10rpx;
					}
				}
			}

			.right {
				width: 10%;

				&::after {
					position: absolute;
					content: "\203A";
					font-size: 80rpx;
					right: 3%;
					top: 15%;
				}
			}
		}

		.info {
			padding: 20rpx 0;
			width: 90%;
			margin: auto;

			.title {
				padding-bottom: 20rpx;
			}

			.shopInfo {
				display: flex;
				justify-content: space-between;

				image {
					width: 160rpx;
					height: 160rpx;
					border-radius: 10rpx;
				}

				.shopDetail {
					width: 72%;
					font-weight: bold;

					.border {
						padding: 20rpx 0;

						text {
							font-size: 24rpx;
							padding: 10rpx;
							background-color: rgba(0, 0, 0, 0.05);
							margin-right: 10rpx;
							border-radius: 10rpx;
							font-weight: normal;
						}
					}

					.price {
						font-weight: bold;
						color: rgb(170, 0, 0);

						text {
							color: gray;
							font-weight: normal;
							font-size: 24rpx;
						}
					}
				}
			}
		}

		.separate {
			width: 100%;
			height: 20rpx;
			background-color: rgba(0, 0, 0, 0.04);
		}

		.count {
			width: 90%;
			margin: auto;

			view {
				display: flex;
				align-items: center;
				height: 100rpx;
				font-size: 28rpx;
				border-bottom: 2rpx solid rgba(0, 0, 0, 0.04);
				width: 100%;
				justify-content: space-between;

				input {
					font-size: 24rpx;
					width: 87%;
				}
			}
		}
	}

	.tab::before {
		content: "";
		height: 2rpx;
		width: 100%;
		position: absolute;
		background-color: #00000014;
	}

	.tab {
		background-color: rgb(255, 251, 242);
		z-index: 999;
		position: fixed;
		height: 140rpx;
		width: 100%;
		bottom: 0%;
		left: 0%;

		.view {
			display: flex;
			align-items: center;
			justify-content: space-between;
			height: 140rpx;
			width: 90%;
			margin: auto;

			.collection {
				font-size: 30rpx;
				font-weight: bold;

				text {
					color: rgb(170, 0, 0);
					font-size: 48rpx;
				}
			}

			.buy {
				padding: 20rpx 40rpx;
				background-color: #4d0000;
				color: #fff;
				border-radius: 20rpx;
			}
		}
	}

	.isIos {
		padding-bottom: 20rpx;
	}
</style>