<template>
	<pageBack :titleInfo="titleInfo"></pageBack>
	<view class="content">
		<view class="info">
			<view class="title">
				{{pageInfo[0]?.title}}
			</view>
			<view class="time">
				{{formatDate(pageInfo[0]?.time)}}
			</view>
			<view class="infoContent" v-html="pageInfo[0]?.content">
				<!-- {{pageInfo[0]?.content}} -->
			</view>
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
	</view>
</template>

<script>
	import pageBack from "/components/title/title.vue";
	import {
		getindexNewsItemAPI,
		getindexFuCultureItemAPI,
		getindexFaithItemAPI,
		getindexMazuCultureItemAPI,
		getindexPalaceTempleItemAPI,
		getindexPublicationItemAPI,
		getindexCultureCreativityItemAPI,
		getindexTourismItemAPI,
		getindexGridFaithAPI,
		getindexGridMazuCultureAPI,
		getindexGridPalaceTempleAPI
	} from "/apis/index.js";

	export default {
		data() {
			return {
				titleInfo: {
					titleShow: true,
					title: "",
					imageUrl: "http://t73sifiwt.hn-bkt.clouddn.com/pageBack/1.webp",
					heightShow: false,
					backShow: true
				},
				pageInfo: []
			};
		},
		onLoad(option) {
			this.titleInfo.title = option.pageGrid;
			const apiMapping = {
				// 新闻中心
				"新闻中心": getindexNewsItemAPI,
				"妈祖新闻": getindexNewsItemAPI,
				"两岸交流": getindexNewsItemAPI,
				
				"福文化": getindexFuCultureItemAPI,
				
				"信俗活动": getindexFaithItemAPI,
				
				"妈祖文化": getindexGridPalaceTempleAPI,
				
				"天下宫庙": getindexPalaceTempleItemAPI,
				
				"数字出版": getindexPublicationItemAPI,
				
				// 妈祖文创
				"妈祖文创": getindexCultureCreativityItemAPI,
				"摄影作品": getindexCultureCreativityItemAPI,
				
				"两岸旅游": getindexTourismItemAPI,
				
				"妈祖诞辰": getindexGridFaithAPI,
				
				// 妈祖传说
				"妈祖传说": getindexGridMazuCultureAPI,
				"妈祖非遗": getindexGridMazuCultureAPI
			};
			const apiFunction = apiMapping[option.pageGrid];
			if (apiFunction) {
				apiFunction({
					id: option.pageId
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
			}
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
		font-family: "阿里妈妈方圆体 VF Regular" !important;

		.info {
			padding: 0 40rpx;

			.title {
				font-size: 46rpx;
				font-weight: bold;
			}

			.time {
				padding: 20rpx 0;
				color: #bababa;
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
					width: 100%;
					height: 100%;
					border-radius: 10rpx;
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
	}
</style>