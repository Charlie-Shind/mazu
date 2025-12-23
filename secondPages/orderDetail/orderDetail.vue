<template>
	<pageBack :titleInfo="titleInfo"></pageBack>
	<view class="content">
		<view class="orderList" v-for="item in orderData">
			<view class="item">
				<view class="itemHeader">
					<view>
						<image src="../../static/logo.png" mode="aspectFill"></image>
						福泽海韵官方商城
					</view>
				</view>
				<view class="itemCenter">
					<view class="infoImage">
						<image :src="item.imageUrl[0]" mode="aspectFill"></image>
					</view>
					<view class="info">
						<view class="infoTitle">{{item?.shopname}}</view>
						<view class="infoIntro">{{item?.grid}} - {{item?.shopInfo}}</view>
					</view>
					<view class="price">
						￥<text>{{item?.payment}}</text>
					</view>
				</view>
				<view class="itemBottom">
					<view class="bottomItem" @click="handClick(item,'delete')">
						删除此订单
					</view>
					<view class="bottomItem" @click="handClick(item,'againBuy')">
						再来一单
					</view>
				</view>
			</view>
			<view class="separate"></view>
		</view>
		<view class="orderInfo">
			<view class="info">
				<view class="infoItem">
					<view class="title">
						实付款
					</view>
					<view class="">
						合计￥{{orderData[0].payment}}
					</view>
				</view>
				<view class="infoItem">
					<view class="title">
						订单编号
					</view>
					<view class="">
						{{orderData[0].order_id}}
					</view>
				</view>
				<view class="infoItem">
					<view class="title">
						支付方式
					</view>
					<view class="">
						{{orderData[0].payment_type = 1 ? '商城支付' : '微信支付'}}
					</view>
				</view>
				<view class="infoItem">
					<view class="title">
						支付时间
					</view>
					<view class="">
						{{formatDate(orderData[0].pay_time)}}
					</view>
				</view>
				<view class="infoItem">
					<view class="title">
						下单时间
					</view>
					<view class="">
						{{formatDate(orderData[0].create_time)}}
					</view>
				</view>
				<view class="infoItem">
					<view class="title">
						收货信息
					</view>
					<view class="">
						{{orderData[0].name}}-{{orderData[0].mobile}}
					</view>
				</view>
				<view class="infoItem">
					<view class="title">
						收货地址
					</view>
					<view class="">
						{{orderData[0].province_id}}{{orderData[0].city_id}}{{orderData[0].district_id}}{{orderData[0].remark}}
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import pageBack from "/components/title/title"
	import {
		getOrderInfoAPI
	} from "/apis/shop.js"
	export default {
		data() {
			return {
				titleInfo: {
					titleShow: true,
					title: "订单详情",
					imageUrl: "http://t73sifiwt.hn-bkt.clouddn.com/pageBack/1.webp",
					heightShow: false,
					backShow: true
				},
				orderData: []
			};
		},
		components: {
			pageBack
		},
		onLoad(option) {
			getOrderInfoAPI(option.id).then((res) => {
				this.orderData = res.message.map((item) => {
					return {
						...item,
						imageUrl: JSON.parse(item.imageUrl)
					}
				})
			})
		},
		methods: {
			formatDate(isoDate) {
				const date = new Date(isoDate);
				const year = date.getFullYear();
				const month = String(date.getMonth() + 1).padStart(2, '0');
				const day = String(date.getDate()).padStart(2, '0');
				const hours = String(date.getHours()).padStart(2, '0');
				const minutes = String(date.getMinutes()).padStart(2, '0');
				const seconds = String(date.getSeconds()).padStart(2, '0');
				return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
			},
			handClick(item, status){
				if(status == 'delete'){
					
				}
				if(status == 'againBuy'){
					
				}
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

		.orderList {
			.item {
				width: 90%;
				margin: auto;
				padding: 40rpx 0;

				.itemHeader {
					display: flex;
					justify-content: space-between;
					align-items: center;

					view {
						display: flex;
						align-items: center;
						font-size: 28rpx;

						image {
							height: 50rpx;
							width: 50rpx;
							border-radius: 100%;
							margin-right: 20rpx;
						}
					}

					text {
						font-size: 24rpx;
						color: gray;
					}
				}

				.itemCenter {
					display: flex;
					justify-content: space-between;
					padding: 20rpx 0;
					align-items: center;

					.infoImage {
						width: 160rpx;
						height: 160rpx;

						image {
							width: 100%;
							height: 100%;
							border-radius: 20rpx;
						}
					}

					.info {
						width: 360rpx;

						.infoTitle {
							font-size: 36rpx;
							font-weight: bold;
							overflow: hidden;
							text-overflow: ellipsis;
							display: -webkit-box;
							-webkit-line-clamp: 2;
							-webkit-box-orient: vertical;
							padding-bottom: 10rpx;
						}

						.infoIntro {
							overflow: hidden;
							text-overflow: ellipsis;
							white-space: nowrap;
						}
					}

					.price {
						text {
							font-size: 42rpx;
							font-weight: bold;
						}
					}
				}

				.itemBottom {
					padding-top: 20rpx;
					display: flex;
					width: 100%;
					justify-content: flex-end;

					.bottomItem {
						padding: 10rpx 20rpx;
						border: rgba(0, 0, 0, 0.4) 2rpx solid;
						border-radius: 20rpx;
						margin-left: 20rpx;
						font-size: 24rpx;
					}
				}
			}
		}

		.orderInfo {
			width: 90%;
			margin: auto;

			.infoItem {
				display: flex;
				align-items: start;
				justify-content: space-between;
				padding: 20rpx 0;
				text-align: right;

				.title {
					color: #ababab;
					width: 30%;
					text-align: left;
				}

				view:last-child {
					width: 70%;
				}
			}
		}
	}

	.separate {
		width: 100%;
		height: 20rpx;
		background-color: rgba(0, 0, 0, 0.04);
	}
</style>