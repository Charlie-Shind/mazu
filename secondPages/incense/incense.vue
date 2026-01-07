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
						<!-- v-for列表循环 接口数据正常用 + 封面图用静态地址 -->
						<view class="item-masonry" v-for="(item, index) in list" :key="index" @click="toShowDetail(item.id)">
							<!-- 核心修改：封面图用静态图片数组的地址，按索引循环使用 -->
							<image :lazy-load="true" :src="staticCoverList[index % staticCoverList.length]" mode="aspectFill"></image>
							<view class="listtitle">
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

	<!-- ✅ 新增：公益专属提示弹窗（和求签弹窗样式完全一致） -->
	<uni-popup ref="publicPopup" type="center" :isMaskClick="false">
		<view class="first-visit-popup">
			<view class="popup-header">
				<text class="popup-title">公益爱心提示</text>
			</view>
			<view class="popup-content">
				<text class="popup-text">您在这里支付的所有金额，都会全额投入到对应的公益项目中，真正用于公益践行。</text>
				<text class="popup-text">公益点滴善意，汇聚温暖力量，感恩您的爱心助力！</text>
			</view>
			<view class="popup-footer">
				<view class="popup-btn" @click="closePublicPopup">我知道了</view>
			</view>
		</view>
	</uni-popup>
</template>

<script>
import pageBack from '/components/title/title.vue';
import { gridSearchShopAPI } from '/apis/shop.js';
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
			searchText: '',
			// 你提供的8张静态封面图地址【核心配置，全部保留】
			staticCoverList: [
				'https://java-ai-ch.oss-cn-beijing.aliyuncs.com/80e2fd9ef24effee752512adfa510fa9.jpg',
				'https://java-ai-ch.oss-cn-beijing.aliyuncs.com/ff59f72d6dd7553974a67b0f9bdeaa5f.jpg',
				'https://java-ai-ch.oss-cn-beijing.aliyuncs.com/dc5eeb8220085d40ac92870d36e25f47.jpg',
				'https://java-ai-ch.oss-cn-beijing.aliyuncs.com/ce99e3bb8a518c78e125db3e679b1c54.jpg',
				'https://java-ai-ch.oss-cn-beijing.aliyuncs.com/4ef8a58c70eaa82f2b7bbabc78e5f022.jpg',
				'https://java-ai-ch.oss-cn-beijing.aliyuncs.com/99ab73a598a00013403781c59b2dfe24.png',
				'https://java-ai-ch.oss-cn-beijing.aliyuncs.com/a78c50ef3df1256278ab813f380b76f3.png',
				'https://java-ai-ch.oss-cn-beijing.aliyuncs.com/3e66ba63898238a9704182b0701819d5.png'
			]
		};
	},
	components: {
		pageBack
	},
	onLoad() {
		this.getPublicProjects();
		// ✅ 新增：页面加载后延迟打开公益弹窗，和求签页一致的300ms延迟
		setTimeout(() => {
			this.$refs.publicPopup.open();
		}, 300);
	},
	methods: {
		// ✅ 新增：关闭公益弹窗的方法
		closePublicPopup() {
			this.$refs.publicPopup.close();
		},
		// 价格格式化方法
		formatPrice(price) {
			const num = Number(price);
			return isNaN(num) ? '0.00' : num.toFixed(2);
		},
		// 获取公益项目列表【接口请求保留不变】
		getPublicProjects() {
			gridSearchShopAPI('公益')
				.then((res) => {
					if (res && res.message) {
						this.list = res.message;
					} else {
						this.list = [];
					}
				})
				.catch((err) => {
					console.error('获取公益项目失败：', err);
					this.list = [];
				});
		},
		// 搜索公益项目【保留不变】
		searchProjects() {
			if (!this.searchText) {
				this.getPublicProjects();
				return;
			}
			const filteredList = this.list.filter((item) => item.shopname.toLowerCase().includes(this.searchText.toLowerCase()));
			this.list = filteredList;
		},
		// 跳转到商品详情页【保留不变】
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

// ✅ 新增：弹窗样式（和求签页面完全一致，直接复制过来，无需修改）
.first-visit-popup {
	width: 600rpx;
	background: #fff;
	border-radius: 24rpx;
	overflow: hidden;
	box-shadow: 0 10rpx 40rpx rgba(0, 0, 0, 0.15);

	.popup-header {
		height: 100rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		background: linear-gradient(135deg, #d4a574 0%, #c8965e 100%);
		border-bottom: 1rpx solid rgba(255, 255, 255, 0.2);

		.popup-title {
			color: #fff;
			font-size: 36rpx;
			font-weight: 600;
		}
	}

	.popup-content {
		padding: 40rpx 30rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 200rpx;

		.popup-text {
			color: #333;
			font-size: 28rpx;
			line-height: 1.8;
			text-align: center;
			margin-bottom: 20rpx;

			&:last-child {
				margin-bottom: 0;
				color: #d4a574;
				font-weight: 500;
			}
		}
	}

	.popup-footer {
		border-top: 1rpx solid #eee;

		.popup-btn {
			height: 100rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 32rpx;
			font-weight: 600;
			color: #fff;
			background: linear-gradient(135deg, #d4a574 0%, #c8965e 100%);
			transition: all 0.2s;

			&:active {
				opacity: 0.8;
			}
		}
	}
}
</style>
