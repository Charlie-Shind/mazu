<template>
	<view v-if="show">
		<pageBack :titleInfo="titleInfo"></pageBack>
		<view class="content">
			<view v-if="postInfo.length >= 1">
				<view class="postInfo">
					<view class="postContent">
						<view class="item" v-for="(item,index) in postInfo">
							<view class="itemContent">
								<view class="header">
									<view class="headerLeft">
										<image :src="item.avatarurl" mode=""></image>
										<view>{{item.nickname}}</view>
									</view>
									<view class="delete" @click="deleteItem(item.id, index)">
										删除
									</view>
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
											<view v-else v-html="item.content">
												<!-- {{item.content}} -->
											</view>
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
			<view class="noData" v-else>
				<image src="../../static/history.svg" mode=""></image>
				<view class="">
					您还没有发布过内容哦~
				</view>
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
		byIdGetCommunityAPI,
		getMyPostCommunityAPI,
		deletePostCommunityAPI
	} from "/apis/community.js"
	export default {
		data() {
			return {
				titleInfo: {
					titleShow: true,
					title: "我的发布",
					imageUrl: "http://t73sifiwt.hn-bkt.clouddn.com/pageBack/1.webp",
					heightShow: false,
					backShow: true
				},
				postInfo: [],
				showDeleteConfirm: false,
				show: false
			};
		},
		components: {
			pageBack
		},
		// 在 created 钩子中读取本地存储的搜索历史
		// created() {
		// 	// 从本地存储中读取搜索历史  
		// 	this.history = uni.getStorageSync('history').map(Number).toString() || []
		// },
		onLoad() {
			// this.getHistory(uni.getStorageSync('history').map(Number));
			// const historyIds = uni.getStorageSync('history');
			// if (uni.getStorageSync('history')) {
			// 	this.getHistory(uni.getStorageSync('history').map(Number));
			// } else {
			// 	this.show = true;
			// }
			getMyPostCommunityAPI({
				user_id: useUserInfoStore().$state.userInfo.id
			}).then((res) => {
				this.postInfo = res.data.map((item) => {
					return {
						...item,
						imageUrl: JSON.parse(item.imageUrl),
						showMore: false
					}
				})
				this.show = true
			})
		},
		methods: {
			// 新增的点击删除后触发的方法
			deleteItem(postId, index) {
				uni.showModal({
					title: '提示',
					content: '是否确认删除该条内容？',
					success: (res) => {
						if (res.confirm) {
							deletePostCommunityAPI({
								user_id: useUserInfoStore().$state.userInfo.id,
								id: postId
							}).then((res) => {
								if (res.status == 200) {
									getMyPostCommunityAPI({
										user_id: useUserInfoStore().$state.userInfo.id
									}).then((res) => {
										this.postInfo = res.data.map((item) => {
											return {
												...item,
												imageUrl: JSON.parse(item.imageUrl),
												showMore: false
											}
										})
										this.show = true
									})
									uni.showToast({
										title: "删除成功"
									})
								} else {
									uni.showToast({
										title: "删除失败",
										icon: "error"
									})
								}
							})
							// 这里调用真正执行删除的方法，比如下面的 confirmDeleteHistory 方法（可根据实际情况调整具体逻辑）
							// this.confirmDeleteHistory(postId, index);
						}
					}
				});
			},
			getHistory(ids) {
				byIdGetCommunityAPI(ids).then((res) => {
					this.postInfo = res.data.map((item) => {
						return {
							...item,
							imageUrl: JSON.parse(item.imageUrl),
							showMore: false
						}
					})
					this.show = true
				});
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
							url: `/secondPages/communityDetail/communityDetail?postId=${item.id}`
						});
					} else if (this.touchNum >= 2) {
						this.postInfo[index].showMore = !this.postInfo[index].showMore;
					}
					this.touchNum = 0;
				}, 250);
			},
			confirmDeleteHistory() {
				// 删除历史  
				uni.removeStorageSync('history'); // 清空本地存储的游览历史
				this.postInfo = []; // 清空当前显示的历史游览记录
				uni.showToast({
					title: '历史游览已清空',
					icon: 'success'
				});
				this.showDeleteConfirm = false;
			},
			cancelDeleteHistory() {
				this.showDeleteConfirm = false;
			},
		},
		onPageScroll(e) {
			if (e.scrollTop >= 80) {
				this.titleInfo.heightShow = true;
			}
			if (e.scrollTop < 80) {
				this.titleInfo.heightShow = false;
			}
		},
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

		.clean {
			position: absolute;
			right: 5%;
			top: 40rpx;
			color: #4d0000;
			font-weight: bold;
		}

		.postInfo {
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
							justify-content: space-between;

							.headerLeft {
								display: flex;
								align-items: center;
							}

							.delete {
								background-color: #4d0000;
								color: #fff;
								padding: 10rpx 20rpx;
								border-radius: 20rpx;
								font-size: 28rpx;
							}

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

		.delete-confirm {
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background-color: rgba(0, 0, 0, 0.5);
			display: flex;
			justify-content: center;
			align-items: center;
		}

		.delete-confirm-content {
			background-color: #fff;
			padding: 20px;
			border-radius: 8px;
			text-align: center;
		}

		.delete-confirm-buttons {
			display: flex;
			justify-content: center;
			margin-top: 20px;
		}

		.delete-confirm-button {
			padding: 8px 16px;
			background-color: #4d0000;
			color: #fff;
			border-radius: 4px;
			margin: 0 8px;
			cursor: pointer;
		}
	}
</style>