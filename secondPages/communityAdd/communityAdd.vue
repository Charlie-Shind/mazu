<template>
	<pageBack :titleInfo="titleInfo"></pageBack>
	<view class="content">
		<view class="richtext">
			<input class="titleContent" type="text" placeholder="标题" v-model="title" />
			<piaoyiEditor :values="values" :maxlength="3000" :readOnly="readOnly" :photoUrl="photoUrl" :api="api" :name="name" @changes="saveContens" />
		</view>
		<view class="uploadImage">
			<view class="i" v-for="(item, index) in imageList" :key="index">
				<image :src="item" mode="aspectFill"></image>
				<view class="deleteBtn" @click="deleteImage(index, 'error')">
					<text>×</text>
				</view>
			</view>
			<view class="" v-if="imageList.length < 9" @click="chooseImage">
				<image class="chooseSvg" src="/static/add.svg" mode=""></image>
			</view>
		</view>
		<view class="button">
			<view class="select" @click="selectTopic">
				<picker class="picker" @change="changePickerUnit($event, unitList)" :value="indexUnit" :range="unitList" :range-key="'name'">
					<view class="picker">
						<!-- {{unitList[indexUnit].name}} -->
						# {{ unitName }}
					</view>
				</picker>
			</view>
			<view class="add" @click="addButton">发布</view>
		</view>
	</view>
	<uni-popup ref="popup" type="dialog">
		<uni-popup-dialog
			:type="msgType"
			cancelText="取消"
			confirmText="确定"
			title="提示"
			content="确定要删除此图片吗?"
			@confirm="confirmDeleteImage"
			@close="dialogClose"
		></uni-popup-dialog>
	</uni-popup>
</template>

<script>
import pageBack from '/components/title/title.vue';
import piaoyiEditor from '@/uni_modules/piaoyi-editor/components/piaoyi-editor/piaoyi-editor.vue';
import { base_url } from '@/utils/request.js';
import { useUserInfoStore } from '@/store/userInfo.js';
import { getCommunityTopicAPI, uploadCommunityAPI } from '/apis/community.js';
export default {
	data() {
		return {
			titleInfo: {
				titleShow: true,
				title: '新增',
				imageUrl: 'http://t73sifiwt.hn-bkt.clouddn.com/pageBack/1.webp',
				heightShow: false,
				backShow: true
			},
			readOnly: false, //是否只读
			photoUrl: 'http://test.com', //服务器图片域名或者ip
			api: '/upload', //上传图片接口地址
			name: 'file',
			values: '',
			title: '',
			imageList: [],
			uploadImage: [],
			indexUnit: 0, // 选中的下标
			unitName: '请选择话题', // 默认选项
			unitList: [],
			grid_id: null,
			txt: '',
			msgType: 'success'
		};
	},
	components: {
		pageBack,
		piaoyiEditor
	},
	onLoad() {
		getCommunityTopicAPI().then((res) => {
			this.unitList = res.message;
		});
	},
	methods: {
		chooseImage() {
			if (this.imageList.length > 9) {
				uni.showToast({
					title: '最多只能上传9张图片',
					icon: 'none'
				});
				return;
			}
			uni.chooseImage({
				count: 9 - this.imageList.length, // 最多可以选择的图片张数
				sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图,默认二者都有
				sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机,默认二者都有
				success: (res) => {
					this.imageList = this.imageList.concat(res.tempFilePaths);
					this.uploadImages();
				}
			});
		},
		uploadImages() {
			this.imageList.forEach((item, index) => {
				const url = `${base_url}/community/uploadCommunityImage`;
				const token = uni.getStorageSync('token');
				uni.uploadFile({
					url: url,
					filePath: item,
					name: 'img',
					header: {
						'Content-Type': 'application/x-www-form-urlencoded',
						Authorization: token
					},
					success: (uploadRes) => {
						this.uploadImage.push(JSON.parse(uploadRes.data).imageUrl);
					},
					fail: (err) => {
						console.log(`Image upload failed`, err);
					}
				});
			});
		},
		changePickerUnit(e, unitList) {
			let index = e.detail.value;
			this.indexUnit = index;
			this.unitName = unitList[index].name;
			this.grid_id = unitList[index].id;
		},
		saveContens(e) {
			this.txt = e.html;
		},
		addButton() {
			if (!this.title || !this.txt || !this.uploadImage || !this.grid_id) {
				uni.showToast({
					title: '请填写所有必填项',
					icon: 'none'
				});
				return;
			}
			
			console.log(useUserInfoStore().$state.userInfo.id)

			if (!useUserInfoStore().$state.userInfo.id) {
				uni.showToast({
					title: '您未请登录，请登录后再发布...',
					icon: 'none'
				});

				setTimeout(() => {
					uni.navigateTo({
						url: '/pages/login/login'
					});
				}, 3000);
				return;
			}

			// 转换我想要的格式
			const imageUrlList = `["${Object.values(this.uploadImage).join('","')}"]`;
			uploadCommunityAPI({
				title: this.title,
				content: this.txt,
				imageUrl: `["${Object.values(this.uploadImage).join('","')}"]`,
				grid_id: this.grid_id,
				user_id: useUserInfoStore().$state.userInfo.id
			}).then((res) => {
				if (res.status == 200) {
					uni.showToast({
						title: res.message,
						icon: 'none',
						mask: true
					});
					setTimeout(() => {
						uni.switchTab({
							url: '/pages/community/community'
						});
					}, 500);
				} else {
					uni.showToast({
						title: '发布失败',
						icon: 'none'
					});
				}
			});
		},
		// 删除图片
		deleteImage(index, type) {
			this.deleteIndex = index; // 保存要删除的图片索引
			this.msgType = type;
			this.$refs.popup.open(type);
		},
		confirmDeleteImage() {
			this.imageList.splice(this.deleteIndex, 1);
			this.uploadImage.splice(this.deleteIndex, 1);
			this.$refs.popup.close();
		},
		dialogClose() {
			this.$refs.popup.close();
		}
	}
};
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
	font-family: '阿里妈妈方圆体 VF Regular' !important;

	.richtext {
		width: 90%;
		margin: auto;

		.titleContent {
			padding-bottom: 20rpx;
			padding-left: 10rpx;
		}
	}

	.button {
		width: 90%;
		margin: auto;
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 50rpx;

		.add {
			padding: 10rpx 40rpx;
			background-color: #4d0000;
			color: #fff;
			border-radius: 10rpx;
		}
	}

	.uploadImage {
		margin: auto;
		width: 90%;
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		grid-template-rows: repeat(3, 1fr);
		grid-gap: 10rpx;
		height: 620rpx;

		.i {
			position: relative;

			.deleteBtn {
				position: absolute;
				top: 10rpx;
				right: 10rpx;
				width: 40rpx;
				height: 40rpx;
				background-color: rgba(0, 0, 0, 0.5);
				border-radius: 50%;
				display: flex;
				justify-content: center;
				align-items: center;
				color: #fff;
				font-size: 32rpx;
				z-index: 1;
			}
		}

		view {
			width: 200rpx;
			height: 200rpx;
			border-radius: 20rpx;
			overflow: hidden;
			display: flex;
			justify-content: center;
			align-items: center;
			background: rgba(0, 0, 0, 0.03);

			image {
				width: 100%;
				height: 100%;
			}

			.chooseSvg {
				width: 100rpx;
				height: 100rpx;
			}
		}
	}
}
</style>
