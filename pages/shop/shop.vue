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
						<!-- v-for列表循环 ✅核心修改：判断是否公益分类，切换静态图/接口图 -->
						<view class="item-masonry" v-for="(item, index) in list" :key="index" @click="toShowDetail(item.id)">
							<image :lazy-load="true" :src="activeGridName === '公益' ? staticImgList[index % staticImgList.length] : item.imageUrl[0]" mode="aspectFill"></image>
							<view class="listtitle">
								<view class="listtitle2">
									{{ item.shopname }}
								</view>
								<view class="listtitle3">
									<text>爱心值</text>
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
			activeIndex: 0,
			activeGridName: '全部', // ✅新增：记录当前选中的分类名称
			// ✅新增：你的8张公益静态图片地址 完整保留
			staticImgList: [
				"https://java-ai-ch.oss-cn-beijing.aliyuncs.com/80e2fd9ef24effee752512adfa510fa9.jpg",
				"https://java-ai-ch.oss-cn-beijing.aliyuncs.com/ff59f72d6dd7553974a67b0f9bdeaa5f.jpg",
				"https://java-ai-ch.oss-cn-beijing.aliyuncs.com/dc5eeb8220085d40ac92870d36e25f47.jpg",
				"https://java-ai-ch.oss-cn-beijing.aliyuncs.com/ce99e3bb8a518c78e125db3e679b1c54.jpg",
				"https://java-ai-ch.oss-cn-beijing.aliyuncs.com/4ef8a58c70eaa82f2b7bbabc78e5f022.jpg",
				"https://java-ai-ch.oss-cn-beijing.aliyuncs.com/99ab73a598a00013403781c59b2dfe24.png",
				"https://java-ai-ch.oss-cn-beijing.aliyuncs.com/a78c50ef3df1256278ab813f380b76f3.png",
				"https://java-ai-ch.oss-cn-beijing.aliyuncs.com/3e66ba63898238a9704182b0701819d5.png"
			]
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
		// ========== 价格格式化方法 ==========
		formatPrice(price) {
			const num = Number(price);
			return isNaN(num) ? '0.00' : num.toFixed(2);
		},
		// ========== 洗牌算法 进行随机操作 ==========
		randomRecommendList(count) {
			// 第一步：先过滤掉 分类为【公益】的商品，公益项目彻底不参与轮播
			const filterNoPublic = [...this.list].filter(item => item.grid !== '公益');
			// 第二步：对过滤后的非公益商品数组，执行原有的洗牌随机排序算法
			const shuffled = [...filterNoPublic];
			for (let i = shuffled.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1));
				[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
			}
			// 第三步：截取指定数量的随机商品返回
			return shuffled.slice(0, count);
		},
		// ✅修改：新增记录当前选中的分类名称
		setActiveGrid(index, item) {
			this.activeIndex = index;
			this.activeGridName = item.grid; // 记录当前点击的分类名称
			gridSearchShopAPI(item.grid)
				.then((res) => {
					if (res && res.message) {
						this.list = res.message.map((item) => {
							return {
								...item,
								imageUrl: JSON.parse(item.imageUrl || '[]')
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
					const originalList = res?.message || [];
					const filteredList = originalList.filter((item) => item?.grid !== '其他');

					const shuffleArray = (array) => {
						const newArray = [...array];
						for (let i = newArray.length - 1; i > 0; i--) {
							const j = Math.floor(Math.random() * (i + 1));
							[newArray[i], newArray[j]] = [newArray[j], newArray[i]];
						}
						return newArray;
					};

					const shuffledList = shuffleArray(filteredList);
					const selectedItems = shuffledList.length > 0 ? shuffledList.slice(0, 3) : [];

					this.gridList = [{ grid: '全部' }, ...selectedItems, { grid: '其他' }];
				})
				.catch((err) => {
					console.error('获取分类列表失败：', err);
					this.gridList = [{ grid: '全部' }, { grid: '其他' }];
				});
		},
		// 获取商品数据
		getShopList() {
			getShopListAPI()
				.then((res) => {
					if (res && res.message) {
						this.list = res.message.map((item) => {
							return {
								...item,
								imageUrl: JSON.parse(item.imageUrl || '[]')
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
