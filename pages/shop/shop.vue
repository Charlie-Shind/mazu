<template>
	<pageBack :titleInfo="titleInfo"></pageBack>
	<view class="content">
		<view class="container">
			<!-- ceshi -->
			<view class="shopName">
				<view class="shopTitle">妈祖周边文创</view>
				<view class="shopEngTitle">Cultural around Mazu</view>
			</view>
			<view class="input">
				<input type="text" />
				<image src="../../static/shop/search.png" mode=""></image>
			</view>
			<view class="recommend">
				<view v-for="(item, index) in gridList" :key="index" :class="{ active: activeIndex === index }" @click="setActiveGrid(index, item)">
					{{ item.grid }}
				</view>
			</view>
			<swiper style="height: 370rpx; margin-bottom: 40rpx" :autoplay="true" :interval="5000" :duration="400">
				<swiper-item v-for="item in recommendList" :key="item.id">
					<view class="recommendItem">
						<view class="item" @click="toShowDetail(item.id)">
							<view class="itemImage">
								<image :src="item.imageUrl[0]" mode="aspectFill"></image>
							</view>
							<view class="itemText">
								<view class="title">
									{{ item.shopname }}
								</view>
								<view class="info">暂未介绍...敬请期待</view>
								<view class="price">
									<view class="left">
										{{ formatPrice(item.price) }}
									</view>
									<view class="right">兑换</view>
								</view>
							</view>
						</view>
					</view>
				</swiper-item>
			</swiper>
			<!-- ceshi -->
			<view class="shop">
				<view class="pubuBox">
					<view class="pubuItem">
						<!-- v-for列表循环 -->
						<view class="item-masonry" v-for="(item, index) in list" :key="index" @click="toShowDetail(item.id)">
							<image :lazy-load="true" :src="item.imageUrl[0]" mode="aspectFill"></image>
							<view class="listtitle">
								<!-- 这是没有高度的父盒子（下半部分） -->
								<view class="listtitle2">
									{{ item.shopname }}
								</view>
								<view class="listtitle3">
									<text>香火值</text>
									{{ formatPrice(item.price) }}
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
	<incense-fab></incense-fab>
	<tabBar></tabBar>
</template>

<script>
import pageBack from '/components/title/title.vue';
import tabBar from '/components/tabbar/tabbar.vue';
import IncenseFab from '/components/incense-fab/incense-fab.vue';
import { getShopListAPI, getShopGridAPI, gridSearchShopAPI } from '/apis/shop.js';
export default {
	data() {
		return {
			titleInfo: {
				titleShow: true,
				title: '商城',
				imageUrl: 'http://t73sifiwt.hn-bkt.clouddn.com/pageBack/1.webp',
				heightShow: false,
				backShow: false
			},
			list: [],
			recommendList: [],
			gridList: [],
			activeIndex: 0
		};
	},
	onLoad() {
		this.getShopList();
	},
	onShow() {
		this.setActiveGrid(0, {
			grid: '全部'
		});
		this.getGrid();
	},
	components: {
		pageBack,
		tabBar,
		IncenseFab
	},
	methods: {
		// ========== 新增：价格格式化方法 ==========
		formatPrice(price) {
			// 完整的容错处理，避免 toFixed 报错
			const num = Number(price);
			// 如果转换失败（非数字），返回 0.00
			return isNaN(num) ? '0.00' : num.toFixed(2);
		},
		// ========== 原有方法 ==========
		// 洗牌算法 进行随机操作
		randomRecommendList(count) {
			const shuffled = [...this.list];
			for (let i = shuffled.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1));
				[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
			}
			return shuffled.slice(0, count);
		},
		setActiveGrid(index, item) {
			this.activeIndex = index;
			gridSearchShopAPI(item.grid)
				.then((res) => {
					// 容错：判断 res.message 是否存在
					if (res && res.message) {
						this.list = res.message.map((item) => {
							return {
								...item,
								imageUrl: JSON.parse(item.imageUrl || '[]') // 容错：imageUrl 为空时解析为空数组
							};
						});
					} else {
						this.list = [];
					}
				})
				.catch((err) => {
					console.error('分类查询失败：', err);
					this.list = [];
				});
		},
		// 获取种类
		getGrid() {
			getShopGridAPI()
				.then((res) => {
					// 容错1：判断 res.message 是否存在
					const originalList = res?.message || [];
					// 过滤掉 "其他" 分类
					const filteredList = originalList.filter((item) => item?.grid !== '其他');

					// 修复核心：shuffleArray 函数必须返回打乱后的数组
					const shuffleArray = (array) => {
						// 先复制数组，避免修改原数组
						const newArray = [...array];
						for (let i = newArray.length - 1; i > 0; i--) {
							const j = Math.floor(Math.random() * (i + 1));
							[newArray[i], newArray[j]] = [newArray[j], newArray[i]]; // 交换元素
						}
						return newArray; // 关键：返回打乱后的数组
					};

					// 容错2：打乱前判断数组是否为空
					const shuffledList = shuffleArray(filteredList);
					// 容错3：slice 前判断数组是否为空，避免 undefined.slice 报错
					const selectedItems = shuffledList.length > 0 ? shuffledList.slice(0, 3) : [];

					this.gridList = [{ grid: '全部' }, ...selectedItems, { grid: '其他' }];
				})
				.catch((err) => {
					console.error('获取分类列表失败：', err);
					// 出错时设置默认分类
				this.gridList = [{ grid: '全部' }, { grid: '其他' }];
				});
		},
		// 获取商品数据
		getShopList() {
			getShopListAPI()
				.then((res) => {
					// 容错：判断 res.message 是否存在
					if (res && res.message) {
						this.list = res.message.map((item) => {
							return {
								...item,
								imageUrl: JSON.parse(item.imageUrl || '[]') // 容错：imageUrl 为空时解析为空数组
							};
						});
						this.recommendList = this.randomRecommendList(5);
					} else {
						this.list = [];
						this.recommendList = [];
					}
				})
				.catch((err) => {
					console.error('获取商品列表失败：', err);
					this.list = [];
					this.recommendList = [];
				});
		},
		// 获取商品页面
		toShowDetail(id) {
			console.log(id);
			uni.navigateTo({
				url: `/secondPages/shopDetail/shopDetail?shopId=${id}`
			});
		}
	},
	onPageScroll(e) {
		if (e.scrollTop >= 80) {
			this.titleInfo.heightShow = true;
		}
		if (e.scrollTop < 80) {
			this.titleInfo.heightShow = false;
		}
	}
};
</script>

<style lang="less" scoped>
.container {
	padding-bottom: 200rpx;
	position: relative;
	top: 200rpx;
	width: 100%;
	min-height: 300rpx;
	background-color: rgb(255, 251, 241);
	border-radius: 40rpx 40rpx 0 0;
	overflow: hidden;

	// 瀑布流
	.shop {
		width: 95%;
		margin: auto;
		font-family: '阿里妈妈方圆体 VF Regular';

		.pubuItem {
			column-count: 2;
			column-gap: 20rpx;
		}

		.item-masonry {
			box-sizing: border-box;
			border-radius: 15rpx;
			overflow: hidden;
			background-color: #fff;
			break-inside: avoid;
			/*避免在元素内部插入分页符*/
			box-sizing: border-box;
			margin-bottom: 20rpx;
			box-shadow: 0px 0px 28rpx 1rpx rgba(78, 101, 153, 0.07);
		}

		.item-masonry image {
			width: 100%;
		}

		.listtitle {
			padding: 22rpx;
			padding-top: 10rpx;
			font-size: 28rpx;

			.listtitle1 {
				line-height: 39rpx;
			}

			.listtitle3 {
				font-size: 40rpx;
				line-height: 32rpx;
				color: rgb(170, 0, 0);
				padding-top: 22rpx;

				text {
					font-size: 32rpx;
				}
			}
		}
	}
}

.shopName {
	font-family: '阿里妈妈方圆体 VF Regular';
	// font-weight: 600;
	padding: 40rpx 20rpx;
	color: #4d0000;

	.shopTitle {
		font-size: 60rpx;
		font-weight: bold;
	}

	.shopEngTitle {
		margin-top: 5rpx;
		font-size: 26rpx;
	}
}

.input {
	font-family: '阿里妈妈方圆体 VF Regular';
	width: 95%;
	height: 80rpx;
	background-color: #fffbf2;
	margin: auto;
	border-radius: 20rpx;
	margin-bottom: 30rpx;
	// margin-top: -20rpx;
	display: flex;
	align-items: center;
	position: relative;
	background-color: #fff;
	box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px;

	input {
		padding-left: 100rpx;
		width: 80%;
		color: #4d0000;
	}

	image {
		position: absolute;
		width: 52rpx;
		height: 52rpx;
		left: 4%;
	}
}

.recommend {
	width: 95%;
	margin: auto;
	display: flex;
	justify-content: space-around;
	align-items: center;
	margin-bottom: 30rpx;
	color: #4d0000;
	font-family: '阿里妈妈方圆体 VF Regular' !important;

	view {
		width: 17%;
		padding: 15rpx 0;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 28rpx;

		&.active {
			// padding: 10rpx 40rpx;
			border-radius: 40rpx;
			color: #fff;
			background-color: #4d0000;
			// transition: background-color 0.3s, top: 		;ransform 0.3s; // 添加过渡效果
		}
	}
}

.recommendItem {
	font-family: '阿里妈妈方圆体 VF Regular' !important;
	width: 95%;
	height: 350rpx;
	margin: auto;
	border-radius: 40rpx !important;
	overflow: hidden;
	box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;

	.item {
		width: 100%;
		height: 100%;
		background-color: #fff;
		display: flex;
		justify-content: space-between;

		.itemImage {
			transform: scale(0.95);
			width: 50%;
			height: 100%;
			display: flex;
			justify-content: center;
			align-items: center;

			image {
				width: 300rpx;
				height: 300rpx;
				border-radius: 40rpx;
			}
		}

		.itemText {
			transform: scale(0.95);
			width: 50%;
			height: 100%;
			// display: flex;
			// flex-direction: column;
			// justify-content: space-around;

			.title {
				width: 320rpx;
				font-size: 40rpx;
				color: #4d0000;
				font-weight: bold;
				height: 100rpx;
				line-height: 100rpx;
				box-sizing: border-box;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				padding-right: 5%;
			}

			.info {
				height: 45%;
				font-size: 22rpx;
			}

			.price {
				height: 25%;
				display: flex;
				justify-content: space-between;
				align-items: center;
				width: 95%;

				.left {
					color: rgb(170, 0, 0);
					font-size: 40rpx;

					text {
						font-size: 32rpx;
					}
				}

				.right {
					padding: 10rpx 25rpx;
					background-color: #4d0000;
					border-radius: 40rpx;
					color: #fff;
					font-size: 30rpx;
				}
			}
		}
	}
}
</style>
