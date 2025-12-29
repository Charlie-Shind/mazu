<template>
	<pageBack :titleInfo="titleInfo"></pageBack>
	<view class="content">
		<!-- 聊天内容区域 -->
		<scroll-view class="chat-content" scroll-y="true" :scroll-top="scrollTop" scroll-with-animation @scroll="handleScroll" :style="{ height: chatContentHeight }">
			<!-- 欢迎语 -->
			<view class="welcome-item" v-if="chatList.length === 0 && !isLoading">
				<view class="avatar-container">
					<image
						class="avatar ai-avatar"
						src="https://javaweb-ai-ch.oss-cn-beijing.aliyuncs.com/2025/12/a3eff5e71a2c292bdae4f7f64ca5d01b.png"
						mode="widthFix"
						lazy-load
						@error="handleAvatarError"
					></image>
				</view>
				<view class="welcome-bubble">你好呀！我是湄洲岛妈祖AI助手——小默，有什么问题都可以问我～</view>
			</view>

			<!-- 消息列表 -->
			<view class="msg-item" v-for="(msg, idx) in chatList" :key="idx + msg.role">
				<!-- 用户消息（右侧：头像 + 气泡） -->
				<view class="user-msg" v-if="msg.role === 'user'">
					<view class="msg-wrap">
						<view class="bubble-wrapper">
							<view class="user-bubble">{{ msg.content }}</view>
						</view>
						<view class="avatar-container">
							<image
								class="avatar user-avatar"
								src="https://javaweb-ai-ch.oss-cn-beijing.aliyuncs.com/2025/12/%E5%A6%88%E7%A5%96IP_c99e1313-10d5-4c9d-83ec-47c4cfe6440d.png"
								mode="widthFix"
								lazy-load
								@error="handleAvatarError"
							></image>
						</view>
					</view>
				</view>

				<!-- AI消息（左侧：头像 + 气泡） -->
				<view class="ai-msg" v-else-if="msg.role === 'ai'">
					<view class="msg-wrap">
						<view class="avatar-container">
							<image
								class="avatar ai-avatar"
								src="https://javaweb-ai-ch.oss-cn-beijing.aliyuncs.com/2025/12/a3eff5e71a2c292bdae4f7f64ca5d01b.png"
								mode="widthFix"
								lazy-load
								@error="handleAvatarError"
							></image>
						</view>
						<!-- ✅ 核心修复：气泡外层套固定高度容器 -->
						<view class="bubble-wrapper">
							<view class="ai-bubble" v-html="parseLineBreak(msg.content)"></view>
						</view>
					</view>
				</view>

				<!-- AI加载中状态 -->
				<view class="ai-msg loading" v-else-if="msg.role === 'ai-loading'">
					<view class="msg-wrap">
						<view class="avatar-container">
							<image
								class="avatar ai-avatar"
								src="https://javaweb-ai-ch.oss-cn-beijing.aliyuncs.com/2025/12/a3eff5e71a2c292bdae4f7f64ca5d01b.png"
								mode="widthFix"
								lazy-load
								@error="handleAvatarError"
							></image>
						</view>
						<view class="bubble-wrapper">
							<view class="ai-bubble loading-bubble">
								<view class="loading-dots">
									<view class="dot"></view>
									<view class="dot"></view>
									<view class="dot"></view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>

		<!-- 输入区域 -->
		<view class="input-area">
			<input class="msg-input" v-model="inputContent" placeholder="请输入你的问题..." confirm-type="send" @confirm="sendMessage" :disabled="isLoading" @input="handleInput" />
			<button class="send-btn" @click="sendMessage" :disabled="!inputContent.trim() || isLoading">
				{{ isSending ? '发送中...' : '发送' }}
			</button>
		</view>

		<!-- 底部状态提示 -->
		<view class="status-tip" v-if="showStatusTip" :class="{ show: showStatusTip }">
			{{ statusTipText }}
		</view>
	</view>
</template>

<script>
import pageBack from '/components/title/title.vue';
import request from '@/utils/request.js';
import { useUserInfoStore } from '@/store/userInfo.js';
import { storeToRefs } from 'pinia';

export default {
	components: {
		pageBack
	},
	name: 'AiChatPage',
	data() {
		return {
			titleInfo: {
				titleShow: true,
				title: '妈祖AI助手-小默',
				imageUrl: 'http://t73sifiwt.hn-bkt.clouddn.com/pageBack/1.webp',
				heightShow: false,
				backShow: true
			},
			inputContent: '',
			chatList: [],
			scrollTop: 0,
			sessionId: '',
			isLoading: false, // AI加载状态
			isSending: false, // 用户发送状态
			scrollHeight: 0,
			showStatusTip: false, // 是否显示状态提示
			statusTipText: '', // 状态提示文本
			inputTimer: null, // 输入防抖定时器
			chatContentHeight: 'calc(100vh - 320rpx)', // 聊天区域高度（避免动态计算闪烁）
			statusTimer: null, // 状态提示定时器
			scrollTimer: null, // 滚动防抖定时器
			scrollPending: false, // 滚动标记
			resizeTimer: null // 窗口调整定时器
		};
	},
	computed: {
		userAvatar() {
			const userInfoStore = useUserInfoStore();
			const { userInfo } = storeToRefs(userInfoStore);
			const avatar = userInfo.value?.avatar || uni.getStorageSync('userAvatar') || '/static/user-avatar.png';
			return avatar;
		}
	},
	onLoad() {
		this.generateSessionId();
		this.initChatHeight();
	},
	onUnload() {
		clearTimeout(this.inputTimer);
		clearTimeout(this.statusTimer);
		clearTimeout(this.scrollTimer);
		clearTimeout(this.resizeTimer);
		this.inputTimer = null;
		this.statusTimer = null;
		this.scrollTimer = null;
		this.resizeTimer = null;
	},
	onResize() {
		clearTimeout(this.resizeTimer);
		this.resizeTimer = setTimeout(() => {
			this.initChatHeight();
		}, 100);
	},
	methods: {
		handleAvatarError(e) {
			e.target.src = '/static/default-avatar.png';
		},
		initChatHeight() {
			uni.getSystemInfo({
				success: (res) => {
					const windowHeight = res.windowHeight;
					const safeBottom = res.safeAreaInsets?.bottom || 0;
					this.chatContentHeight = `${windowHeight - 160 - safeBottom}px`;
				}
			});
		},
		generateSessionId() {
			this.sessionId = `chat_${Date.now()}_${Math.floor(Math.random() * 9999)}`;
		},
		handleScroll(e) {
			if (!this.scrollTimer) {
				this.scrollTimer = setTimeout(() => {
					this.scrollHeight = e.detail.scrollHeight;
					clearTimeout(this.scrollTimer);
					this.scrollTimer = null;
				}, 50);
			}
		},
		handleInput() {
			clearTimeout(this.inputTimer);
			clearTimeout(this.statusTimer);
			if (this.inputContent.trim()) {
				this.showStatusTip = true;
				this.statusTipText = '你正在输入...';
				this.inputTimer = setTimeout(() => {
					this.showStatusTip = false;
				}, 2000);
			} else {
				this.showStatusTip = false;
			}
		},
		sendMessage() {
			const content = this.inputContent.trim();
			if (!content || this.isLoading || this.isSending) return;
			this.isSending = true;
			this.showStatusTip = true;
			this.statusTipText = '正在发送消息...';
			this.chatList.push({
				role: 'user',
				content: content
			});
			this.inputContent = '';
			this.scrollToBottom();
			setTimeout(() => {
				this.isSending = false;
				this.showAiLoading();
				this.getAiReply(content);
			}, 300);
		},
		showAiLoading() {
			this.isLoading = true;
			this.showStatusTip = true;
			this.statusTipText = '小默正在思考...';
			const lastItem = this.chatList[this.chatList.length - 1];
			if (!lastItem || lastItem.role !== 'ai-loading') {
				this.chatList.push({
					role: 'ai-loading'
				});
			}
			this.scrollToBottom();
		},
		removeAiLoading() {
			this.isLoading = false;
			this.chatList = this.chatList.filter((item) => item.role !== 'ai-loading');
		},
		async getAiReply(question) {
			try {
				const res = await request({
					url: '/user/user/chat',
					method: 'POST',
					data: {
						message: question,
						sessionId: this.sessionId,
						tenantId: uni.getStorageSync('tenantId') || 'xxx'
					},
					useAiUrl: true,
					timeout: 20000
				});
				this.removeAiLoading();
				const aiReply = res?.reply || res?.data?.reply || '抱歉，我暂时无法回答这个问题';
				this.chatList.push({
					role: 'ai',
					content: aiReply
				});
				this.showStatusTip = true;
				this.statusTipText = '小默已回复';
				this.statusTimer = setTimeout(() => {
					this.showStatusTip = false;
				}, 1500);
				this.scrollToBottom();
			} catch (error) {
				console.error('AI接口调用失败：', error);
				this.removeAiLoading();
				this.chatList.push({
					role: 'ai',
					content: this.getErrorMsg(error)
				});
				this.showStatusTip = true;
				this.statusTipText = '回复失败';
				this.statusTimer = setTimeout(() => {
					this.showStatusTip = false;
				}, 2000);
				this.scrollToBottom();
			}
		},
		getErrorMsg(error) {
			if (error.errMsg?.includes('timeout')) return '请求超时啦😥，请检查网络后重试～';
			if (error.errMsg?.includes('request:fail')) return '网络开小差了📶，请检查网络连接～';
			if (error.statusCode === 401) return '权限不足🚫，请重新登录～';
			if (error.statusCode === 404) return '接口未找到🔍，请联系管理员～';
			if (error.statusCode === 500) return '服务器开小差了💻，请稍后再试～';
			return '抱歉😞，暂时无法回答你的问题～';
		},
		parseLineBreak(content) {
			if (!content) return '';
			return content
				.replace(/&/g, '&amp;')
				.replace(/</g, '&lt;')
				.replace(/>/g, '&gt;')
				.replace(/"/g, '&quot;')
				.replace(/'/g, '&#39;')
				.replace(/↵/g, '<br/>')
				.replace(/\n/g, '<br/>');
		},
		scrollToBottom() {
			this.$nextTick(() => {
				if (!this.scrollPending) {
					this.scrollPending = true;
					setTimeout(() => {
						const query = uni.createSelectorQuery().in(this);
						query
							.select('.chat-content')
							.boundingClientRect((rect) => {
								if (rect) {
									this.scrollTop = rect.scrollHeight || 999999;
								}
							})
							.exec(() => {
								this.scrollPending = false;
							});
					}, 50);
				}
			});
		}
	}
};
</script>

<style lang="less" scoped>
@safe-bottom: constant(safe-area-inset-bottom);
@safe-bottom: env(safe-area-inset-bottom);

.content {
	position: relative;
	top: 160rpx;
	width: 100%;
	min-height: calc(100vh - 160rpx - @safe-bottom);
	background-color: #f5f0e6;
	overflow: hidden;
	padding: 20rpx 10rpx;
	padding-bottom: calc(20rpx + @safe-bottom);
	box-sizing: border-box;

	.avatar-container {
		width: 60rpx;
		height: 60rpx;
		border-radius: 50%;
		overflow: hidden;
		flex-shrink: 0; // ✅ 强制固定宽高，不被flex压缩
		border: 2px solid #fff;
		box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.1);
		background-color: #eee;

		.avatar {
			width: 100%;
			height: 100%;
			display: block;
		}
	}

	.status-tip {
		position: absolute;
		bottom: calc(120rpx + @safe-bottom);
		left: 50%;
		transform: translateX(-50%) translateY(10rpx);
		background-color: rgba(0, 0, 0, 0.7);
		color: #fff;
		font-size: 24rpx;
		padding: 10rpx 20rpx;
		border-radius: 30rpx;
		z-index: 99;
		opacity: 0;
		transition: opacity 0.3s ease, transform 0.3s ease;

		&.show {
			opacity: 1;
			transform: translateX(-50%) translateY(0);
		}
	}

	.chat-content {
		width: 95%;
		margin: 0 auto;
		overflow-y: auto;
		-webkit-overflow-scrolling: touch;
		will-change: scroll-position;

		&::-webkit-scrollbar {
			width: 4rpx;
		}
		&::-webkit-scrollbar-thumb {
			background-color: #8b2323;
			border-radius: 2rpx;
		}

		.welcome-item {
			display: flex;
			align-items: flex-start;
			gap: 15rpx;
			margin: 10rpx 0 20rpx;

			.avatar-container {
				margin-top: 5rpx;
			}

			.welcome-bubble {
				background-color: #fff;
				padding: 15rpx 25rpx;
				border-radius: 15rpx;
				font-size: 28rpx;
				color: #333;
				max-width: 70%;
				box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
			}
		}

		.msg-item {
			margin-bottom: 25rpx;
			display: flex;
			width: 100%;
		}

		// ✅ 核心修复1：用户消息布局 - 固定头像在底部，不受文本高度影响
		.user-msg {
			width: 100%;
			display: flex;

			.msg-wrap {
				width: 100%;
				display: flex;
				justify-content: flex-end; // 头像始终对齐气泡底部
				gap: 15rpx;

				// ✅ 核心：气泡容器固定最大宽度，文本自动换行不影响布局
				.bubble-wrapper {
					max-width: 70%;
					display: flex;
					align-items: flex-end;
				}

				.user-bubble {
					background-color: #8b2323;
					color: #fff;
					padding: 18rpx 25rpx;
					border-radius: 15rpx 15rpx 0 15rpx;
					font-size: 28rpx;
					width: 100%; // 占满容器宽度，避免收缩
					word-wrap: break-word;
					word-break: break-all; // 强制长文本换行
					line-height: 36rpx;
					box-shadow: 0 2rpx 8rpx rgba(139, 35, 35, 0.15);
					box-sizing: border-box;
				}

				.avatar-container {
					// ✅ 固定头像位置，不随文本偏移
					align-self: flex-end;
					margin-bottom: 0; // 移除多余margin，避免偏移
				}
			}
		}

		// ✅ 核心修复2：AI消息布局 - 固定头像在顶部，不受文本高度影响
		.ai-msg {
			width: 100%;
			display: flex;
			justify-content: flex-start;

			.msg-wrap {
				display: flex;
				align-items: flex-start; // 头像始终对齐气泡顶部
				gap: 15rpx;

				.avatar-container {
					align-self: flex-start;
					margin-top: 0; // 移除多余margin，避免偏移
				}

				.bubble-wrapper {
					max-width: 70%;
					display: flex;
					align-items: flex-start;
				}

				.ai-bubble {
					background-color: #fff;
					padding: 18rpx 25rpx;
					border-radius: 15rpx 15rpx 15rpx 0;
					font-size: 28rpx;
					color: #333;
					width: 100%;
					word-wrap: break-word;
					word-break: break-all;
					line-height: 40rpx;
					white-space: pre-wrap;
					box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
					box-sizing: border-box;
				}

				.loading-bubble {
					display: flex;
					align-items: center;
					justify-content: center;
					min-width: 120rpx;
					height: 80rpx;
				}
			}
		}

		.loading-dots {
			display: flex;
			align-items: center;
			justify-content: center;
			gap: 8rpx;

			.dot {
				width: 16rpx;
				height: 16rpx;
				border-radius: 50%;
				background-color: #8b2323;
				animation: dotBounce 1.4s infinite ease-in-out both;
				will-change: transform;

				&:nth-child(1) {
					animation-delay: -0.32s;
				}

				&:nth-child(2) {
					animation-delay: -0.16s;
				}
			}
		}
	}

	.input-area {
		width: 95%;
		height: 100rpx;
		background-color: #fff;
		display: flex;
		align-items: center;
		padding: 0 20rpx;
		border-radius: 50rpx;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
		box-sizing: border-box;
		position: fixed;
		bottom: 40px;

		.msg-input {
			flex: 1;
			height: 70rpx;
			background-color: transparent;
			font-size: 28rpx;
			border: none;
			outline: none;
			padding: 0 10rpx;
			box-sizing: border-box;
		}

		.send-btn {
			width: 110rpx;
			height: 70rpx;
			background-color: #8b2323;
			color: #fff;
			border-radius: 35rpx;
			border: none;
			font-size: 28rpx;
			margin-left: 15rpx;
			display: flex;
			align-items: center;
			justify-content: center;

			&:disabled {
				background-color: #ccc;
				color: #999;
			}
		}
	}
}

@keyframes dotBounce {
	0%,
	80%,
	100% {
		transform: scale(0);
	}
	40% {
		transform: scale(1);
	}
}
</style>