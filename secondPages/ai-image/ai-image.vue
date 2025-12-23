<template>
	<pageBack :titleInfo="titleInfo"></pageBack>
	<view class="content">
		<!-- 聊天内容区域 -->
		<scroll-view class="chat-content" scroll-y="true" :scroll-top="scrollTop" scroll-with-animation @scroll="handleScroll">
			<!-- 欢迎语 -->
			<view class="welcome-item" v-if="chatList.length === 0">
				<image class="avatar ai-avatar" src="/static/logo.png" mode="widthFix"></image>
				<view class="welcome-bubble">你好呀！我是湄洲岛妈祖AI助手——小默，有什么问题都可以问我～</view>
			</view>

			<!-- 消息列表 -->
			<view class="msg-item" v-for="(msg, idx) in chatList" :key="idx">
				<!-- 用户消息（右侧：头像 + 气泡） -->
				<view class="user-msg" v-if="msg.role === 'user'">
					<view class="msg-wrap">
						<view class="user-bubble">{{ msg.content }}</view>
						<!-- 优化：直接使用默认头像路径，简化error逻辑 -->
						<image class="avatar user-avatar" :src="userAvatar" mode="widthFix" />
					</view>
				</view>

				<!-- AI消息（左侧：头像 + 气泡） -->
				<view class="ai-msg" v-else>
					<view class="msg-wrap">
						<image class="avatar ai-avatar" src="/static/logo.png" mode="widthFix"></image>
						<!-- 解析换行符：将↵/\n替换为<br/>并使用v-html渲染 -->
						<view class="ai-bubble" v-html="parseLineBreak(msg.content)"></view>
					</view>
				</view>
			</view>
		</scroll-view>

		<!-- 输入区域 -->
		<view class="input-area">
			<input class="msg-input" v-model="inputContent" placeholder="请输入你的问题..." confirm-type="send" @confirm="sendMessage" :disabled="isLoading" />
			<button class="send-btn" @click="sendMessage" :disabled="!inputContent.trim() || isLoading">发送</button>
		</view>
	</view>
</template>

<script>
import pageBack from '/components/title/title.vue';
import request from '@/utils/request.js';
// 引入pinia的userInfo store
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
			isLoading: false,
			scrollHeight: 0 // 记录滚动容器高度
		};
	},
	computed: {
		// 计算属性：获取用户头像，无则返回默认值
		userAvatar() {
			// 从pinia获取用户信息
			const userInfoStore = useUserInfoStore();
			const { userInfo } = storeToRefs(userInfoStore);

			// 优先级：pinia中的头像 > 缓存中的头像 > 默认头像
			const avatar = userInfo.value.avatar || uni.getStorageSync('userAvatar') || '/static/user-avatar.png';
			return avatar;
		}
	},
	onLoad() {
		this.generateSessionId();
	},
	methods: {
		// 生成会话ID
		generateSessionId() {
			this.sessionId = `chat_${Date.now()}_${Math.floor(Math.random() * 9999)}`;
		},

		// 处理滚动事件（记录滚动高度）
		handleScroll(e) {
			this.scrollHeight = e.detail.scrollHeight;
		},

		// 发送消息
		sendMessage() {
			const content = this.inputContent.trim();
			if (!content || this.isLoading) return;

			// 添加用户消息
			this.chatList.push({
				role: 'user',
				content: content
			});
			this.inputContent = '';
			this.scrollToBottom();

			// 调用AI接口
			this.isLoading = true;
			this.getAiReply(content);
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

				// 解析返回数据：优先取res.reply，其次res.data.reply
				const aiReply = res?.reply || res?.data?.reply || '抱歉，我暂时无法回答这个问题';

				// 添加AI回复
				this.chatList.push({
					role: 'ai',
					content: aiReply
				});
			} catch (error) {
				console.error('AI接口调用失败：', error);
				// 错误提示（区分不同错误类型）
				this.chatList.push({
					role: 'ai',
					content: this.getErrorMsg(error)
				});
			} finally {
				this.isLoading = false;
				this.scrollToBottom();
			}
		},

		// 错误提示（更友好的文案）
		getErrorMsg(error) {
			if (error.errMsg?.includes('timeout')) return '请求超时啦😥，请检查网络后重试～';
			if (error.errMsg?.includes('request:fail')) return '网络开小差了📶，请检查网络连接～';
			if (error.statusCode === 401) return '权限不足🚫，请重新登录～';
			if (error.statusCode === 404) return '接口未找到🔍，请联系管理员～';
			if (error.statusCode === 500) return '服务器开小差了💻，请稍后再试～';
			return '抱歉😞，暂时无法回答你的问题～';
		},

		// 解析换行符（适配↵和\n，防XSS）
		parseLineBreak(content) {
			if (!content) return '';
			// 替换所有↵和\n为<br/>，同时转义特殊字符避免XSS
			return content
				.replace(/&/g, '&amp;')
				.replace(/</g, '&lt;')
				.replace(/>/g, '&gt;')
				.replace(/"/g, '&quot;')
				.replace(/'/g, '&#39;')
				.replace(/↵/g, '<br/>')
				.replace(/\n/g, '<br/>');
		},

		// 滚动到底部（优化稳定性）
		scrollToBottom() {
			this.$nextTick(() => {
				// 延迟确保DOM更新完成
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
		flex-shrink: 0; // 关键：防止头像被压缩
		border: 2px solid #fff;
		box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.1);
		// 新增：图片加载失败时的默认样式兜底
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

	// 聊天内容区域
	.chat-content {
		width: 95%;
		margin: 0 auto;
		height: calc(100vh - 320rpx);
		overflow-y: auto;
		// 滚动条优化
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

		// 消息项（核心修复：只在最外层控制对齐）
		.msg-item {
			margin-bottom: 25rpx;
			display: flex;
			width: 100%;
		}

		// 用户消息（右侧）- 核心修复
		.user-msg {
			width: 100%;
			display: flex;
			justify-content: flex-end; // 只在这层控制右对齐

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
					box-sizing: border-box; // 关键：padding不撑大宽度
				}

				.user-avatar {
					margin-bottom: 5rpx;
				}
			}
		}

		// AI消息（左侧）- 核心修复
		.ai-msg {
			width: 100%;
			display: flex;
			justify-content: flex-start; // 只在这层控制左对齐

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
					box-sizing: border-box; // 关键：padding不撑大宽度
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
</style>
