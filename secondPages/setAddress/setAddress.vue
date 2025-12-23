<template>
	<view v-if="addList">
		<pageBack :titleInfo="titleInfo"></pageBack>
		<view class="content">
			<view class="address">
				<view class="item" v-for="item in addList">
					<view class="one" @click="chooseItem(item)">
						<text>{{item.name}}</text>
						<text>{{item.mobile}}</text>
					</view>
					<view class="two" @click="chooseItem(item)">
						<view>
							<text>{{item.province_id}}</text>
							<text>{{item.city_id}}</text>
							<text>{{item.district_id}}</text>
						</view>
						<view>
							<text>{{item.remark}}</text>
						</view>
					</view>
					<view class="edit">
						<view class="default">
							<switch :checked="item.isDefault" @change="handleSwitchChange(item)" />
							<text>设置为默认地址</text>
						</view>
						<view class="label">
							<view class="" @click="toAdd(2,item.id)">
								修改
							</view>
							<view class="" @click="del(item.id,item.user_id)">
								删除
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="addAddress">
				<view class="addButton" @click="toAdd(1)">
					新增收货地址
				</view>
			</view>
		</view>
		<view class="delete-confirm" v-if="showDeleteConfirm">
			<view class="delete-confirm-content">
				<text>确定要删除该条收货地址</text>
				<view class="delete-confirm-buttons">
					<view class="delete-confirm-button" @click="confirmDeleteHistory">确定</view>
					<view class="delete-confirm-button" @click="cancelDeleteHistory">取消</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import pageBack from "/components/title/title.vue";
	import {
		getAddressAPI,
		editAddressAPI,
		delAddressAPI
	} from "../../apis/shop.js"
	import {
		useUserInfoStore
	} from "/store/userInfo.js"
	export default {
		data() {
			return {
				titleInfo: {
					titleShow: true,
					title: "收货地址",
					imageUrl: "http://t73sifiwt.hn-bkt.clouddn.com/pageBack/1.webp",
					heightShow: false,
					backShow: true
				},
				addList: [],
				isDefault: false,
				showDeleteConfirm: false,
				delId: null,
				delUserId: null
			};
		},
		components: {
			pageBack
		},
		onShow() {
			this.getAddress()
		},
		methods: {
			toAdd(code, id) {
				uni.navigateTo({
					url: `/secondPages/addAddress/addAddress?pageCode=${code}&addressId=${id}`
				})
			},
			chooseItem(item) {
				uni.$emit('addressData', item)
				uni.navigateBack({
					delta: 1
				})
			},
			getAddress() {
				getAddressAPI(useUserInfoStore().$state.userInfo.id).then((res) => {
					this.addList = res.message
				})
			},
			handleSwitchChange(item) {
				const newIsDefault = !item.isDefault; // 切换当前开关状态
				// 如果新的 isDefault 为 true，则更新其他地址的 isDefault 为 false
				if (newIsDefault) {
					// 更新其他地址为非默认
					this.addList.forEach(address => {
						if (address.id !== item.id) {
							address.isDefault = false; // 将其他地址的 isDefault 设置为 false
							// 这里可以调用 API 更新其他地址的状态
							editAddressAPI({
								id: address.id,
								user_id: address.user_id,
								province: address.province_id,
								city: address.city_id,
								district: address.district_id,
								remark: address.remark,
								name: address.name,
								mobile: address.mobile,
								isDefault: false // 将其他地址设置为非默认
							});
						}
					});
				}

				// 更新当前地址的 isDefault
				editAddressAPI({
					id: item.id,
					user_id: item.user_id,
					province: item.province_id,
					city: item.city_id,
					district: item.district_id,
					remark: item.remark,
					name: item.name,
					mobile: item.mobile,
					isDefault: newIsDefault // 传递新的 isDefault 值
				}).then((res) => {
					console.log('地址修改成功:', res);
					uni.$emit('addressData', item)
					uni.navigateBack({
						delta: 1
					})
					// 更新本地状态
					item.isDefault = newIsDefault; // 更新当前地址的状态
				}).catch((error) => {
					console.error('地址修改失败:', error);
				});
			},
			del(id, userId) {
				this.showDeleteConfirm = true
				this.delId = id
				this.delUserId = userId
			},
			confirmDeleteHistory() {
				// 删除  
				this.showDeleteConfirm = false;
				delAddressAPI({
					id: this.delId,
					user_id: this.delUserId
				}).then((res) => {
					if (res.status == 200) {
						this.getAddress()
						uni.showToast({
							title: "删除成功"
						})
					} else {
						uni.showToast({
							title: "删除失败" + res.message,
							icon: 'none'
						})
					}
				})
			},
			cancelDeleteHistory() {
				this.showDeleteConfirm = false;
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
		padding: 20rpx 0;
		font-family: "阿里妈妈方圆体 VF Regular" !important;

		.address {
			width: 100%;
			// display: flex;
			// justify-content: space-between;
			// align-items: center;
			position: relative;
			padding-bottom: 20rpx;

			.item {
				margin: auto;
				width: 90%;
				display: flex;
				flex-direction: column;
				justify-content: center;
				// height: 200rpx;
				padding: 20rpx 0;
				border-bottom: 2rpx solid rgba(0, 0, 0, 0.05);

				.one {
					font-size: 38rpx;
					padding: 10rpx 0;

					text {
						padding-right: 20rpx;
					}
				}

				.two {
					font-size: 24rpx;

					text {
						padding-right: 10rpx;
					}
				}

				.edit {
					display: flex;
					justify-content: space-between;
					align-items: center;
					font-size: 28rpx;

					.default {
						display: flex;
						align-items: center;

						switch {
							transform: scale(0.6);
							margin-left: -6%;
						}
					}

					.label {
						display: flex;

						view {
							padding: 10rpx 15rpx;
							margin-left: 10rpx;
							border-radius: 10rpx;
							color: #fff;
						}

						view:first-child {
							background-color: seagreen;
						}

						view:last-child {
							background-color: rgb(170, 0, 0);
						}
					}
				}
			}
		}

		.addAddress {
			width: 100%;
			height: 160rpx;
			display: flex;
			justify-content: center;
			align-items: center;

			.addButton {
				width: 400rpx;
				height: 80rpx;
				background-color: #4d0000;
				color: #fff;
				display: flex;
				justify-content: center;
				align-items: center;
				border-radius: 20rpx;
			}
		}
	}

	.delete-confirm {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.delete-confirm-content {
		background-color: #fff;
		padding: 20px;
		border-radius: 8px;
		text-align: center;
	}

	.delete-confirm-buttons {
		display: flex;
		justify-content: center;
		margin-top: 20px;
	}

	.delete-confirm-button {
		padding: 8px 16px;
		background-color: #4d0000;
		color: #fff;
		border-radius: 4px;
		margin: 0 8px;
		cursor: pointer;
	}
</style>