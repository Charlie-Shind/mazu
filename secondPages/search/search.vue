<template>
	<pageBack :titleInfo="titleInfo"></pageBack>
	<view class="content">
		<view class="header">
			<view class="input">
				<input type="search" v-model="searchText" @confirm="inputSearch" />
				<image src="../../static/shop/search.png" mode=""></image>
			</view>
			<view class="history" v-if="!contentShow">
				<view class="title">
					<text>历史搜索</text>
					<text @click="delHistory" v-if="searchHistory.length > 0">删除</text>
				</view>
				<view class="historyContent">
					<view v-for="item in searchHistory.slice(0, 9)" @click="postHistory(item)">
						<text v-if="item.length > 5">{{ item.slice(0, 5) }}...</text>
						<text v-else>{{ item }}</text>
					</view>
				</view>
			</view>
			<!-- 搜索出来的内容 -->
			<view class="postContent" v-else>
				<view v-show="!judgeContent" class="noData">
					<image src="../../static/search.svg" mode=""></image>
					<view class="">暂无匹配内容,请换个关键词~</view>
				</view>
				<view class="item" v-for="(item, index) in postInfo">
					<view class="itemContent">
						<view class="header">
							<image :src="item.avatarurl" mode=""></image>
							<view>{{ item.nickname }}</view>
						</view>
						<view class="bottom">
							<view class="info">
								<view v-if="item.content.length < 100" @click="showMore(item, index)">
									<view v-html="item.content"></view>
								</view>
								<view v-else @click="showMore(item, index)">
									<view v-if="!item.showMore">
										<view v-html="item.content.slice(0, 50)"></view>
										<view style="text-align: right">
											<text>......</text>
											<text>双击展开</text>
										</view>
									</view>
									<view v-else>
										{{item.content}}
									</view>
								</view>
							</view>
							<view class="container">
								<view class="list" v-for="(imgItem, imgIndex) in item.imageUrl" v-if="item.imageUrl.length > 1">
									<image :src="imgItem" mode="aspectFill" @click="previewImage(item.imageUrl, imgIndex)"></image>
								</view>
								<view class="list2" v-for="(imgItem, imgIndex) in item.imageUrl" v-else>
									<image :src="imgItem" mode="aspectFill" @click="previewImage(item.imageUrl, imgIndex)"></image>
								</view>
							</view>
						</view>
					</view>
					<view class="separate"></view>
				</view>
			</view>
		</view>
		<view class="delete-confirm" v-if="showDeleteConfirm">
			<view class="delete-confirm-content">
				<text>确定要删除所有搜索历史吗?</text>
				<view class="delete-confirm-buttons">
					<view class="delete-confirm-button" @click="confirmDeleteHistory">确定</view>
					<view class="delete-confirm-button" @click="cancelDeleteHistory">取消</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import pageBack from '/components/title/title.vue';
import { searchCommunityAPI } from '../../apis/community.js';
export default {
	data() {
		return {
			titleInfo: {
				titleShow: true,
				title: '搜索',
				imageUrl: 'http://t73sifiwt.hn-bkt.clouddn.com/pageBack/1.webp',
				heightShow: false,
				backShow: true
			},
			searchHistory: [],
			postInfo: [],
			contentShow: false,
			judgeContent: false,
			searchHistoryKey: 'searchHistory',
			searchText: '',
			showDeleteConfirm: false,
			touchNum: 0
		};
	},
	// 在 created 钩子中读取本地存储的搜索历史
	created() {
		// 从本地存储中读取搜索历史
		this.searchHistory = uni.getStorageSync(this.searchHistoryKey) || [];
	},
	components: {
		pageBack
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
		inputSearch(e) {
			if (e.detail.value.trim() === '') {
				return uni.showToast({
					title: '内容不得为空',
					icon: 'none'
				});
			}
			// 检查搜索内容是否已经存在于搜索历史中
			if (!this.searchHistory.includes(e.detail.value)) {
				this.searchHistory.unshift(e.detail.value);
				// 保存搜索历史到本地存储
				uni.setStorageSync(this.searchHistoryKey, this.searchHistory);
			}
			this.contentShow = true;
			uni.showLoading({
				title: '搜索中'
			});
			searchCommunityAPI({
				content: e.detail.value
			})
				.then((res) => {
					if (res.message.length > 0) {
						this.judgeContent = true;
					}
					this.postInfo = res.message.map((item) => {
						return {
							...item,
							imageUrl: JSON.parse(item.imageUrl)
						};
					});
				})
				.finally(() => {
					uni.hideLoading();
				});
		},
		postHistory(item) {
			this.searchText = item;
			this.inputSearch({
				detail: {
					value: item
				}
			});
		},
		delHistory() {
			this.showDeleteConfirm = true;
		},
		confirmDeleteHistory() {
			// 删除搜索历史
			this.searchHistory = [];
			uni.setStorageSync(this.searchHistoryKey, this.searchHistory);
			this.showDeleteConfirm = false;
		},
		cancelDeleteHistory() {
			this.showDeleteConfirm = false;
		},
		// 点击图片放大
		previewImage(urls, currentIndex) {
			uni.previewImage({
				current: urls[currentIndex],
				urls: urls
			});
		},
		// 展开/进入
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
	padding: 40rpx 0;
	font-family: '阿里妈妈方圆体 VF Regular' !important;

	.noData {
		text-align: center;
		color: #4d0000;
	}

	.header {
		.input {
			font-family: '阿里妈妈方圆体 VF Regular';
			width: 90%;
			margin: auto;
			height: 80rpx;
			background-color: #fffbf2;
			border-radius: 40rpx;
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

		.history {
			padding: 20rpx;

			.title {
				display: flex;
				justify-content: space-between;
				align-items: center;
			}

			.historyContent {
				display: flex;
				padding: 20rpx 0;
				flex-wrap: wrap;
				margin-top: -20rpx;

				view {
					margin-top: 20rpx;
					font-size: 26rpx;
					padding: 10rpx 20rpx;
					background-color: rgba(0, 0, 0, 0.05);
					// color: #000;
					border-radius: 10rpx;
					margin-right: 20rpx;
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
</style>
