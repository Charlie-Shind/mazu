<template>
	<pageBack :titleInfo="titleInfo"></pageBack>
	<view class="content">
		<view class="container">
			<view class="shopName">
				<view class="shopTitle">公益项目</view>
				<view class="shopEngTitle">Public Welfare Projects</view>
			</view>
			<view class="input">
				<input type="text" v-model="searchText" placeholder="搜索公益项目" @input="searchProjects" />
				<image src="../../static/shop/search.png" mode=""></image>
			</view>
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
									<text>捐款金额</text>
									{{ formatPrice(item.price) }}
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import pageBack from '/components/title/title.vue';
import { getShopListAPI, gridSearchShopAPI } from '/apis/shop.js';
export default {
	data() {
		return {
			titleInfo: {
				titleShow: true,
				title: '公益项目',
				imageUrl: 'http://t73sifiwt.hn-bkt.clouddn.com/pageBack/3.webp',
				heightShow: false,
				backShow: true
			},
			list: [],
			searchText: ''
		};
	},
	components: {
		pageBack
	},
	onLoad() {
		this.getPublicProjects();
	},
	methods: {
		// ========== 新增：价格格式化方法 ==========
		formatPrice(price) {
			// 完整的容错处理，避免 toFixed 报错
			const num = Number(price);
			// 如果转换失败（非数字），返回 0.00
			return isNaN(num) ? '0.00' : num.toFixed(2);
		},
		// 获取公益项目列表
		getPublicProjects() {
			// 使用gridSearchShopAPI查询公益分类下的商品
			gridSearchShopAPI('公益')
				.then((res) => {
					// 容错：判断 res.message 是否存在
					if (res && res.message) {
						this.list = res.message.map((item) => {
							return {
								...item,
								imageUrl: JSON.parse(item.imageUrl || '[]') // 容错：imageUrl 为空时解析为空数组
							}
						});
					} else {
						this.list = [];
					}
				})
				.catch((err) => {
					console.error('获取公益项目失败：', err);
					this.list = [];
				});
		},
		// 搜索公益项目
		searchProjects() {
			if (!this.searchText) {
				this.getPublicProjects();
				return;
			}
			// 简单的本地搜索，根据商品名称过滤
			const filteredList = this.list.filter(item => 
				item.shopname.toLowerCase().includes(this.searchText.toLowerCase())
			);
			this.list = filteredList;
		},
		// 跳转到商品详情页
		toShowDetail(id) {
			uni.navigateTo({
				url: `/secondPages/shopDetail/shopDetail?shopId=${id}`
			});
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
</style>