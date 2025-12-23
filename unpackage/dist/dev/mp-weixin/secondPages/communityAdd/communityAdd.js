"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_request = require("../../utils/request.js");
const store_userInfo = require("../../store/userInfo.js");
const apis_community = require("../../apis/community.js");
const common_assets = require("../../common/assets.js");
const pageBack = () => "../../components/title/title.js";
const piaoyiEditor = () => "../../uni_modules/piaoyi-editor/components/piaoyi-editor/piaoyi-editor.js";
const _sfc_main = {
  data() {
    return {
      titleInfo: {
        titleShow: true,
        title: "新增",
        imageUrl: "http://t73sifiwt.hn-bkt.clouddn.com/pageBack/1.webp",
        heightShow: false,
        backShow: true
      },
      readOnly: false,
      //是否只读
      photoUrl: "http://test.com",
      //服务器图片域名或者ip
      api: "/upload",
      //上传图片接口地址
      name: "file",
      values: "",
      title: "",
      imageList: [],
      uploadImage: [],
      indexUnit: 0,
      // 选中的下标
      unitName: "请选择话题",
      // 默认选项
      unitList: [],
      grid_id: null,
      txt: "",
      msgType: "success"
    };
  },
  components: {
    pageBack,
    piaoyiEditor
  },
  onLoad() {
    apis_community.getCommunityTopicAPI().then((res) => {
      this.unitList = res.message;
    });
  },
  methods: {
    chooseImage() {
      if (this.imageList.length > 9) {
        common_vendor.index.showToast({
          title: "最多只能上传9张图片",
          icon: "none"
        });
        return;
      }
      common_vendor.index.chooseImage({
        count: 9 - this.imageList.length,
        // 最多可以选择的图片张数
        sizeType: ["original", "compressed"],
        // 可以指定是原图还是压缩图,默认二者都有
        sourceType: ["album", "camera"],
        // 可以指定来源是相册还是相机,默认二者都有
        success: (res) => {
          this.imageList = this.imageList.concat(res.tempFilePaths);
          this.uploadImages();
        }
      });
    },
    uploadImages() {
      this.imageList.forEach((item, index) => {
        const url = `${utils_request.base_url}/community/uploadCommunityImage`;
        const token = common_vendor.index.getStorageSync("token");
        common_vendor.index.uploadFile({
          url,
          filePath: item,
          name: "img",
          header: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: token
          },
          success: (uploadRes) => {
            this.uploadImage.push(JSON.parse(uploadRes.data).imageUrl);
          },
          fail: (err) => {
            common_vendor.index.__f__("log", "at secondPages/communityAdd/communityAdd.vue:120", `Image upload failed`, err);
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
        common_vendor.index.showToast({
          title: "请填写所有必填项",
          icon: "none"
        });
        return;
      }
      common_vendor.index.__f__("log", "at secondPages/communityAdd/communityAdd.vue:143", store_userInfo.useUserInfoStore().$state.userInfo.id);
      if (!store_userInfo.useUserInfoStore().$state.userInfo.id) {
        common_vendor.index.showToast({
          title: "您未请登录，请登录后再发布...",
          icon: "none"
        });
        setTimeout(() => {
          common_vendor.index.navigateTo({
            url: "/pages/login/login"
          });
        }, 3e3);
        return;
      }
      `["${Object.values(this.uploadImage).join('","')}"]`;
      apis_community.uploadCommunityAPI({
        title: this.title,
        content: this.txt,
        imageUrl: `["${Object.values(this.uploadImage).join('","')}"]`,
        grid_id: this.grid_id,
        user_id: store_userInfo.useUserInfoStore().$state.userInfo.id
      }).then((res) => {
        if (res.status == 200) {
          common_vendor.index.showToast({
            title: res.message,
            icon: "none",
            mask: true
          });
          setTimeout(() => {
            common_vendor.index.switchTab({
              url: "/pages/community/community"
            });
          }, 500);
        } else {
          common_vendor.index.showToast({
            title: "发布失败",
            icon: "none"
          });
        }
      });
    },
    // 删除图片
    deleteImage(index, type) {
      this.deleteIndex = index;
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
if (!Array) {
  const _component_pageBack = common_vendor.resolveComponent("pageBack");
  const _component_piaoyiEditor = common_vendor.resolveComponent("piaoyiEditor");
  const _easycom_uni_popup_dialog2 = common_vendor.resolveComponent("uni-popup-dialog");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  (_component_pageBack + _component_piaoyiEditor + _easycom_uni_popup_dialog2 + _easycom_uni_popup2)();
}
const _easycom_uni_popup_dialog = () => "../../uni_modules/uni-popup/components/uni-popup-dialog/uni-popup-dialog.js";
const _easycom_uni_popup = () => "../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
if (!Math) {
  (_easycom_uni_popup_dialog + _easycom_uni_popup)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.p({
      titleInfo: $data.titleInfo
    }),
    b: $data.title,
    c: common_vendor.o(($event) => $data.title = $event.detail.value),
    d: common_vendor.o($options.saveContens),
    e: common_vendor.p({
      values: $data.values,
      maxlength: 3e3,
      readOnly: $data.readOnly,
      photoUrl: $data.photoUrl,
      api: $data.api,
      name: $data.name
    }),
    f: common_vendor.f($data.imageList, (item, index, i0) => {
      return {
        a: item,
        b: common_vendor.o(($event) => $options.deleteImage(index, "error"), index),
        c: index
      };
    }),
    g: $data.imageList.length < 9
  }, $data.imageList.length < 9 ? {
    h: common_assets._imports_0$4,
    i: common_vendor.o((...args) => $options.chooseImage && $options.chooseImage(...args))
  } : {}, {
    j: common_vendor.t($data.unitName),
    k: common_vendor.o(($event) => $options.changePickerUnit($event, $data.unitList)),
    l: $data.indexUnit,
    m: $data.unitList,
    n: common_vendor.o((...args) => _ctx.selectTopic && _ctx.selectTopic(...args)),
    o: common_vendor.o((...args) => $options.addButton && $options.addButton(...args)),
    p: common_vendor.o($options.confirmDeleteImage),
    q: common_vendor.o($options.dialogClose),
    r: common_vendor.p({
      type: $data.msgType,
      cancelText: "取消",
      confirmText: "确定",
      title: "提示",
      content: "确定要删除此图片吗?"
    }),
    s: common_vendor.sr("popup", "5ee3a361-2"),
    t: common_vendor.p({
      type: "dialog"
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-5ee3a361"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/secondPages/communityAdd/communityAdd.js.map
