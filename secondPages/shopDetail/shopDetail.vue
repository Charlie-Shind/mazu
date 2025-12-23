<template>
	<pageBack :titleInfo="titleInfo"></pageBack>
	<view class="content">
		<swiper v-for="(item,index) in contentInfo" class="shopSwiper">
			<swiper-item v-for="(list,index) in item.imageUrl.length">
				<image :src="item.imageUrl[index]" mode="aspectFill"></image>
			</swiper-item>
		</swiper>
		<view class="">
		</view>
		<view class="contentInfo">
			<view class="price">
				<view class="">
					<text>{{ contentInfo[0]?.grid === '公益' ? '捐款金额' : '香火值' }}</text><text style="margin: 0 10rpx;">{{contentInfo[0]?.price}}</text><text>{{ contentInfo[0]?.grid === '公益' ? '元' : '兑换' }}</text>
				</view>
			</view>
			<view class="shopName">
				<text v-if="contentInfo[0]?.grid !== '公益'">旗舰店</text>
				{{contentInfo[0]?.shopname}}
			</view>
			<view class="introduce">
				<template v-if="contentInfo[0]?.grid === '公益'">
					<text>爱心捐赠</text>
					<text>·</text>
					<text>公益项目</text>
					<text>·</text>
					<text>透明公开</text>
					<text>·</text>
					<text>感谢支持</text>
				</template>
				<template v-else>
					<text>退货包运费</text>
					<text>·</text>
					<text>全场包邮</text>
					<text>·</text>
					<text>7天无理由退货</text>
					<text>·</text>
					<text>极速退款</text>
				</template>
			</view>
		</view>
		<view class="separate"></view>
		<view class="shopDetail">
			<view class="detail">
				<text class="detailTitle">{{ contentInfo[0]?.grid === '公益' ? '公益背景' : '产品详情' }}</text>
				<view class="detailInfo">{{ contentInfo[0]?.grid === '公益' ? '暂无公益项目介绍...' : '暂无介绍...' }}</view>
				<view v-for="item in contentInfo[0].imageUrl">
					<image :src="item" mode="aspectFill"></image>
				</view>
			</view>
		</view>
	</view>
	<view class="tab" :class="{ isIos: isIos }">
		<view class="view">
			<view class="collection">
				<image :src="imageJudge ? '../../static/shoucang_active.svg' : '../../static/shoucang.svg'"
					@click="collect" mode=""></image>
			</view>
			<view class="buy" @click="toBuy">
				{{ contentInfo[0]?.grid === '公益' ? '捐赠款项' : '立即兑换' }}
			</view>
		</view>
	</view>
</template>

<script>
	import pageBack from "/components/title/title.vue";
	import {
		useUserInfoStore
	} from "@/store/userInfo.js"
	import {
		getShopDetailAPI,
		collectGoodsAPI,
		judgeCollectAPI
	} from "/apis/shop.js"
	export default {
		data() {
			return {
				titleInfo: {
					titleShow: true,
					title: "商品详情",
					imageUrl: "http://t73sifiwt.hn-bkt.clouddn.com/pageBack/1.webp",
					heightShow: false,
					backShow: true
				},
				contentInfo: {},
				isIos: false,
				shopId: null,
				// 收藏图标判断
				imageJudge: null
			};
		},
		components: {
			pageBack
		},
		mounted() {
			// 判断是否ios
			if (uni.getSystemInfoSync().platform == 'ios' || uni.getSystemInfoSync().platform == 'devtools') {
				this.isIos = true
			}
		},
		onLoad(option) {
			// 获取商品详情
				getShopDetailAPI(option.shopId).then((res) => {
					this.contentInfo = res.message.map((item) => {
						return {
							...item,
							imageUrl: JSON.parse(item.imageUrl)
						}
					})
					// 设置动态标题
					this.titleInfo.title = this.contentInfo[0]?.grid === '公益' ? '公益项目' : '商品详情'
				})
			this.shopId = option.shopId

			// 获取商品是否收藏
			judgeCollectAPI({
				user_id: useUserInfoStore().$state.userInfo.id,
				goods_id: option.shopId
			}).then((res) => {
				this.imageJudge = res.judge
			})
		},
		onPageScroll(e) {
			if (e.scrollTop >= 80) {
				this.titleInfo.heightShow = true
			}
			if (e.scrollTop < 80) {
				this.titleInfo.heightShow = false
			}
		},
		methods: {
			toBuy() {
				uni.navigateTo({
					url: `/secondPages/commitOrder/commitOrder?shopId=${this.shopId}`
				})
			},
			// 收藏
			collect() {
				if (!useUserInfoStore().$state.userInfo.id) {
					// 用户未登录,跳转到登录页面  
					uni.navigateTo({
						url: '/pages/login/login'
					});
					return;
				}
				if (this.imageJudge) {
					// 取消收藏的逻辑  
					this.collectGoods(useUserInfoStore().$state.userInfo.id, this.contentInfo[0].id, false)
				} else {
					// 收藏的逻辑  
					this.collectGoods(useUserInfoStore().$state.userInfo.id, this.contentInfo[0].id, true)
				}
			},
			//收藏api
			collectGoods(user_id, goods_id, judge) {
				collectGoodsAPI({
					user_id,
					goods_id,
					judge
				}).then((res) => {
					if (res.status == 200) {
						this.imageJudge = !this.imageJudge;
						uni.showToast({
							title: res.message
						})
					}
				});
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
		// padding: 40rpx 0;
		font-family: "阿里妈妈方圆体 VF Regular" !important;

		.shopSwiper {
			width: 100%;
			height: 600rpx;

			image {
				width: 100%;
				height: 100%;
			}
		}

		.contentInfo {
			padding: 20rpx 0;
			width: 95%;
			margin: auto;

			.price {
				color: rgb(182, 0, 0);
				display: flex;
				justify-content: space-between;
				align-items: center;
				font-weight: bold;

				text {
					font-size: 32rpx;
				}

				text:nth-child(2) {
					font-size: 60rpx;
					margin-right: 20rpx;
				}

				text:last-child {
					color: gray;
				}
			}

			.shopName {
				padding: 10rpx 0;
				font-size: 38rpx;
				font-weight: bold;
				line-height: 48rpx;

				text {
					font-size: 32rpx;
					background-color: bisque;
					padding: 10rpx;
					border-radius: 10rpx;
					color: #000;
					font-weight: bold;
				}
			}

			.introduce {
				display: flex;
				height: 80rpx;
				align-items: center;
				font-size: 28rpx;
				color: gray;
				position: relative;

				&::after {
					position: absolute;
					content: "\203A";
					font-size: 46rpx;
					right: 0%;
					top: 2%;
				}
			}
		}

		.separate {
			width: 100%;
			height: 20rpx;
			background-color: rgba(0, 0, 0, 0.04);
		}

		.shopDetail {
			padding: 20rpx 0;
			width: 95%;
			margin: auto;

			.detailTitle {
				font-weight: bold;
			}

			.detailInfo {
				padding: 40rpx 0;
			}

			image {
				width: 100%;
				height: 700rpx;
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
				width: 100rpx;
				height: 100rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				background-color: rgb(255, 247, 228);
				border-radius: 10rpx;

				image {
					width: 70rpx;
					height: 70rpx;
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