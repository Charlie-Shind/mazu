<template>
	<pageBack :titleInfo="titleInfo"></pageBack>
	<view class="content">
		<view class="inputBox">
			<view class="input" @click="navigatoPage('/secondPages/search/search')">
				<!-- <input type="text" /> -->
				<image src="../../static/shop/search.png" mode=""></image>
			</view>
			<view class="add" @click="navigatoPage('/secondPages/communityAdd/communityAdd')">+</view>
		</view>
		<view class="container">
			<swiper :interval="5000" :duration="300">
				<swiper-item v-for="(item, index) in groupedRecommend" :key="item.id">
					<view class="recommend">
						<view v-for="list in item" @click="toPage(list)">
							<view class="item" v-if="list">
								<view class="itemTop">
									<view class="itemHeader">
										<image src="../../static/logo.png" mode=""></image>
									</view>
									<view class="itemTitle">{{ list.name.slice(0, 4) }}..</view>
								</view>
								<view class="itemBottom">
									<view class="textTitle">"{{ list.name }}"</view>
									<view class="people">{{ list.comment_users }}人参与讨论</view>
								</view>
							</view>
						</view>
					</view>
				</swiper-item>
			</swiper>
			<view class="communityContent">
				<view class="hotTopic">
					<view class="topicContent">
						<view class="topicTitle">
							<!-- 热门话题 -->
							话题推荐
						</view>
						<view class="topicContent">
							<view class="topicItem" v-for="(item, index) in sortByCommentUsers(topicRecommend).slice(0, 4)" @click="toPage(item)">
								<image :src="`../../static/community/序号${index + 1}.svg`" mode=""></image>
								<view class="text">
									<view class="textContent">
										<view>#{{ item.name }}</view>
										<view class="info">{{ item.comment_users }}人参与讨论·{{ item.topic_length * 3 }}点热度</view>
									</view>
									<view class="more"></view>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="contentGrid">
					<view class="refresh">
						<view>看看大家的圈子吧~</view>
						<view @click="refresh()">
							<image src="../../static/community/刷新.svg" mode=""></image>
						</view>
					</view>
					<view class="">
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
		</view>
	</view>
	<incense-fab></incense-fab>
	<tabBar></tabBar>
</template>

<script>
import { getCommunityItemAPI, getCommunityTopicAPI } from '../../apis/community.js';
import pageBack from '/components/title/title.vue';
import tabBar from '/components/tabbar/tabbar.vue';
import IncenseFab from '/components/incense-fab/incense-fab.vue';

export default {
	data() {
		return {
			titleInfo: {
				titleShow: true,
				title: '社区',
				imageUrl: 'http://t73sifiwt.hn-bkt.clouddn.com/pageBack/4.jpg',
				heightShow: false,
				height: 300
			},
			recommend: [
				{
					id: 1,
					imageUrl: '/static/shop/fu1.jpg',
					title: '妈祖百科',
					text: '妈祖文化讨论',
					people: '3843'
				},
				{
					id: 2,
					imageUrl: '/static/shop/shoulian1.jpg',
					title: '妈祖庙宇',
					text: '妈祖庙宇交流区',
					people: '121'
				},
				{
					id: 3,
					imageUrl: '/static/shop/fu1.jpg',
					title: '妈祖百科',
					text: '妈祖文化讨论',
					people: '384'
				}
			],
			topicRecommend: [],
			list: []
		};
	},
	onLoad() {
		// 获取推荐数据
		getCommunityItemAPI().then((res) => {
			this.list = res.message.map((item) => {
				return {
					...item,
					imageUrl: JSON.parse(item.imageUrl)
				};
			});
			this.refresh();
		});
		// 获取话题
		getCommunityTopicAPI().then((res) => {
			this.topicRecommend = res.message;
		});
	},
	components: {
		pageBack,
		tabBar,
		IncenseFab
	},
	computed: {
		groupedRecommend() {
			const groups = [];
			for (let i = 0; i < this.topicRecommend.length; i += 2) {
				groups.push([this.topicRecommend[i], this.topicRecommend[i + 1]]);
			}
			// 对分组后的数据进行随机排序
			return this.shuffleArray(groups);
		}
	},
	methods: {
		toPage(item) {
			uni.navigateTo({
				url: `/secondPages/topicDetail/topicDetail?topicId=${item.id}`
			});
		},
		sortByCommentUsers(data) {
			return data.sort((a, b) => {
				// 将 comment_users 字段转换为数字类型进行比较
				return b.comment_users - a.comment_users;
			});
		},
		shuffleArray(array) {
			for (let i = array.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1));
				[array[i], array[j]] = [array[j], array[i]];
			}
			return array;
		},
		detail(item) {
			uni.navigateTo({
				url: `/secondPages/communityDetail/communityDetail?postId=${item.id}`
			});
		},
		refresh() {
			uni.showLoading({
				title: '刷新中...',
				mask: true
			});

			getCommunityItemAPI()
				.then((res) => {
					this.list = res.message.map((item) => {
						return {
							...item,
							imageUrl: JSON.parse(item.imageUrl)
						};
					});

					uni.showToast({
						title: '刷新成功',
						icon: 'success'
					});
				})
				.catch(() => {
					uni.showToast({
						title: '刷新失败',
						icon: 'none'
					});
				})
				.finally(() => {
					uni.hideLoading();
				});
		},
		navigatoPage(url) {
			uni.showLoading({
				title: '加载中'
			});
			uni
				.navigateTo({
					url: url
				})
				.finally(() => {
					uni.hideLoading();
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
.inputBox {
	width: 95%;
	margin: auto;
	display: flex;
	justify-content: space-between;
	position: relative;
	top: 200rpx;

	.input {
		font-family: '阿里妈妈方圆体 VF Regular';
		width: 85%;
		height: 80rpx;
		background-color: #fffbf2;
		// margin: auto;
		border-radius: 40rpx;
		display: flex;
		align-items: center;

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

	.add {
		width: 80rpx;
		border-radius: 100%;
		height: 80rpx;
		background-color: #4d0000;
		color: #fff;
		display: flex;
		font-size: 80rpx;
		line-height: 70rpx;
		justify-content: center;
	}
}

.container {
	position: relative;
	top: 250rpx;
	width: 100%;
	background-color: #fffbf2;
	border-radius: 40rpx 40rpx 0 0;
	font-family: '阿里妈妈方圆体 VF Regular' !important;

	.recommend {
		padding: 40rpx 0;
		width: 95%;
		margin: auto;
		display: flex;
		justify-content: space-between;

		.item {
			height: 200rpx;
			width: 350rpx;
			background-image: linear-gradient(to right, #fff4de 0%, #fffbf2 100%);
			box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
			border-radius: 20rpx;

			.itemTop {
				display: flex;
				justify-content: space-around;
				align-items: center;

				.itemHeader {
					margin-top: -10rpx;

					image {
						width: 56rpx;
						height: 56rpx;
						border: 6rpx solid #fff;
						border-radius: 100%;
					}
				}

				.itemTitle {
					font-size: 28rpx;
					display: flex;
					align-items: center;
					font-weight: bold;

					&::after {
						content: '\203A';
						font-size: 46rpx;
						vertical-align: middle;
						margin-top: -12rpx;
						margin-left: 10rpx;
					}
				}
			}

			.itemBottom {
				padding: 0rpx 30rpx;
				line-height: 60rpx;

				.textTitle {
					font-size: 32rpx;
					color: #4d0000;
				}

				.people {
					font-size: 24rpx;
					margin-left: 20rpx;
				}
			}
		}
	}

	.communityContent {
		.hotTopic {
			border-top: 2rpx solid #ebebeb;
			border-bottom: 2rpx solid #ebebeb;
			padding: 40rpx 0;

			.topicContent {
				width: 95%;
				margin: auto;

				.topicTitle {
					font-size: 42rpx;
					color: #4d0000;
					font-weight: bold;
				}

				.topicContent {
					margin: 10rpx auto;

					.topicItem {
						height: 80rpx;
						width: 100%;
						margin-top: 20rpx;
						display: flex;
						align-items: center;

						image {
							width: 50rpx;
							height: 50rpx;
						}

						.text {
							padding-left: 20rpx;
							font-size: 28rpx;
							display: flex;
							justify-content: space-between;
							width: 100%;

							.info {
								font-size: 20rpx;
								color: #6666;
							}

							.more {
								width: 50rpx;
								height: 50rpx;
								text-align: right;
								position: relative;

								&::after {
									content: '\203A';
									font-size: 70rpx;
									position: absolute;
									top: -25rpx;
									right: 0%;
								}
							}
						}
					}
				}
			}
		}
	}

	.contentGrid {
		width: 100%;
		margin: auto;
		padding-bottom: 200rpx;

		.refresh {
			width: 95%;
			margin: auto;
			display: flex;
			justify-content: space-between;
			padding: 30rpx 0 10rpx 0;
			font-weight: bold;
			align-items: center;

			image {
				width: 40rpx;
				height: 40rpx;
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
	}
}
</style>
