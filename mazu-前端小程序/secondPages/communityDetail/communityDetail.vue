<template>
	<pageBack :titleInfo="titleInfo"></pageBack>
	<view class="replyView">
		<view class="center">
			<input type="text" v-model="replyContent" :placeholder="placeholder" :focus="isInputFocus" @blur="outFocus"
				ref="replyInput" />
			<view class="button" @click="sendReply">
				发送
			</view>
		</view>
	</view>
	<view class="content">
		<view class="info">
			<view class="title">
				{{pageInfo[0]?.title}}
			</view>
			<view class="time" v-if="pageInfo[0]">
				<view class="">
					来源：
					<image :src="pageInfo[0]?.avatarurl" mode=""></image>
					<text>{{pageInfo[0]?.nickname}}</text>
				</view>
				<view class="">
					{{formatDate(pageInfo[0]?.time)}}
				</view>
			</view>
			<view class="infoContent" v-html="pageInfo[0]?.content"></view>
			<view class="container">
				<view class="list" v-for="(item, index) in pageInfo[0]?.imageUrl"
					v-if="pageInfo[0]?.imageUrl.length > 1">
					<image :src="item" mode="aspectFill" @click="previewImage(index)"></image>
				</view>
				<view class="list2" v-for="(item, index) in pageInfo[0]?.imageUrl" v-else>
					<image :src="item" mode="aspectFill" @click="previewImage(index)"></image>
				</view>
			</view>
		</view>
		<!-- 评论 -->
		<view class="comment">
			<view class="title">
				最新评论
			</view>
			<view v-if="comment.length > 0" class="commentList">
				<view class="item" v-for="item in comment">
					<view>
						<view class="commentContent">
							<image :src="item.avatarurl" mode=""></image>
							<view class="itemInfo">
								<text class="name">{{item.nickname}}</text>
								<view class="replyContent" @click="replyComment(item)">
									{{item.reply_content}}
								</view>
							</view>
						</view>
						<view class="time">
							{{formatDate(item.reply_time)}}
						</view>
					</view>
					<view class="replies" v-if="item.replies.length > 0">
						<view class="repliesItem" v-for="list in item.replies">
							<view class="header">
								<image :src="list.avatarurl" mode=""></image>
								<view class="name">
									{{list.nickname}} --> {{list.parent_nickname}}
								</view>
							</view>
							<view class="repliesContent" @click="replyComment(list)">
								{{list.reply_content}}
							</view>
							<view class="time" style="padding-left: 70rpx;">
								{{formatDate(list.reply_time)}}
							</view>
						</view>
					</view>
				</view>
			</view>
			<view v-else class="noData">
				<image style="width:200rpx;" src="../../static/comment.svg" mode=""></image>
				<view class="">
					暂无评论，期待您成为第一个评论~
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import pageBack from "/components/title/title.vue";
	import {
		getCommunityItemInfoAPI,
		getCommentAPI,
		addCommentsAPI,
		checkMyPostCommunityAPI
	} from "/apis/community.js";
	import {
		useUserInfoStore
	} from "@/store/userInfo.js"
	export default {
		data() {
			return {
				titleInfo: {
					titleShow: true,
					title: "社区",
					imageUrl: "https://mazu-1320314698.cos.ap-guangzhou.myqcloud.com/pageBack/1.webp",
					heightShow: false,
					backShow: true
				},
				pageInfo: [],
				comment: [],
				value: '',
				isInputFocus: false,
				// 页面id
				pageIndex: null,
				placeholder: '善语善言结善缘,期待您的评论~',
				// 上级id
				superior_id: null,
				// 上级的评论id
				comment_id: null,
				// 最顶级评论id
				mainId: null,
				replyContent: '', // 输入框内容
			};
		},
		onLoad(option) {
			this.pageIndex = option.postId
			// 进入页面后将id缓存至本地
			let history = uni.getStorageSync('history') || []
			let index = history.indexOf(option.postId)
			if (index !== -1) {
				// 如果已存在,则将其移动到最前面  
				history.splice(index, 1)
				history.unshift(option.postId)
			} else {
				// 如果不存在,则添加到最前面  
				history.unshift(option.postId)
			}
			uni.setStorageSync('history', history)

			// 获取数据
			getCommunityItemInfoAPI({
				id: option.postId
			}).then((res) => {
				this.pageInfo = res.message.map((item) => {
					return {
						...item,
						imageUrl: JSON.parse(item.imageUrl)
					}
				});
			}).catch((error) => {
				console.error("获取数据时出错:", error);
			});
			// 获取评论
			getCommentAPI({
				id: option.postId
			}).then((res) => {
				// 去除最后一条重复的评论  
				this.comment = res.comments.slice(0, -1);
			});
			// 检查帖子是否我发布的
			checkMyPostCommunityAPI({
				user_id: useUserInfoStore().$state.userInfo.id,
				id: option.postId
			}).then((res) => {
				console.log(res);
			})
		},
		components: {
			pageBack
		},
		methods: {
			formatDate(isoDate) {
				const date = new Date(isoDate);
				const year = date.getFullYear();
				const month = String(date.getMonth() + 1).padStart(2, '0');
				const day = String(date.getDate()).padStart(2, '0');
				const hours = String(date.getHours()).padStart(2, '0');
				const minutes = String(date.getMinutes()).padStart(2, '0');
				const seconds = String(date.getSeconds()).padStart(2, '0');
				return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
			},
			previewImage(currentIndex) {
				const urls = this.pageInfo[0]?.imageUrl || [];
				uni.previewImage({
					current: urls[currentIndex], // 当前显示图片的http链接
					urls: urls // 需要预览的图片http链接列表
				});
			},
			// 点击评论聚焦事件
			replyComment(item) {
				this.$nextTick(() => {
					if (item.mainId == null) {
						this.mainId = item.id;
					} else {
						this.mainId = item.mainId;
					}
					this.superior_id = item.user_id;
					this.comment_id = item.id;
					this.isInputFocus = true;
					this.placeholder = `回复 @${item.nickname}`
				})
			},
			// 失焦事件
			outFocus() {
				this.superior_id = null;
				this.comment_id = null;
				this.mainId = null;
				this.replyContent = ''; // 清空输入内容
				this.isInputFocus = false; // 失去焦点状态
				this.placeholder = '善语善言结善缘,期待您的评论~';
			},
			// 发送  
			sendReply() {
				// 获取输入内容
				const replyContent = this.replyContent.trim();

				if (!useUserInfoStore().$state.userInfo.id) {
					// 用户未登录,跳转到登录页面  
					uni.navigateTo({
						url: '/pages/login/login'
					});
					return;
				}

				// 判断输入是否为空  
				if (!replyContent) {
					uni.showToast({
						title: "请输入评论内容",
						mask: true,
						icon: 'none'
					});
					return; // 如果为空则不执行后续代码  
				}

				// 执行发送评论的逻辑  
				addCommentsAPI({
					post_id: this.pageIndex,
					user_id: useUserInfoStore().$state.userInfo.id,
					reply_content: replyContent,
					superior_id: this.superior_id,
					comment_id: this.comment_id,
					mainId: this.mainId
				}).then((res) => {
					if (res.status === 200) {
						// 重新获取评论列表  
						getCommentAPI({
							id: this.pageIndex
						}).then((res) => {
							this.comment = res.comments.slice(0, -1);
							// 在获取评论成功后显示弹窗
							uni.showToast({
								title: "发布成功",
								mask: true
							});
						});

						// 重置输入框  
						this.outFocus();
					} else {
						uni.showToast({
							title: "其他异常",
							mask: true,
							icon: 'error'
						});
					}
				});
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
	.replyView {
		width: 100%;
		position: fixed;
		background-color: rgb(255, 251, 241);
		border-top: 2rpx solid rgba(0, 0, 0, 0.08);
		bottom: 0%;
		left: 0%;
		z-index: 16;
		display: flex;
		justify-content: space-around;
		align-items: center;
		font-family: "阿里妈妈方圆体 VF Regular" !important;

		.center {
			width: 90%;
			display: flex;
			justify-content: space-around;
			align-items: center;
			padding-top: 20rpx;

			input {
				width: 70%;
				padding: 10rpx 40rpx;
				border: 2rpx solid rgba(0, 0, 0, 0.1);
				border-radius: 40rpx;
				font-size: 28rpx;
				margin-bottom: 40rpx;
			}

			.button {
				font-weight: bold;
				margin-bottom: 40rpx;
			}
		}
	}

	.content {
		position: relative;
		top: 200rpx;
		width: 100%;
		min-height: 300rpx;
		background-color: rgb(255, 251, 241);
		border-radius: 40rpx 40rpx 0 0;
		overflow: hidden;
		padding: 40rpx 0;
		font-family: "阿里妈妈方圆体 VF Regular" !important;
		padding-bottom: 160rpx;

		.noData {
			padding: 60rpx 0;
			text-align: center;

			image {
				width: 200rpx;
				height: 300rpx;
			}

			// color: #4d0000;
		}

		.info {
			padding: 0 40rpx;

			.title {
				font-size: 46rpx;
				font-weight: bold;
			}

			.time {
				padding: 20rpx 0;
				color: #bababa;
				display: flex;
				align-items: center;

				view {
					margin-right: 40rpx;
					display: flex;
					align-items: center;

					image {
						margin-right: 10rpx;
						width: 40rpx;
						height: 40rpx;
						border-radius: 100%;
					}
				}
			}

			.infoContent {
				text-indent: 2em;
				color: #000 !important;
				line-height: 46rpx;
				letter-spacing: 4rpx;
			}

			.container {
				display: flex;
				flex-wrap: wrap;
				width: 100%;
				padding: 40rpx 0;
			}

			.list {
				width: 32%;
				aspect-ratio: 1;

				image {
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

		.comment {
			width: 90%;
			margin: auto;

			.title {
				font-weight: bold;
			}

			.commentList {
				padding-top: 40rpx;

				.item {
					padding: 20rpx 0;

					.commentContent {
						display: flex;

						image {
							width: 80rpx;
							height: 80rpx;
							border-radius: 100%;
							margin-right: 20rpx;
						}

						.name {
							color: #6b6b6b;
							font-size: 28rpx;
						}

						.replyContent {
							margin-top: 6rpx;
							font-size: 34rpx;
							min-width: 500rpx;
						}
					}

					.time {
						font-size: 22rpx;
						color: #b1b1b1;
						padding-left: 100rpx;
						padding-top: 10rpx;
					}

					.replies {
						padding-left: 100rpx;

						.repliesItem {
							padding: 20rpx 0;

							.header {
								display: flex;
								align-items: center;

								.name {
									color: #6b6b6b;
									font-size: 28rpx;
								}

								image {
									width: 50rpx;
									height: 50rpx;
									border-radius: 100%;
									margin-right: 20rpx;
								}
							}

							.repliesContent {
								margin-top: 6rpx;
								padding-left: 70rpx;
							}
						}
					}
				}
			}
		}
	}
</style>