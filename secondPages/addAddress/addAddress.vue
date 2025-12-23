<template>
	<pageBack :titleInfo="titleInfo"></pageBack>
	<view class="content">
		<view class="info">
			<view class="default">
				<text>填写地址</text>
				<label class="radio" @click="isDefault = !isDefault">
					<view class="radio2" :class="{'radio2_active' : isDefault}">

					</view>
					<text>默认收货地址</text>
				</label>
			</view>
			<view class="form">
				<view class="name flex">
					<label>收货人</label>
					<input v-model="name" type="text" placeholder="请输入收货人姓名" />
				</view>
				<view class="phone flex">
					<label>联系电话</label>
					<input v-model="phone" type="text" placeholder="手机号码" />
				</view>
				<view class="region flex">
					<label>所在地区</label>
					<view class="region-picker">
						<text @tap="open">{{this.str}}</text>
						<cityPicker :column="column" :default-value="defaultValue" :mask-close-able="maskCloseAble"
							@confirm="confirm" @cancel="cancel" :visible="visible" />
					</view>
				</view>
				<view class="address flex">
					<label>详细地址</label>
					<input style="width:75%;" v-model="address" type="text" placeholder="小区、门牌号等" />
				</view>
			</view>
		</view>
		<view class="save">
			<view class="saveButton" @click="save">
				保存地址
			</view>
		</view>
	</view>
</template>

<script>
	import pageBack from "/components/title/title.vue";
	import cityPicker from '@/uni_modules/piaoyi-cityPicker/components/piaoyi-cityPicker/piaoyi-cityPicker'
	import {
		addAddressAPI,
		getIdAddressAPI,
		editAddressAPI
	} from "../../apis/shop.js"
	import {
		useUserInfoStore
	} from "/store/userInfo.js"
	export default {
		data() {
			return {
				titleInfo: {
					titleShow: true,
					title: "新增地址",
					imageUrl: "http://t73sifiwt.hn-bkt.clouddn.com/pageBack/1.webp",
					heightShow: false,
					backShow: true
				},
				addList: [],
				isDefault: false,
				visible: false,
				maskCloseAble: true,
				// 地址字符串  
				str: '请选择地址',
				// 省  
				provinceName: null,
				// 市  
				city: null,
				// 区  
				district: null,
				defaultValue: '',
				column: 3,
				isDefault: false,
				name: null,
				phone: null,
				address: null,
				addressId: null
			};
		},
		components: {
			pageBack,
			cityPicker
		},
		onLoad(option) {
			if (option.pageCode == 2 && option.addressId) {
				this.titleInfo.title = "修改地址"
				this.addressId = option.addressId
				getIdAddressAPI(option.addressId).then((res) => {
					this.name = res.message[0].name
					this.address = res.message[0].remark
					this.phone = res.message[0].mobile
					this.isDefault = res.message[0].isDefault
					// 赋值省市区  
					this.provinceName = res.message[0].province_id
					this.city = res.message[0].city_id
					this.district = res.message[0].district_id
					this.str =
						`${res.message[0].province_id}-${res.message[0].city_id}-${res.message[0].district_id}`
				})
			}
			this.getRegions()
		},
		methods: {
			open() {
				this.visible = true
			},
			confirm(val) {
				this.str = `${val.provinceName}-${val.cityName}-${val.areaName}`
				this.provinceName = val.provinceName
				this.city = val.cityName
				this.district = val.areaName
				this.visible = false
			},
			cancel() {
				this.visible = false
			},
			// 提交  
			save() {
				// 检查所有字段是否为空  
				if (!this.name || !this.phone || !this.address || !this.provinceName || !this.city || !this.district) {
					uni.showToast({
						title: "请填写完整的地址信息",
						icon: 'none'
					})
					return
				}

				if (this.addressId == null) {
					addAddressAPI({
						user_id: useUserInfoStore().$state.userInfo.id,
						province: this.provinceName,
						city: this.city,
						district: this.district,
						remark: this.address,
						name: this.name,
						mobile: this.phone,
						isDefault: this.isDefault
					}).then((res) => {
						this.message(res)
					})
				} else {
					editAddressAPI({
						id: this.addressId,
						user_id: useUserInfoStore().$state.userInfo.id,
						province: this.provinceName,
						city: this.city,
						district: this.district,
						remark: this.address,
						name: this.name,
						mobile: this.phone,
						isDefault: this.isDefault
					}).then((res) => {
						this.message(res)
					})
				}
			},
			message(res) {
				if (res.status == 200) {
					uni.navigateBack({
						delta: 1
					})
					uni.showToast({
						title: "保存成功"
					})
				} else {
					uni.showToast({
						title: res.message,
						icon: 'error'
					})
				}
			}
		},
		onPageScroll(e) {
			if (e.scrollTop >= 80) {
				this.titleInfo.heightShow = true
			}
			if (e.scrollTop < 80) {
				this.titleInfo.heightShow = false
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
		font-family: "阿里妈妈方圆体 VF Regular" !important;

		.info {
			width: 90%;
			margin: auto;

			.default {
				display: flex;
				align-items: baseline;
				justify-content: space-between;

				text {
					font-size: 38rpx;
					font-weight: bold;
				}

				.radio {
					display: flex;
					align-items: center;

					text {
						font-size: 28rpx;
						font-weight: normal;
					}

					.radio2 {
						width: 28rpx;
						height: 28rpx;
						background-color: #fff;
						border: 2rpx solid #4d0000;
						border-radius: 100%;
						margin-right: 10rpx;
					}

					.radio2_active {
						background-color: #4d0000;
						border: 2rpx solid #000;
					}
				}
			}

			.form {
				padding-top: 40rpx;

				.region-picker {
					font-size: 28rpx;
				}

				view {
					height: 100rpx;
					border-bottom: 2rpx solid rgba(0, 0, 0, 0.05);
					display: flex;
					align-items: center;

					label {
						font-size: 32rpx;
						width: 160rpx;
					}

					input {
						font-size: 28rpx;
					}
				}
			}
		}

		.save {
			width: 100%;
			height: 160rpx;
			display: flex;
			justify-content: center;
			align-items: center;

			.saveButton {
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

	.flex {
		display: flex;
		align-items: center;
	}
</style>