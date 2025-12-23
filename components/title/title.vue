<template>
	<view class="content" v-if="titleInfo.titleShow">
		<image :src="titleInfo.imageUrl" mode="" :style="`margin-top:${titleInfo.height}rpx`"></image>
		<view>
			<view class="back" @click="backPage" v-if="titleInfo.backShow"></view>
			<text>{{titleInfo.title}}</text>
		</view>
	</view>
	<view class="fiexdHeader" v-show="titleInfo.heightShow">
		<view class="">
			<view class="back2" @click="backPage" v-if="titleInfo.backShow"></view>
			{{titleInfo.title}}
		</view>
	</view>
</template>

<script>
	export default {
		name: "title",
		data() {
			return {

			};
		},
		props: {
			titleInfo: {
				type: Object,
				default: () => ({
					titleShow: true,
					title: "福泽海韵",
					heightShow: false,
					imageUrl: "",
					backShow: true
				})
			}
		},
		mounted() {},
		methods: {
			backPage() {
				uni.navigateBack({
					delta: 1
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.content {
		width: 100%;
		position: absolute;
		top: 0%;
		font-family: "妈祖祖庙";
		color: #4d0000;

		image {
			position: absolute;
			height: 1000rpx;
			width: 100%;
			top: -500rpx;
		}

		view {
			position: relative;
			text-align: center;
			line-height: 250rpx;
			font-size: 40rpx;

			.back {
				position: absolute;
				left: 5%;
				color: #fff;
				top: -2%;

				&::after {
					content: "\2039";
					font-size: 96rpx;
				}
			}
		}
	}

	.fiexdHeader {
		position: fixed;
		width: 100%;
		height: 200rpx;
		background-color: rgb(255, 251, 242);
		z-index: 666;
		color: #4d0000;
		font-family: "妈祖祖庙";

		view {
			line-height: 250rpx;
			text-align: center;
			font-size: 40rpx;

			.back2 {
				position: absolute;
				left: 5%;
				color: #4d0000;
				top: -2%;

				&::after {
					content: "\2039";
					font-size: 96rpx;
				}
			}

		}
	}
</style>