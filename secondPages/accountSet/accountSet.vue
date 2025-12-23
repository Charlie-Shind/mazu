<template>
	<pageBack :titleInfo="titleInfo"></pageBack>
	<view class="content">
		<view class="info">
			<view class="infoHeader">
				<button class="avatar-wrapper" open-type="chooseAvatar" bind:chooseavatar="onChooseAvatar">
					<image class="avatar" :src="userInfo.avatarurl" mode="aspectFill"></image>
				</button>
			</view>
			<view class="user">
				<view class="name">
					<input type="nickname" @blur="updateNickname" :value="userInfo.nickname" class="weui-input"
						placeholder="请输入昵称" />
				</view>
			</view>
		</view>
	</view>
	<view class="loginOut" @click="loginOut()">
		退出登录
	</view>
</template>
<script>
	import pageBack from "/components/title/title.vue";
	import {
		useUserInfoStore
	} from "@/store/userInfo.js"
	import {
		editNicknameAPI,
		editUserHeaders
	} from "@/apis/user"
	import {
		base_url
	} from "@/utils/request.js"
	export default {
		data() {
			return {
				titleInfo: {
					titleShow: true,
					title: "账户设置",
					imageUrl: "http://t73sifiwt.hn-bkt.clouddn.com/pageBack/1.webp",
					heightShow: false,
					backShow: true
				},
				userInfo: {}
			};
		},
		onLoad() {
			this.userInfo = useUserInfoStore().$state.userInfo
		},
		components: {
			pageBack
		},
		onChooseAvatar(e) {
			uni.showLoading({
				title: '加载中...'
			});
			const {
				avatarUrl
			} = e.detail;
			const url = `${base_url}/user/editUserHeaders?id=${this.userInfo.id}`;
			const token = uni.getStorageSync('token');
			uni.uploadFile({
				url: url,
				filePath: avatarUrl,
				name: 'img',
				header: {
					'Content-Type': 'application/x-www-form-urlencoded',
					'Authorization': token,
				},
				success: (uploadFileRes) => {
					this.userInfo.avatarurl = avatarUrl;
					useUserInfoStore().$patch({
						userInfo: this.userInfo
					});
					uni.showToast({
						title: JSON.parse(uploadFileRes.data).message
					})
				},
				complete: () => {
					uni.hideLoading();
				}
			});
		},
		methods: {
			loginOut() {
				uni.showLoading({
					title: "退出登录中"
				})
				setTimeout(() => {
					uni.switchTab({
							url: "/pages/mine/mine"
						}),
						this.userInfo = {},
						useUserInfoStore().$reset(),
						uni.hideLoading(),
						uni.showToast({
							title: "成功退出登录",
							mask: true
						})
					uni.clearStorage()
				}, 1000)
			},
			updateNickname(e) {
				const newNickname = e.detail.value;
				if (!newNickname) {
					uni.showToast({
						title: "昵称不能为空",
						icon: "error"
					});
				} else {
					editNicknameAPI({
						name: newNickname,
						id: this.userInfo.id
					}).then((res) => {
						if (res.status == 200) {
							this.userInfo.nickname = newNickname;
							useUserInfoStore().$patch({
								userInfo: this.userInfo
							});
							uni.showToast({
								title: res.message,
								icon: "success"
							});
						} else {
							uni.showToast({
								title: "昵称更新失败" + res.message,
								icon: "error"
							});
						}
					}).catch((err) => {
						uni.showToast({
							title: err,
							icon: "error"
						});
					})
				}
			}
		}
	}
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
		padding: 40rpx 0;

		.infoHeader {
			display: flex;
			justify-content: center;

			.avatar-wrapper {
				background-color: transparent;
				border-radius: 100%;
				border: none;

				image {
					width: 200rpx;
					height: 200rpx;
					border-radius: 100%;
				}
			}

		}

		.user {
			padding: 20rpx;

			.name {
				width: 400rpx;
				height: 80rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				margin: auto;

				input {
					text-align: center;
					border-bottom: 2rpx solid #dedede;
					padding: 20rpx;
					font-size: 36rpx;
				}
			}
		}
	}

	.loginOut {
		position: absolute;
		bottom: 10%;
		left: 50%;
		transform: translateX(-50%);
		width: 50%;
		height: 100rpx;
		background-color: #4d0000;
		color: #fffF;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 36rpx;
		border-radius: 40rpx;
	}
</style>