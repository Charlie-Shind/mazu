<template>
	<pageBack :titleInfo="titleInfo"></pageBack>
	<view class="content">
		<view class="infoContent">
			<view class="info">
				<view class="title">
					<image :src="topicInfo?.cover" mode="aspectFill"></image>
					<view>
						#{{topicInfo?.name}}#
						<view class="data">
							<text>动态 : {{postInfo?.length}}</text>
							<text>讨论人数 : {{topicInfo?.comment_count}}</text>
						</view>
					</view>
				</view>
				<view class="synopsis" @click="showFullText">
					<view v-if="!isShowingFullText">
						{{topicInfo.description.slice(0, 30)}}... <text>点击展开</text>
					</view>
					<view v-else>
						{{topicInfo.description}}
					</view>
				</view>
			</view>
		</view>
		<view class="postInfo">
			<view class="tabList">
				<view v-for="(item,index) in tabList" :class="{active:tabCurrent === index}"
					@click="chooseType(item.id,index)">
					{{item.name}}
				</view>
			</view>
			<view class="postContent">
				<view class="item" v-for="(item,index) in postInfo">
					<view class="itemContent">
						<view class="header">
							<image :src="item.avatarurl" mode=""></image>
							<view>{{item.nickname}}</view>
						</view>
						<view class="bottom">
							<view class="info">
								<view v-if="item.content.length < 100" @click="showMore(item,index)">
									<view v-html="item.content"></view>
								</view>
								<view v-else @click="showMore(item,index)">
									<view v-if="!item.showMore">
										<view v-html="item.content.slice(0,50)"></view>
										<view style="text-align: right;">
											<text>......</text>
											<text>双击展开</text>
										</view>
									</view>
									<view v-else v-html="item.content"></view>
								</view>
							</view>
							<view class="container">
								<view class="list" v-for="(imgItem, imgIndex) in item.imageUrl"
									v-if="item.imageUrl.length > 1">
									<image :src="imgItem" mode="aspectFill"
										@click="previewImage(item.imageUrl, imgIndex)">
									</image>
								</view>
								<view class="list2" v-for="(imgItem, imgIndex) in item.imageUrl" v-else>
									<image :src="imgItem" mode="aspectFill"
										@click="previewImage(item.imageUrl, imgIndex)">
									</image>
								</view>
							</view>
						</view>
					</view>
					<view class="separate"></view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import pageBack from "/components/title/title.vue";
	import {
		getTopicInfoAPI
	} from "../../apis/community.js"

	export default {
		data() {
			return {
				titleInfo: {
					titleShow: true,
					title: "话题",
					imageUrl: "http://t73sifiwt.hn-bkt.clouddn.com/pageBack/1.webp",
					heightShow: false,
					backShow: true
				},
				topicInfo: {},
				postInfo: [],
				isShowingFullText: false,
				tabList: [{
						id: 1,
						name: "默认"
					},
					{
						id: 2,
						name: "最新发布"
					},
					{
						id: 3,
						name: "热门发布"
					}
				],
				tabCurrent: 0,
				touchNum: 0
			};
		},
		components: {
			pageBack
		},
		onLoad(option) {
			getTopicInfoAPI({
				id: option.topicId
			}).then((res) => {
				this.topicInfo = res.message.topic;
				this.postInfo = res.message.postAndUser.map((item) => {
					return {
						...item,
						imageUrl: JSON.parse(item.imageUrl),
						showMore: false
					};
				});
			});
		},
		onPageScroll(e) {
			if (e.scrollTop >= 80) {
				this.titleInfo.heightShow = true;
			}
			if (e.scrollTop < 80) {
				this.titleInfo.heightShow = false;
			}
		},
		methods: {
			showFullText() {
				this.isShowingFullText = !this.isShowingFullText;
			},
			chooseType(id, index) {
				this.tabCurrent = index;
				uni.showLoading({
					title: "加载中"
				})
				setTimeout(() => {
					if (id === 1) {
						// 随机排序
						this.postInfo.sort(() => Math.random() - 0.5);
					} else if (id === 2) {
						// 将每一项时间取出进行排序
						this.postInfo.sort((a, b) => new Date(b.time) - new Date(a.time));
					} else if (id === 3) {
						// 将每一项评论数量取出进行排序
						this.postInfo.sort((a, b) => b.comment_count - a.comment_count);
					}
					uni.hideLoading()
				}, 500)
			},
			previewImage(urls, currentIndex) {
				uni.previewImage({
					current: urls[currentIndex],
					urls: urls
				});
			},
			showMore(item, index) {
				this.touchNum++;
				setTimeout(() => {
					if (this.touchNum === 1) {
						uni.navigateTo({
							url: `/secondPages/communityDetail/communityDetail?postId=${item.post_id}`
						});
					} else if (this.touchNum >= 2) {
						this.postInfo[index].showMore = !this.postInfo[index].showMore;
					}
					this.touchNum = 0;
				}, 250);
			}
		}
	};
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

		.infoContent {
			width: 100%;
			padding-top: 40rpx;
			padding-bottom: 20rpx;
			overflow: hidden;

			.back {
				top: 0;
				position: absolute;
				width: 100%;
				height: 100%;
				filter: blur(20px);
			}

			.info {
				width: 90%;
				margin: auto;
				position: relative;

				.title {
					display: flex;
					// align-items: center;
					font-size: 46rpx;
					color: #4d0000;

					image {
						width: 160rpx;
						height: 160rpx;
						margin-right: 20rpx;
						border-radius: 4rpx;
					}

					.data {
						padding: 20rpx 0;
						color: #a7a7a7;
						font-size: 32rpx;

						text {
							margin-right: 30rpx;
						}
					}
				}

				.synopsis {
					width: 100%;
					padding: 20rpx 0;
					color: #888888;
					letter-spacing: 2rpx;
					font-size: 34rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					line-height: 52rpx;
				}
			}
		}

		.postInfo {
			.tabList {
				display: flex;
				width: 90%;
				margin: auto;

				view {
					padding: 10rpx 20rpx;
					border-radius: 20rpx;
					margin-right: 20rpx;

					&.active {
						background-color: #4d0000;
						color: #fff;
					}
				}
			}

			.postContent {
				padding: 40rpx 0;

				.item {
					padding: 20rpx 0;

					.itemContent {
						width: 90%;
						margin: auto;

						.header {
							display: flex;
							font-size: 30rpx;
							align-items: center;
							width: 100%;

							image {
								width: 60rpx;
								height: 60rpx;
								border-radius: 100%;
								margin-right: 20rpx;
							}
						}

						.info {
							padding: 20rpx 0;

							text {
								color: #888888;
							}
						}

						.container {
							display: flex;
							flex-wrap: wrap;
							width: 100%;
						}

						.list {
							width: 32%;
							aspect-ratio: 1;

							image {
								// width: 100%;
								// height: 100%;
								width: 210rpx;
								height: 210rpx;
								border-radius: 10rpx;
								// margin-top: 10rpx;
							}
						}

						.list:not(:nth-child(3n)) {
							margin-right: calc(5% / 3);
						}

						.list2 {
							width: 100%;
							aspect-ratio: 1;

							image {
								width: 100%;
								height: 100%;
								border-radius: 10rpx;
							}
						}
					}

					.separate {
						margin: 40rpx 0 20rpx 0;
						width: 100%;
						height: 20rpx;
						background-color: rgba(0, 0, 0, 0.04);
					}
				}
			}
		}
	}
</style>