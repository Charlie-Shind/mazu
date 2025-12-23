<template>
	<pageBack :titleInfo="titleInfo"></pageBack>
	<view class="content">
		<!-- 聊天内容区域 -->
		<scroll-view class="chat-content" scroll-y="true" :scroll-top="scrollTop" scroll-with-animation @scroll="handleScroll">
			<!-- 欢迎语 -->
			<view class="welcome-item" v-if="chatList.length === 0 && !isLoading">
				<image class="avatar ai-avatar" src="/static/logo.png" mode="widthFix"></image>
				<view class="welcome-bubble">你好呀！我是湄洲岛妈祖AI助手——小默，有什么问题都可以问我～</view>
			</view>

			<!-- 消息列表 -->
			<view class="msg-item" v-for="(msg, idx) in chatList" :key="idx">
				<!-- 用户消息（右侧：头像 + 气泡） -->
				<view class="user-msg" v-if="msg.role === 'user'">
					<view class="msg-wrap">
						<view class="user-bubble">{{ msg.content }}</view>
						<image class="avatar user-avatar" src="/static/a3eff5e71a2c292bdae4f7f64ca5d01b.png" mode="widthFix" />
					</view>
				</view>

				<!-- AI消息（左侧：头像 + 气泡） -->
				<view class="ai-msg" v-else-if="msg.role === 'ai'">
					<view class="msg-wrap">
						<image class="avatar ai-avatar" src="/static/logo.png" mode="widthFix"></image>
						<view class="ai-bubble" v-html="parseLineBreak(msg.content)"></view>
					</view>
				</view>

				<!-- AI加载中状态 -->
				<view class="ai-msg loading" v-else-if="msg.role === 'ai-loading'">
					<view class="msg-wrap">
						<image class="avatar ai-avatar" src="/static/logo.png" mode="widthFix"></image>
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
		</scroll-view>

		<!-- 输入区域 -->
		<view class="input-area">
			<input class="msg-input" v-model="inputContent" placeholder="请输入你的问题..." confirm-type="send" @confirm="sendMessage" :disabled="isLoading" @input="handleInput" />
			<button class="send-btn" @click="sendMessage" :disabled="!inputContent.trim() || isLoading">
				{{ isSending ? '发送中...' : '发送' }}
			</button>
		</view>

		<!-- 底部状态提示 -->
		<view class="status-tip" v-if="showStatusTip">
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
			inputTimer: null // 输入防抖定时器
		};
	},
	computed: {
		userAvatar() {
			const userInfoStore = useUserInfoStore();
			const { userInfo } = storeToRefs(userInfoStore);
			const avatar = userInfo.value.avatar || uni.getStorageSync('userAvatar') || '/static/user-avatar.png';
			return avatar;
		}
	},
	onLoad() {
		this.generateSessionId();
	},
	onUnload() {
		// 清除定时器
		if (this.inputTimer) clearTimeout(this.inputTimer);
	},
	methods: {
		// 生成会话ID
		generateSessionId() {
			this.sessionId = `chat_${Date.now()}_${Math.floor(Math.random() * 9999)}`;
		},

		// 处理滚动事件
		handleScroll(e) {
			this.scrollHeight = e.detail.scrollHeight;
		},

		// 处理输入事件（模拟用户正在输入状态）
		handleInput() {
			// 清除之前的定时器
			if (this.inputTimer) clearTimeout(this.inputTimer);

			// 显示用户正在输入状态
			if (this.inputContent.trim()) {
				this.showStatusTip = true;
				this.statusTipText = '你正在输入...';

				// 输入停止2秒后隐藏状态提示
				this.inputTimer = setTimeout(() => {
					this.showStatusTip = false;
				}, 2000);
			} else {
				this.showStatusTip = false;
			}
		},

		// 发送消息
		sendMessage() {
			const content = this.inputContent.trim();
			if (!content || this.isLoading || this.isSending) return;

			// 设置用户发送状态
			this.isSending = true;
			this.showStatusTip = true;
			this.statusTipText = '正在发送消息...';

			// 添加用户消息
			this.chatList.push({
				role: 'user',
				content: content
			});
			this.inputContent = '';
			this.scrollToBottom();

			// 模拟发送延迟（增强交互体验）
			setTimeout(() => {
				this.isSending = false;
				// 显示AI思考状态
				this.showAiLoading();
				// 调用AI接口
				this.getAiReply(content);
			}, 300);
		},

		// 显示AI加载状态
		showAiLoading() {
			this.isLoading = true;
			this.showStatusTip = true;
			this.statusTipText = '小默正在思考...';

			// 添加AI加载中的消息项
			this.chatList.push({
				role: 'ai-loading'
			});
			this.scrollToBottom();
		},

		// 移除AI加载状态
		removeAiLoading() {
			this.isLoading = false;
			this.showStatusTip = false;

			// 移除加载中的消息项
			this.chatList = this.chatList.filter((item) => item.role !== 'ai-loading');
		},

		// 调用AI接口
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

				// 移除加载状态
				this.removeAiLoading();

				// 解析返回数据
				const aiReply = res?.reply || res?.data?.reply || '抱歉，我暂时无法回答这个问题';

				// 添加AI回复
				this.chatList.push({
					role: 'ai',
					content: aiReply
				});

				// 显示AI回复完成状态
				this.showStatusTip = true;
				this.statusTipText = '小默已回复';
				setTimeout(() => {
					this.showStatusTip = false;
				}, 1500);
			} catch (error) {
				console.error('AI接口调用失败：', error);

				// 移除加载状态
				this.removeAiLoading();

				// 错误提示
				this.chatList.push({
					role: 'ai',
					content: this.getErrorMsg(error)
				});

				// 显示错误状态
				this.showStatusTip = true;
				this.statusTipText = '回复失败';
				setTimeout(() => {
					this.showStatusTip = false;
				}, 2000);
			} finally {
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

		// 解析换行符
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

		// 滚动到底部
		scrollToBottom() {
			this.$nextTick(() => {
				setTimeout(() => {
					this.scrollTop = this.scrollHeight || 999999;
				}, 100);
			});
		}
	}
};
</script>

<style lang="less" scoped>
.content {
	position: relative;
	top: 160rpx;
	width: 100%;
	min-height: calc(100vh - 160rpx);
	background-color: #f5f0e6;
	overflow: hidden;
	padding: 20rpx 10rpx;
	box-sizing: border-box;

	// 头像通用样式
	.avatar {
		width: 60rpx;
		height: 60rpx;
		border-radius: 50%;
		flex-shrink: 0;
		border: 2px solid #fff;
		box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.1);
		&:after {
			content: '';
			display: block;
			width: 60rpx;
			height: 60rpx;
			border-radius: 50%;
			background-color: #eee;
			background-image: url('/static/logo.png');
			background-size: cover;
			background-position: center;
		}
	}

	// 状态提示
	.status-tip {
		position: absolute;
		bottom: 120rpx;
		left: 50%;
		transform: translateX(-50%);
		background-color: rgba(0, 0, 0, 0.7);
		color: #fff;
		font-size: 24rpx;
		padding: 10rpx 20rpx;
		border-radius: 30rpx;
		z-index: 99;
		animation: fadeIn 0.3s ease;
	}

	// 聊天内容区域
	.chat-content {
		width: 95%;
		margin: 0 auto;
		height: calc(100vh - 320rpx);
		overflow-y: auto;
		&::-webkit-scrollbar {
			width: 4rpx;
		}
		&::-webkit-scrollbar-thumb {
			background-color: #8b2323;
			border-radius: 2rpx;
		}

		// 欢迎语
		.welcome-item {
			display: flex;
			align-items: flex-start;
			gap: 15rpx;
			margin: 10rpx 0 20rpx;

			.ai-avatar {
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

		// 消息项
		.msg-item {
			margin-bottom: 25rpx;
			display: flex;
			width: 100%;
		}

		// 用户消息
		.user-msg {
			width: 100%;
			display: flex;
			justify-content: flex-end;

			.msg-wrap {
				display: flex;
				align-items: flex-end;
				gap: 15rpx;

				.user-bubble {
					background-color: #8b2323;
					color: #fff;
					padding: 18rpx 25rpx;
					border-radius: 15rpx 15rpx 0 15rpx;
					font-size: 28rpx;
					max-width: 70%;
					word-wrap: break-word;
					line-height: 36rpx;
					box-shadow: 0 2rpx 8rpx rgba(139, 35, 35, 0.15);
					box-sizing: border-box;
				}

				.user-avatar {
					margin-bottom: 5rpx;
				}
			}
		}

		// AI消息
		.ai-msg {
			width: 100%;
			display: flex;
			justify-content: flex-start;

			.msg-wrap {
				display: flex;
				align-items: flex-start;
				gap: 15rpx;

				.ai-avatar {
					margin-top: 5rpx;
				}

				.ai-bubble {
					background-color: #fff;
					padding: 18rpx 25rpx;
					border-radius: 15rpx 15rpx 15rpx 0;
					font-size: 28rpx;
					color: #333;
					max-width: 70%;
					word-wrap: break-word;
					line-height: 40rpx;
					white-space: pre-wrap;
					box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
					box-sizing: border-box;
				}

				// AI加载中气泡样式
				.loading-bubble {
					display: flex;
					align-items: center;
					justify-content: center;
					min-width: 120rpx;
					height: 80rpx;
				}
			}
		}

		// 加载动画样式
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

				&:nth-child(1) {
					animation-delay: -0.32s;
				}

				&:nth-child(2) {
					animation-delay: -0.16s;
				}
			}
		}
	}

	// 输入区域
	.input-area {
		width: 95%;
		margin: 20rpx auto 0;
		height: 100rpx;
		background-color: #fff;
		display: flex;
		align-items: center;
		padding: 0 20rpx;
		border-radius: 50rpx;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
		box-sizing: border-box;

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

// 动画定义
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

@keyframes fadeIn {
	from {
		opacity: 0;
		transform: translate(-50%, -10rpx);
	}
	to {
		opacity: 1;
		transform: translate(-50%, 0);
	}
}
</style>
