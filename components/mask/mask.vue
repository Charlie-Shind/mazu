<template>
	<transition name="mask-transition">
		<view class="content" v-if="isShow" @click.stop.prevent="onMaskClick">
			<view class="container">
				<image src="http://t73sifiwt.hn-bkt.clouddn.com/component/mask/mask.png" mode="aspectFill" />
				<view class="btn" @click.stop.prevent="closeMask">跳过({{ time }}s)</view>
			</view>
		</view>
	</transition>
</template>

<script>
import { userVisitCountAPI, visitCountAPI } from '/apis/user.js';
import { useUserInfoStore } from '/store/userInfo.js';

export default {
	data() {
		return {
			isShow: false,
			time: 5,
			timer: null,
			clickLocked: false // 防止重复触发
		};
	},
	mounted() {
		this.isShow = true;
		this.autoClose();

		const user = useUserInfoStore().$state.userInfo;
		if (user?.id) userVisitCountAPI(user.id);
		visitCountAPI();
	},
	methods: {
		// 点击遮罩空白区域时不触发任何事件
		onMaskClick(e) {
			e.preventDefault();
			e.stopPropagation();
			return false;
		},

		// 点击“跳过”
		closeMask(e) {
		  if (e && e.stopPropagation) e.stopPropagation();
		  this.isShow = false;

		  // 延迟发事件，让动画执行完
		  setTimeout(() => {
		    this.$emit('mask-closed', true);
		  }, 800);
		},

		// 自动倒计时关闭
		autoClose() {
			this.timer = setInterval(() => {
				this.time--;
				if (this.time <= 0) {
					clearInterval(this.timer);
					this.closeMask();
				}
			}, 1000);
		}
	},
	beforeDestroy() {
		clearInterval(this.timer);
	}
};
</script>

<style lang="less" scoped>
.content {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: 9999;
	background-color: rgba(0, 0, 0, 0.5);

	.container {
		position: relative;
		width: 100%;
		height: 100vh;

		image {
			width: 100%;
			height: 100%;
		}

		.btn {
			position: absolute;
			top: 13%;
			right: 5%;
			z-index: 10000;
			padding: 20rpx 40rpx;
			border-radius: 40rpx;
			background-color: rgba(0, 0, 0, 0.5);
			color: #fff;
			font-size: 28rpx;
		}
	}
}

/* 动画 */
.mask-transition-enter-active,
.mask-transition-leave-active {
	transition: all 0.5s ease;
}

.mask-transition-enter-from {
	opacity: 0;
	transform: translateY(-100%);
}

.mask-transition-enter-to,
.mask-transition-leave-from {
	opacity: 1;
	transform: translateY(0);
}

.mask-transition-leave-to {
	opacity: 0;
	transform: translateY(-100%);
}
</style>
