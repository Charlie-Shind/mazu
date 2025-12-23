<template>
	<view v-if="show">
		<pageBack :titleInfo="titleInfo"></pageBack>
		<view class="content">
			<view class="selectBar">
				<view v-for="(item, index) in selectBar" :key="item.id" @click="selectItem(index,item)"
					:class="{ active: selectIndex === index }" class="selectItem">
					{{ item.name }}
				</view>
			</view>
			<view v-if="orderList.length > 0" class="orderList" v-for="item in orderList">
				<view class="item">
					<view class="itemHeader">
						<view>
							<image src="../../static/logo.png" mode="aspectFill"></image>
							福泽海韵官方商城
						</view>
						<text :style="{ color: getStatusColor(item.order_status) }">
							{{ getStatusText(item.order_status) }}
						</text>
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
						<view class="bottomItem" v-if="item.order_status === 0" @click="handClick(item,'delete')">
							删除订单
						</view>
						<view class="bottomItem" v-if="item.order_status === 0 || item.order_status === 10"
							@click="handClick(item,'check')">
							查看订单
						</view>
						<view class="bottomItem" v-if="item.order_status === 10" @click="handClick(item,0)">
							取消订单
						</view>
						<view class="bottomItem redBorder" v-if="item.order_status === 10">
							前往支付
						</view>
						<view class="bottomItem" v-if="item.order_status === 20 || item.order_status === 30"
							@click="handClick(item,'check')">
							查看订单
						</view>
						<view class="bottomItem confirm" v-if="item.order_status === 20 || item.order_status === 30"
							@click="handClick(item,40)">
							确认收货
						</view>
						<view class="bottomItem" v-if="item.order_status === 40" @click="handClick(item,'delete')">
							删除订单
						</view>
						<view class="bottomItem" v-if="item.order_status === 40" @click="handClick(item,'check')">
							查看订单
						</view>
						<!-- <view class="bottomItem" v-if="item.order_status === 40">
							退换/售后
						</view> -->
						<view class="bottomItem redBorder" v-if="item.order_status === 40" @click="againBuy(item.id)">
							再次购买
						</view>
					</view>
				</view>
				<view class="separate"></view>
			</view>
			<view v-else class="noData">
				<image src="../../static/order.svg" mode=""></image>
				<view class="">
					您还没有相关订单哦~
				</view>
			</view>
		</view>
	</view>
	<uni-popup ref="popup" type="dialog">
		<uni-popup-dialog :type="type" cancelText="取消" confirmText="确定" title="提示" :content="content"
			@confirm="confirmDeleteImage" @close="dialogClose"></uni-popup-dialog>
	</uni-popup>
</template>

<script>
	import pageBack from "/components/title/title.vue";
	import {
		useUserInfoStore
	} from "@/store/userInfo.js";
	import {
		getShopOrderAPI,
		deleteShopOrderAPI,
		editOrderAPI
	} from "/apis/shop.js"
	export default {
		data() {
			return {
				titleInfo: {
					titleShow: true,
					title: "我的订单",
					imageUrl: "http://t73sifiwt.hn-bkt.clouddn.com/pageBack/1.webp",
					heightShow: false,
					backShow: true
				},
				selectBar: [{
						id: 1,
						name: "全部",
						type: null
					},
					{
						id: 2,
						name: "待付款",
						type: 10
					},
					{
						id: 3,
						name: "待收货",
						type: 20
					},
					{
						id: 4,
						name: "已完成",
						type: 40
					},
					{
						id: 5,
						name: "已取消",
						type: 0
					}
				],
				selectIndex: 0, // 初始选中第一个,
				orderList: [],
				show: false,
				content: "hello",
				msgType: 'success',
				type: 'info',
				orderItem: [],
				orderStatus: null
			};
		},
		components: {
			pageBack
		},
		onShow() {
			this.getShopOrder(null)
		},
		methods: {
			selectItem(index, item) {
				if (this.selectIndex === index) return; // 如果点击的是当前选中的 tab，则不执行任何操作  
				this.selectIndex = index; // 更新选中的索引  
				this.getShopOrder(item.type);
			},
			getShopOrder(params) {
				getShopOrderAPI(params).then((res) => {
					this.orderList = res.message.map((item) => {
						return {
							...item,
							imageUrl: JSON.parse(item.imageUrl)
						}
					})
					this.show = true
				})
			},
			getStatusColor(status) {
				switch (status) {
					case 10:
						return 'red';
					case 20:
					case 30:
						return 'green';
					case 40:
						return 'black';
					case 0:
						return 'gray';
					default:
						return 'black';
				}
			},
			getStatusText(status) {
				switch (status) {
					case 10:
						return '待付款';
					case 20:
					case 30:
						return '待收货';
					case 40:
						return '已完成';
					case 0:
						return '已取消';
					default:
						return '未知';
				}
			},
			handClick(item, status) {
				this.orderItem = item
				this.orderStatus = status
				switch (status) {
					case 0:
						this.$refs.popup.open();
						this.content = "是否取消该订单";
						this.type = 'info';
						break;
					case 40:
						this.$refs.popup.open();
						this.content = "是否确认收货";
						this.type = 'success';
						break;
					case 'delete':
						this.$refs.popup.open();
						this.content = "是否确认删除该订单";
						this.type = 'warn';
						break;
					case 'check':
						uni.navigateTo({
							url: `/secondPages/orderDetail/orderDetail?id=${item.order_id}`
						})
					default:
						break;
				}
			},
			// 取消
			dialogClose() {
				this.$refs.popup.close();
			},
			// 确认  
			confirmDeleteImage() {
				this.$refs.popup.close();
				this.judgeFunction(this.orderItem, this.orderStatus);
			},

			// 各类接口调用  
			judgeFunction(item, status) {
				// 调用修改接口  
				if (status == 0 || status == 40) {
					editOrderAPI({
						editCode: status,
						id: item.order_id,
						order_no: item.order_no
					}).then((res) => {
						uni.showToast({
							title: res.message
						})
						this.getShopOrder(null); // 重新获取订单列表数据  
					})
				}
				// 调用删除接口  
				if (status == 'delete') {
					deleteShopOrderAPI({
						id: item.order_id,
						user_id: item.user_id,
						order_no: item.order_no,
					}).then((res) => {
						uni.showToast({
							title: '删除成功'
						})
						this.getShopOrder(null); // 重新获取订单列表数据  
					})
				}
			},
			// 再次购买
			againBuy(shopId) {
				uni.navigateTo({
					url: `/secondPages/shopDetail/shopDetail?shopId=${shopId}`
				})
			}
		},
		onPageScroll(e) {
			if (e.scrollTop >= 80) {
				this.titleInfo.heightShow = true
			}
			if (e.scrollTop < 80) {
				this.titleInfo.heightShow = false
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

		.noData {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			padding: 200rpx 0;

			view {
				font-size: 32rpx;
				color: #4d0000;
				// padding: 50rpx 0;
				font-weight: bold;
			}
		}

		.selectBar {
			display: flex;
			justify-content: space-around;
			align-items: center;
			height: 80rpx;

			.selectItem {
				width: 20%;
				display: flex;
				justify-content: center;
				align-items: center;
				transition: transform 0.1s; // 添加过渡效果

				&.active {
					transform: scale(1.3); // 放大效果
					font-weight: bold;
					color: #7a0000;
					transition: transform 0.1s; // 添加过渡效果
				}
			}
		}

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
	}

	.separate {
		width: 100%;
		height: 20rpx;
		background-color: rgba(0, 0, 0, 0.04);
	}

	.redBorder {
		border: red 2rpx solid !important;
		color: red;
	}

	.confirm {
		border: #7a0000 2rpx solid !important;
		color: #fff;
		background-color: #7a0000;
	}
</style>