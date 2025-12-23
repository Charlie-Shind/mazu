<template>
	<pageBack :titleInfo="titleInfo"></pageBack>
	<view class="content">
		<view class="newsInfo">
			<view class="title">
				<image src="../../static/logo.png" mode="aspectFill"></image>
				<text># 两岸旅游版块</text>
			</view>
			<view class="infoContent">
				{{list.length}} 篇内容 · 无论您是想单独游览台湾还是大陆,还是希望体验两岸之间的文化交流,这个板块都能为您提供全面的旅游信息和建议。欢迎您规划您的两岸旅行!
			</view>
		</view>
		<view class="sort">

		</view>
		<view class="news">
			<view class="title">
				<view v-for="(item,index) in titles" :class="{active: currentIndex === index}" @click="toSwiper(index)">
					{{item}}
				</view>
			</view>
			<swiper :current="currentIndex" @change="onSwiperChange" :style="{ height: swiperHeight + 'px' }">
				<swiper-item v-for="(item2,index) in newsGridNews">
					<view class="itemBox">
						<view class="item" v-for="item in item2" @click="toPage(item)">
							<view class="itemLeft">
								<view class="itemTitle">
									{{item.title}}
								</view>
								<view class="itemInfo">
									{{item.time}}
								</view>
							</view>
							<view class="itemRight">
								<image :lazy-load="true" :src="item.imageUrl[0]" mode="aspectFill"></image>
							</view>
						</view>
					</view>
				</swiper-item>
			</swiper>
		</view>
	</view>
</template>
<script>
	import pageBack from "/components/title/title.vue";
	import {
		getindexGridTourismAPI
	} from "@/apis/index.js"

	export default {
		data() {
			return {
				titleInfo: {
					titleShow: true,
					title: "两岸旅游",
					imageUrl: "http://t73sifiwt.hn-bkt.clouddn.com/pageBack/1.webp",
					heightShow: false,
					backShow: true
				},
				titles: [],
				currentIndex: 0, // 当前选中的标题索引
				list: [{
					title: "不止只有冰雕，几千年前的“东北人”还能把他整“活”了",
					time: "2024/06/07",
					imageUrl: "/static/logo.png"
				}],
				swiperHeight: 0,
				gridNews: {},
				newsGridNews: [{}, {}, {}],
			};
		},
		components: {
			pageBack
		},
		onLoad(option) {
			this.pageType = option.pageType
		},
		onReady() {
			getindexGridTourismAPI().then((res) => {
				// map遍历操作
				this.list = res.message.map((item) => {
					return {
						...item,
						// 解析图片字符串
						imageUrl: JSON.parse(item.imageUrl),
						// 调用formatDate函数解析时间
						time: this.formatDate(item.time)
					};
				});
				// map将数据中的所有分类提取出 ，filter过滤掉undefined，使用set去重
				this.titles = [...new Set(this.list.map(item => item.grid))].filter(grid => grid !== undefined);
				this.list.forEach(item => {
					const {
						grid
					} = item;
					if (!this.gridNews[grid]) {
						this.gridNews[grid] = [];
					}
					this.gridNews[grid].push(item);
				});
				this.newsGridNews = Object.values(this.gridNews)
				this.toSwiper(0)
			});
		},
		methods: {
			toSwiper(index) {
				this.currentIndex = index;
				this.getItemHeight(this.newsGridNews[index].length)
			},
			onSwiperChange(e) {
				this.currentIndex = e.detail.current;
				this.getItemHeight(this.newsGridNews[e.detail.current].length)
			},
			getItemHeight(count) {
				const query = uni.createSelectorQuery().in(this)
				query.select('.itemBox').boundingClientRect(data => {
					// this.swiperHeight = this.list.length * data.height
					this.swiperHeight = count * data.height
				}).exec()
			},
			formatDate(isoDate) {
				const date = new Date(isoDate);
				const year = date.getFullYear();
				const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，所以加1
				const day = String(date.getDate()).padStart(2, '0');
				const hours = String(date.getHours()).padStart(2, '0');
				const minutes = String(date.getMinutes()).padStart(2, '0');
				const seconds = String(date.getSeconds()).padStart(2, '0');
				return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
			},
			toPage(item) {
				const {
					grid,
					id
				} = item
				uni.navigateTo({
					url: `/secondPages/gridDetail/gridDetail?pageType=${this.pageType}&pageId=${id}&pageGrid=${grid}`
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
		padding: 40rpx 0;

		.newsInfo {
			width: 90%;
			margin: auto;
			font-family: "妈祖祖庙" !important;

			.title {
				display: flex;
				align-items: center;
				color: #4d0000;
				font-size: 36rpx;

				image {
					width: 40rpx;
					height: 40rpx;
					border-radius: 100%;
					margin-right: 20rpx;
				}
			}

			.infoContent {
				padding: 10rpx 0;
				color: #9d9d9d;
				font-size: 30rpx;
				text-indent: 2em;
			}
		}

		.sort {
			width: 90%;
			margin: auto;
			height: 60rpx;
		}

		.news {
			width: 90%;
			margin: auto;

			.title {
				display: flex;
				overflow-x: auto;
				-webkit-overflow-scrolling: touch;
				scrollbar-width: none;
				/* Firefox */
				-ms-overflow-style: none;
				/* IE and Edge */

				&::-webkit-scrollbar {
					display: none;
					/* Chrome, Safari, Opera */
				}

				view {
					flex-shrink: 0;
					text-align: center;
					font-size: 30rpx;
					font-family: "妈祖祖庙", sans-serif;
					padding: 10rpx 20rpx;
					border-radius: 20rpx;
					white-space: nowrap;
				}

				view.active {
					color: #fff;
					background-color: #4d0000;
				}
			}

			.itemBox {
				width: 100%;
				height: 160rpx;
				padding: 20rpx 0;

				.item {
					width: 100%;
					height: 160rpx;
					padding: 20rpx 0;
					border-bottom: 2rpx solid #eeeeee;
					display: flex;
					justify-content: space-between;
					align-items: center;

					.itemLeft {
						width: 70%;
						height: 100%;
						display: flex;
						flex-direction: column;
						justify-content: space-between;

						.itemTitle {
							font-family: "阿里妈妈方圆体 VF Regular" !important;
							font-weight: bold;
							margin-top: 25rpx;
							font-size: 28rpx;
							letter-spacing: 2rpx;
							display: -webkit-box;
							-webkit-box-orient: vertical;
							-webkit-line-clamp: 2;
							overflow: hidden;
							text-overflow: ellipsis;
							line-height: 36rpx;
						}

						.itemInfo {
							color: #9d9d9d;
							font-size: 24rpx;
							margin-bottom: 25rpx;
						}
					}

					.itemRight {
						width: 25%;
						height: 100%;
						display: flex;
						justify-content: center;
						align-items: center;

						image {
							width: 140rpx;
							height: 140rpx;
						}
					}
				}
			}
		}
	}
</style>