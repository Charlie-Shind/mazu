<template>
	<pageBack :titleInfo="titleInfo"></pageBack>
	<view class="content">
		<view class="container">
			<image class="backImage" src="http://t73sifiwt.hn-bkt.clouddn.com/prays/mazuback.jpg" mode="scaleToFill"></image>
			<view class="zhangYiNa">
				<image class="getIn" v-if="imageShow" src="../../static/mzlq60.gif" mode="widthFix" @click="explain"></image>
				<view v-else class="getIn text" @click="explain">
					<view>{{ currentSign?.title }}</view>

					<view v-for="(line, i) in currentSign?.content" :key="i">
						{{ line }}
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import pageBack from '/components/title/title.vue';

export default {
	data() {
		return {
			titleInfo: {
				titleShow: true,
				title: '妈祖灵签',
				imageUrl: 'http://t73sifiwt.hn-bkt.clouddn.com/pageBack/1.webp',
				heightShow: false,
				backShow: true,
				classShow: true
			},
			imageShow: true,

			// 🌟 多条灵签数据
			signList: [
				{
					title: '月亮一出来，光辉皎洁……',
					content: [
						'月亮一出来，光辉皎洁，只是浮云遮蔽，总使明月失色。',
						'你该在家里多求神拜佛用心作善事。当官要事理分明，自然会有益处。',
						'此签告诉当事人，人生不如意之事十之八九……',
						'问财：勤劳即可；问婚姻：云遮月，不吉；问疾病：需祈福方好。'
					]
				},
				{
					title: '潮来潮去，无需争抢……',
					content: ['潮水来去自有时，莫强求，莫急躁。', '此签示意凡事顺其自然，自有好结果。', '求财：缓得；求名：需积德；婚姻：等待佳缘；出行：可，但需谨慎。']
				},
				{
					title: '风送祥云，前路渐明……',
					content: ['祥云随风而来，兆示好运将至。', '目前虽有阻碍，但贵人相助，不久便有转机。', '事业：渐佳；婚姻：吉；财运：中上；出行：顺利。']
				},
				{
					title: '春风拂面，百事可期……',
					content: ['春风一到，万物复苏，象征好运即将降临。', '当前困境只是暂时，再坚持便能迎来突破。', '事业：有贵人；财运：渐旺；婚姻：和合；出行：吉。']
				},
				{
					title: '乌云散去，朗日当空……',
					content: ['乌云虽厚，但终会散去，光明自来。', '凡事不必忧心，耐心等待时机便成。', '求财：稍迟；问事：成；婚姻：可合；疾病：渐愈。']
				},
				{
					title: '舟行江上，顺水有风……',
					content: ['船顺水而行，又遇和风，自然轻松顺利。', '此兆表示当事人时运渐开，宜把握机会。', '事业：大吉；考试：有成；求名：可得；婚姻：美满。']
				},
				{
					title: '夜尽天明，否极泰来……',
					content: ['黑夜再长，也终有天明；困厄再深，也终有转机。', '此签示人不必忧，凡事正在好转。', '求财：渐旺；事业：升迁有望；婚姻：和顺；出行：可。']
				},
				{
					title: '松竹常青，心志不摇……',
					content: ['松竹四季常青，象征坚定与福气。', '此签劝人保持本心，坚持正道，自然安泰。', '事业：稳；财运：小旺；婚姻：和；家庭：吉。']
				},
				{
					title: '金风送喜，家宅安宁……',
					content: ['金风带来喜讯，象征家运与事业双旺。', '近期易有好消息，不妨积极争取。', '求财：顺得；事业：上升；婚姻：喜；出行：利。']
				},
				{
					title: '水到渠成，功名可就……',
					content: ['努力已久，此时正是成果显现之时。', '签中示意做事已到成熟阶段，不宜退缩。', '求名：定成；事业：可发；婚姻：佳；财运：上行。']
				}
			],

			// 🌟 当前随机抽到的灵签
			currentSign: null
		};
	},
	components: {
		pageBack
	},
	onLoad(option) {
		// 随机取一条灵签
		const index = Math.floor(Math.random() * this.signList.length);
		this.currentSign = this.signList[index];
	},
	methods: {
		explain() {
			this.imageShow = !this.imageShow;
		}
	}
};
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
			font-family: '阿里妈妈方圆体 VF Regular' !important;
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
