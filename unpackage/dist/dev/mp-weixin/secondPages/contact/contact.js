"use strict";
const common_vendor = require("../../common/vendor.js");
const pageBack = () => "../../components/title/title.js";
const _sfc_main = {
  data() {
    return {
      titleInfo: {
        titleShow: true,
        title: "联系开发者",
        imageUrl: "http://t73sifiwt.hn-bkt.clouddn.com/pageBack/3.webp",
        heightShow: false,
        backShow: true
      },
      isShaking: false
    };
  },
  components: {
    pageBack
  },
  methods: {
    previewImage(e) {
      common_vendor.index.__f__("log", "at secondPages/contact/contact.vue:36", "e", e);
      common_vendor.index.previewImage({
        // 需要预览的图片链接列表
        urls: [],
        // 为当前显示图片的链接/索引值
        current: "http://t73sifiwt.hn-bkt.clouddn.com/wx.jpg",
        // 图片指示器样式	
        indicator: "default",
        // 是否可循环预览
        loop: false,
        // 长按图片显示操作菜单，如不填默认为保存相册
        // longPressActions:{
        // 	itemList:[this.l('发送给朋友'),this.l]
        // },
        success: (res) => {
          common_vendor.index.__f__("log", "at secondPages/contact/contact.vue:51", "res", res);
        },
        fail: (err) => {
          common_vendor.index.__f__("log", "at secondPages/contact/contact.vue:54", "err", err);
        }
      });
    }
    // handleLongPress() {
    // 	uni.scanCode({
    // 		onlyFromCamera: true,
    // 		success: (res) => {
    // 			// 获取扫描结果  
    // 			const contactInfo = {
    // 				firstName: '开发者',
    // 				photoFilePath: '/static/wx.jpg',
    // 				weChatNumber: res.result
    // 			};
    // 			// 添加微信好友  
    // 			uni.addPhoneContact({
    // 				...contactInfo,
    // 				success: () => {
    // 					this.showQRCodeTips('添加成功');
    // 				},
    // 				fail: () => {
    // 					this.showQRCodeTips('添加失败');
    // 				}
    // 			});
    // 		},
    // 		fail: () => {
    // 			this.showQRCodeTips('扫描失败');
    // 		}
    // 	});
    // },
    // showQRCodeTips(message) {
    // 	uni.showModal({
    // 		title: '提示',
    // 		content: message,
    // 		showCancel: false,
    // 		confirmText: '知道了'
    // 	});
    // }
  }
};
if (!Array) {
  const _component_pageBack = common_vendor.resolveComponent("pageBack");
  _component_pageBack();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.p({
      titleInfo: $data.titleInfo
    }),
    b: common_vendor.o((...args) => $options.previewImage && $options.previewImage(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/secondPages/contact/contact.js.map
