<template>
	<!-- 广告遮罩 -->
	<maskPage @mask-closed="onMaskClosed" v-if="!isMaskLoaded"></maskPage>
	<!-- AR -->
	<!-- <img
		@click="to('/secondPages/ARView/ARView')"
		style="position: absolute; z-index: 999; height: 60rpx; width: 60rpx; top: 6%; left: 5%"
		src="https://java-ai-ch.oss-cn-beijing.aliyuncs.com/images/AR%E6%89%AB%E4%B8%80%E6%89%AB.svg"
		alt=""
	/> -->
	<img @click="to('/secondPages/ARView/ARView')" style="position: absolute; z-index: 999; height: 60rpx; width: 60rpx; top: 6%; left: 5%" src="/static/AR.png" alt="" />
	<!-- ai -->
	<img
		@click="to('/secondPages/ai-chat/ai-chat')"
		style="position: absolute; z-index: 999; height: 60rpx; width: 60rpx; top: 6%; left: 15%"
		src="https://javaweb-ai-ch.oss-cn-beijing.aliyuncs.com/2025/12/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20251224142708_799_2552.png"
		alt=""
	/>

	<view class="page" v-if="isMaskLoaded">
		<!-- 顶部标题 -->
		<pageBack :titleInfo="titleInfo"></pageBack>
		<view class="content">
			<!-- 轮播图 -->
			<view class="carousel">
				<swiper class="carouselSwiper" :autoplay="true" :interval="5000" :duration="1000">
					<swiper-item v-for="item in swiperData" :key="item.id">
						<view class="swiper-item">
							<image :src="item.imageUrl" class="swiper-img"></image>
							<view class="gradient-overlay"></view>
						</view>
					</swiper-item>
				</swiper>
			</view>
			<view class="container">
				<!-- 轮播图上的卡片 -->
				<view class="show">
					<image style="position: absolute; height: 100%" src="http://t73sifiwt.hn-bkt.clouddn.com/index/indexShowBack.gif" mode=""></image>
					<view class="showInfo">
						<view class="title">湄洲妈祖祖庙</view>
						<view class="info">三亿妈祖敬仰者的精神明灯</view>
					</view>
					<image class="backImage" src="http://t73sifiwt.hn-bkt.clouddn.com/index/indexShowRight.png" mode=""></image>
					<view class="showBottom">
						<view class="showLeft" @click.stop="to('/secondPages/webview/webview-2')">
							<image src="http://t73sifiwt.hn-bkt.clouddn.com/index/tianhoumiao.png" mode=""></image>
							<text>天后庙</text>
						</view>
						<view class="showRight" @click.stop="to('/secondPages/webview/webview')">
							<image src="http://t73sifiwt.hn-bkt.clouddn.com/index/tianhougong.png" mode=""></image>
							<view class="text">
								<view>
									<text>天后宫</text>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="tabGrid">
					<view class="item" v-for="item in gridData" @click="toIconPage(item)" :key="item.id">
						<view class="itemIamge">
							<image :src="item.imageUrl" mode=""></image>
						</view>
						<view class="itemText">
							{{ item.text }}
						</view>
					</view>
				</view>
				<view class="mazuDynamics">
					<view class="moreContentTop">
						<view class="title">
							<text class="titleFirst">妈祖动态</text>
							<text class="titleSecond">Mazu News</text>
						</view>
						<view class="more" @click="to('/secondPages/news/news')">更多</view>
					</view>
					<view class="mazuDynamics-bottom">
						<view>
							<scroll-view class="scroll-view_H" scroll-x="true" @scroll="scroll" scroll-with-animation="false">
								<view class="scroll-view-item_H" v-for="(item, index) in news.slice(7, 15)" @click="toPage(item, '新闻中心')">
									<image :src="item.imageUrl" mode="aspectFill"></image>
									<view class="itemInfoText">{{ item.title }}</view>
								</view>
							</scroll-view>
						</view>
					</view>
				</view>
				<view class="mazuCulturalcreativity">
					<view class="moreContentTop">
						<view class="title">
							<text class="titleFirst">文创作品</text>
							<text class="titleSecond">Mazu Creativity</text>
						</view>
						<view class="more" @click="to('/secondPages/cultureCreativity/cultureCreativity')">更多</view>
					</view>
					<view class="mazuCulturalcreativity-bottom">
						<view>
							<scroll-view class="scroll-view_H" scroll-x="true" @scroll="scroll" scroll-with-animation="false">
								<view class="scroll-view-item_H" v-for="(item, index) in creativity" @click="toPage(item, '妈祖文创')">
									<image :src="item.imageUrl" mode="aspectFill"></image>
									<view class="itemInfoText">
										<view>
											{{ item.title }}
										</view>
										<view class="rich-text" v-html="item.content"></view>
									</view>
								</view>
							</scroll-view>
						</view>
					</view>
				</view>
				<!-- ========================================= 精彩推荐 ========================================== -->
				<view class="mazuCulturalcreativity">
					<view class="moreContentTop">
						<view class="title">
							<text class="titleFirst">精彩推荐</text>
							<text class="titleSecond">Recommendation</text>
						</view>
					</view>
					<view class="recommend">
						<view class="pubuBox">
							<view class="pubuItem">
								<view class="item-masonry" v-for="(item, index) in list" :key="index" @click="detail(item)">
									<image :src="item.imageUrl[0]" mode="widthFix"></image>
									<view class="listtitle">
										<!-- 这是没有高度的父盒子（下半部分） -->
										<view class="listtitle2">
											{{ item.title }}
										</view>
										<view class="listtitle3">
											<image :src="item.avatarurl" mode=""></image>
											{{ item.nickname }}
										</view>
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
	</view>
</template>

<script>
import { getCarouselAPI, getCreativityAPI, getRecommendAPI, getindexGridNewsAPI, getindexGridCultureCreativityAPI } from '/apis/index.js';
import { getCommunityItemAPI } from '/apis/community.js';
import tabBar from '/components/tabbar/tabbar.vue';
import pageBack from '/components/title/title.vue';
import maskPage from '/components/mask/mask.vue';
import IncenseFab from '/components/incense-fab/incense-fab.vue';
export default {
	data() {
		return {
			// 轮播图数据
			swiperData: [],
			// grid宫格数据
			gridData: [
				{
					id: 1,
					imageUrl: 'http://t73sifiwt.hn-bkt.clouddn.com/index/icon/new.svg',
					text: '新闻中心',
					url: '/secondPages/news/news'
				},
				{
					id: 2,
					imageUrl: 'http://t73sifiwt.hn-bkt.clouddn.com/index/icon/fu.svg',
					text: '福文化',
					url: '/secondPages/fuCulture/fuCulture'
				},
				{
					id: 3,
					imageUrl: 'http://t73sifiwt.hn-bkt.clouddn.com/index/icon/xin.svg',
					text: '信俗活动',
					url: '/secondPages/faith/faith'
				},
				{
					id: 4,
					imageUrl: 'http://t73sifiwt.hn-bkt.clouddn.com/index/icon/ma.svg',
					text: '妈祖文化',
					url: '/secondPages/mazuCulture/mazuCulture'
				},
				{
					id: 5,
					imageUrl: 'http://t73sifiwt.hn-bkt.clouddn.com/index/icon/miao.svg',
					text: '天下宫庙',
					url: '/secondPages/palaceTemple/palaceTemple'
				},
				{
					id: 6,
					imageUrl: 'http://t73sifiwt.hn-bkt.clouddn.com/index/icon/shu.svg',
					text: '数字出版',
					url: '/secondPages/publication/publication'
				},
				{
					id: 7,
					imageUrl: 'http://t73sifiwt.hn-bkt.clouddn.com/index/icon/wen.svg',
					text: '妈祖文创',
					url: '/secondPages/cultureCreativity/cultureCreativity'
				},
				{
					id: 8,
					imageUrl: 'http://t73sifiwt.hn-bkt.clouddn.com/index/icon/you.svg',
					text: '两岸旅游',
					url: '/secondPages/tourism/tourism'
				}
			],
			// 妈祖动态数据
			news: [],
			// 文创作品数据
			creativity: [],
			// 瀑布流数据
			list: [],
			titleInfo: {
				titleShow: true,
				title: '福泽海韵',
				heightShow: false,
				imageUrl: ''
			},
			isMaskLoaded: false,
			navBlocked: false
		};
	},
	components: {
		pageBack,
		tabBar,
		maskPage,
		IncenseFab
	},
	onLoad() {
		// 获取轮播图数据
		getCarouselAPI().then((res) => {
			this.swiperData = res.message;
		});
		// 获取推荐数据
		getCommunityItemAPI().then((res) => {
			console.log(res);
			this.list = res.message.map((item) => {
				return {
					...item,
					imageUrl: JSON.parse(item.imageUrl)
				};
			});
			console.log(this.list);
			this.list.sort(() => Math.random() - 0.5);
		});
		// 获取妈祖动态
		getindexGridNewsAPI().then((res) => {
			this.news = res.message.map((item) => {
				return {
					...item,
					imageUrl: JSON.parse(item.imageUrl)
				};
			});
		});
		// 获取文创作品
		getindexGridCultureCreativityAPI().then((res) => {
			this.creativity = res.message.map((item) => {
				return {
					...item,
					imageUrl: JSON.parse(item.imageUrl)
				};
			});
		});
	},
	methods: {
		onMaskClosed() {
			// 显示加载中提示
			uni.showLoading({
				title: '页面加载中请稍后...',
				mask: true
			});

			// 开始阻断点击
			this.navBlocked = true;

			// 延迟结束阻断
			setTimeout(() => {
				this.isMaskLoaded = true;
				this.navBlocked = false;

				// 关闭加载提示
				uni.hideLoading();
			}, 5000);
		},
		to(url) {
			uni.navigateTo({ url });
		},
		// 其他导航也做同样检查
		toIconPage(item) {
			uni.navigateTo({
				url: item.url + `?pageType=${item.text}`
			});
		},
		toPage(item, type) {
			const { id, grid } = item;
			uni.navigateTo({
				url: `/secondPages/gridDetail/gridDetail?pageType=${type}&pageId=${id}&pageGrid=${grid}`
			});
		},
		detail(item) {
			uni.navigateTo({
				url: `/secondPages/communityDetail/communityDetail?postId=${item.id}`
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
.carousel {
	margin-bottom: -200rpx;

	.carouselSwiper {
		width: 100%;
		height: 600rpx;

		.swiper-item {
			position: relative;
			width: 100%;
			height: 600rpx;

			image {
				width: 100%;
				height: 530rpx;
				object-fit: cover;
			}

			.gradient-overlay {
				position: absolute;
				bottom: 0;
				left: 0;
				right: 0;
				height: 100%;
				background: linear-gradient(to bottom, rgba(255, 255, 255, 0) 40%, rgb(255, 251, 242) 100%);
			}
		}
	}
}

.container {
	position: relative;
	width: 95%;
	margin: auto;

	.show {
		width: 98%;
		margin: auto;
		height: 350rpx;
		background-color: #fffbf2;
		border-radius: 20rpx;
		box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
		display: flex;
		justify-content: center;
		position: relative;

		.backImage {
			position: absolute;
			width: 40%;
			height: 150rpx;
			top: 0%;
			right: 0%;
		}

		.showInfo {
			width: 400rpx;
			height: 100rpx;
			position: absolute;
			left: 40rpx;
			top: 30rpx;
			line-height: 46rpx;
			font-family: '妈祖祖庙' !important;

			.title {
				font-weight: 500;
				font-size: 52rpx;
				color: #4d0000;
			}

			.info {
				font-size: 24rpx;
				color: #838383;
			}
		}

		.showBottom {
			width: 95%;
			height: 200rpx;
			padding: 20rpx;
			align-self: flex-end;
			display: flex;
			justify-content: space-between;
			z-index: 16;

			.showLeft {
				position: relative;
				height: 100%;
				width: 30%;
				// background: linear-gradient(-20deg, #fbfcdb 0%, #FFFBF2 100%);
				border-radius: 10rpx;
				overflow: hidden;

				image {
					position: absolute;
					bottom: 0%;
					right: -10%;
					width: 100%;
					height: 100%;
				}

				text {
					color: #7a0000;
					writing-mode: vertical-lr;
					font-family: '妈祖祖庙' !important;
					margin: 10rpx 20rpx;
					// letter-spacing: -5rpx;
					font-size: 32rpx;
					font-weight: bold;
				}
			}

			.showRight {
				height: 100%;
				width: 65%;
				border-radius: 10rpx;
				overflow: hidden;
				position: relative;

				image {
					width: 100%;
					height: 100%;
					position: absolute;
					bottom: 0%;
					right: 0%;
				}

				.text {
					margin-top: 20rpx;

					view {
						margin-top: -10rpx;

						text {
							color: #7a0000;
							font-family: '妈祖祖庙' !important;
							margin: 0 20rpx;
							font-weight: bold;
							font-size: 32rpx;
						}
					}
				}
			}
		}
	}

	.tabGrid {
		margin: 40rpx 0;
		width: 100%;
		height: 280rpx;
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		grid-gap: 20rpx;
		justify-items: center;
		align-items: center;
		color: #565656;
		font-family: '阿里妈妈方圆体2' !important;
		font-weight: 600;

		.item {
			width: 120rpx;
			height: 120rpx;
			// background-color: #000000;
			border-radius: 20rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			flex-direction: column;
			font-size: 24rpx;

			image {
				width: 90rpx;
				height: 90rpx;
				border-radius: 10rpx;
			}

			.itemText {
				transform: scale(0.9);
			}
		}
	}

	.moreContentTop {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		font-family: '阿里妈妈数黑体 Bold' !important;
		margin: 20rpx 0;

		.title {
			font-size: 40rpx;

			.titleFirst {
				position: relative;
			}

			.titleFirst::before {
				content: '';
				position: absolute;
				width: 2rpx;
				height: 100%;
				right: -20rpx;
				background-color: #e8e8e8;
			}

			.titleSecond {
				margin-left: 40rpx;
				color: #b4b4b4;
				font-size: 30rpx;
				font-family: 'siyuan' !important;
				font-weight: 300 !important;
			}
		}

		.more {
			font-size: 24rpx;
			font-family: '阿里妈妈方圆体 VF Regular' !important;
			font-weight: bold;

			&::after {
				content: '\203A';
				font-size: 46rpx;
				vertical-align: sub;
			}
		}
	}

	.mazuDynamics {
		width: 95%;
		margin: auto;

		.mazuDynamics-bottom {
			.scroll-view_H {
				white-space: nowrap;
				width: 100%;
			}

			.scroll-view-item_H {
				display: inline-block;
				width: 400rpx;
				height: 300rpx;
				text-align: center;
				margin-right: 20rpx;
				position: relative;
				border-radius: 10rpx;
				overflow: hidden;

				image {
					width: 100%;
					height: 100%;
				}

				.itemInfoText {
					font-family: normal;
					font-size: 24rpx;
					white-space: nowrap;
					text-overflow: ellipsis;
					position: absolute;
					color: #fff;
					bottom: 5%;
					left: 3%;
					width: 370rpx;
					overflow: hidden;
				}
			}
		}
	}

	.mazuCulturalcreativity {
		width: 95%;
		margin: auto;
		margin-top: 60rpx;

		.mazuCulturalcreativity-bottom {
			.scroll-view_H {
				white-space: nowrap;
				width: 100%;
			}

			.scroll-view-item_H {
				display: inline-block;
				width: 100%;
				height: 400rpx;
				text-align: center;
				background-color: pink;
				margin-right: 20rpx;
				position: relative;
				border-radius: 10rpx;
				overflow: hidden;

				image {
					width: 100%;
					height: 100%;
				}

				.itemInfoText {
					text-align: left;
					font-family: normal;
					font-size: 24rpx;
					white-space: nowrap;
					text-overflow: ellipsis;
					position: absolute;
					color: #fff;
					bottom: 5%;
					left: 5%;
					width: 620rpx;
					overflow: hidden;

					view {
						overflow: hidden;
						text-overflow: ellipsis;
					}
				}
			}
		}
	}
}

// 瀑布流
.pubuBox {
	margin-top: 10rpx;
}

// 瀑布流
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
	box-shadow: 0px 0px 28rpx 1rpx rgba(78, 101, 153, 0.14);
}

.item-masonry image {
	width: 100%;
}

.listtitle {
	padding-left: 22rpx;
	padding-right: 22rpx;
	font-size: 24rpx;
	padding-bottom: 22rpx;

	.listtitle1 {
		line-height: 39rpx;
	}

	.listtitle3 {
		font-size: 24rpx;
		color: #909399;
		line-height: 32rpx;
		padding-top: 22rpx;
		display: flex;
		align-items: center;

		image {
			width: 32rpx;
			margin-right: 10rpx;
			height: 32rpx;
			border-radius: 100%;
		}

		font-size: 24rpx;
		color: #909399;
		line-height: 32rpx;
		padding-top: 22rpx;
	}
}
.swiper-img {
	object-fit: cover;
}
</style>
