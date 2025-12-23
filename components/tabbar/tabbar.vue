<template>
	<view class="content" :class="{ isIos: isIos }">
		<view class="tabItem">
			<view class="item" v-for="item in tabInfo" :key="item.id" :class="{ active: currentTab === item.id - 1 }"
				@click="clickTab(item)">
				<image :src="currentTab === item.id - 1 ? item.icon_active : item.icon" mode=""></image>
				<view>{{ item.name }}</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		useCounterStore
	} from "@/store/switchTab.js";

	export default {
		name: "tabbar",
		data() {
			return {
				tabInfo: [{
						id: 1,
						icon: "http://t73sifiwt.hn-bkt.clouddn.com/tabbatIcon/home.svg",
						icon_active: "http://t73sifiwt.hn-bkt.clouddn.com/tabbatIcon/home_active.svg",
						url: "/pages/index/index",
						name: "首页",
					},
					{
						id: 2,
						icon: "http://t73sifiwt.hn-bkt.clouddn.com/tabbatIcon/community.svg",
						icon_active: "http://t73sifiwt.hn-bkt.clouddn.com/tabbatIcon/community_active.svg",
						url: "/pages/community/community",
						name: "社区",
					},
					{
						id: 3,
						icon: "http://t73sifiwt.hn-bkt.clouddn.com/tabbatIcon/prays.svg",
						icon_active: "http://t73sifiwt.hn-bkt.clouddn.com/tabbatIcon/prays_active.svg",
						url: "/pages/prays/prays",
						name: "祈福",
					},
					{
						id: 4,
						icon: "http://t73sifiwt.hn-bkt.clouddn.com/tabbatIcon/shop.svg",
						icon_active: "http://t73sifiwt.hn-bkt.clouddn.com/tabbatIcon/shop_active.svg",
						url: "/pages/shop/shop",
						name: "商城",
					},
					{
						id: 5,
						icon: "http://t73sifiwt.hn-bkt.clouddn.com/tabbatIcon/mine.svg",
						icon_active: "http://t73sifiwt.hn-bkt.clouddn.com/tabbatIcon/mine_active.svg",
						url: "/pages/mine/mine",
						name: "我的",
					},
				],
				isIos: false
			};
		},
		mounted() {
			// 判断是否ios
			if (uni.getSystemInfoSync().platform == 'ios' || uni.getSystemInfoSync().platform == 'devtools') {
				this.isIos = true
			}
		},
		computed: {
			currentTab() {
				return useCounterStore().$state.currentTab;
			}
		},
		methods: {
			clickTab(item) {
				useCounterStore().$state.currentTab = item.id - 1;
				uni.switchTab({
					url: item.url,
				});
			}
		}
	};
</script>

<style lang="less" scoped>
	.content::before {
		content: "";
		height: 2rpx;
		width: 100%;
		position: absolute;
		background-color: #00000014;
	}

	.content {
		background-color: rgb(255, 251, 242);
		z-index: 999;
		position: fixed;
		height: 140rpx;
		width: 100%;
		bottom: 0%;
		left: 0%;

		.tabItem {
			display: flex;
			justify-content: space-around;
			align-items: end;
			margin-top: 20rpx;

			.item {
				display: flex;
				justify-content: center;
				align-items: center;
				flex-direction: column;
				font-size: 24rpx;
				color: #666;
				transform: scale(0.9);

				&.active {
					color: #C92127;
				}

				image {
					width: 56rpx;
					height: 56rpx;
				}
			}
		}
	}

	.isIos {
		padding-bottom: 20rpx;
	}
</style>