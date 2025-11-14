<template>
	<pageBack :titleInfo="titleInfo"></pageBack>
	<view class="content">
		<view class="container">
			<image class="backImage" src="https://mazu-1320314698.cos.ap-guangzhou.myqcloud.com/prays/mazuback.jpg" mode="scaleToFill">
			</image>
			<view class="zhangYiNa">
				<image class="getIn" v-if="imageShow" src="../../static/mzlq60.gif" mode="widthFix" @click="explain">
				</image>
				<view v-else class="getIn text" @click="explain">
					<view>月亮一出来，光辉皎洁，只是浮云遮蔽，总使明月失色。</view>
					<view>你该在家里多求神拜佛用心作善事。当官要事理分明，自然会有益处。</view>
					<view>
						此签告诉当事人，人生不如意之事十之八九。就像那皎洁的月亮，偶而也有被乌云遮住光茫的时候;但不必因光芒被遮，而感到不平，更应该行善布施勤修其德。当那乌云退去时，再度露出的光辉，将更明亮动人。
						求得此签暗示目前福禄平平，问事求谋慢成，应多求神行善事作公益造福。</view>
					<view>
						问求财只要辛勤工作，财利可得。问功名，须再努力，充实自己，自然有成功的希望。问谋事，只要积极努力，必能有成。问婚姻，有鸟云遮月的暗示，谈婚事不吉事。出外旅行，必须小心谨慎，最好打消此念。问疾病，妇女未安拖尾，宜求神消灾解厄得愈。
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import pageBack from "/components/title/title.vue";

	export default {
		data() {
			return {
				titleInfo: {
					titleShow: true,
					title: "妈祖灵签",
					imageUrl: "https://mazu-1320314698.cos.ap-guangzhou.myqcloud.com/pageBack/1.webp",
					heightShow: false,
					backShow: true,
					classShow: true
				},
				imageShow: true
			};
		},
		components: {
			pageBack
		},
		onLoad(option) {
			console.log(option.randomPrays);
		},
		methods: {
			explain() {
				this.imageShow = !this.imageShow
			}
		}
	}
</script>

<style lang="less">
	html {
		background-color: rgb(226, 216, 196) !important;
	}

	page {
		background-color: rgb(226, 216, 196) !important;
	}

	.content {
		padding-bottom: 200rpx;
		position: relative;
		top: 200rpx;
		width: 100%;
		min-height: 300rpx;
		border-radius: 40rpx 40rpx 0 0;
		overflow: hidden;
		padding: 40rpx 0;

		.container {
			width: 100%;
			height: calc(100vh - 280rpx);
			background-color: rgb(226, 216, 196);
		}

		.backImage {
			width: 110%;
			height: calc(100vh);
			position: absolute;
			// top: -11%;
			left: 50%;
			transform: translateX(-50%);
			z-index: 1;
		}

		.zhangYiNa {

			.text,
			image {
				border-radius: 10rpx;
				position: absolute;
				z-index: 16;
				width: 70%;
				left: 50%;
				top: 900rpx;
				transform: translate(-50%, -50%);
				text-align: center;
				text-indent: 2em;
				overflow: scroll;
			}

			.text {
				top: 950rpx;
				height: 60%;
				overflow: scroll;
				line-height: 60rpx;
				text-align: left;
				font-family: "阿里妈妈方圆体 VF Regular" !important;
				height: 950rpx;
			}

			.text::-webkit-scrollbar {
				width: 0;
				height: 0;
				color: transparent;
			}
		}
	}

	.getIn {
		animation: fadeIn 1s 1;
	}

	.getOut {
		animation: fadeOut 1s 1;
	}

	/* 淡入淡出start */
	@keyframes fadeIn {
		0% {
			opacity: 0;
		}

		100% {
			opacity: 1;
		}
	}

	@keyframes fadeOut {
		0% {
			opacity: 1;
		}

		100% {
			opacity: 0;
		}
	}
</style>