"use strict";
const common_vendor = require("../../common/vendor.js");
const store_userInfo = require("../../store/userInfo.js");
const apis_user = require("../../apis/user.js");
const utils_request = require("../../utils/request.js");
const pageBack = () => "../../components/title/title.js";
const _sfc_main = {
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
    this.userInfo = store_userInfo.useUserInfoStore().$state.userInfo;
  },
  components: {
    pageBack
  },
  onChooseAvatar(e) {
    common_vendor.index.showLoading({
      title: "加载中..."
    });
    const {
      avatarUrl
    } = e.detail;
    const url = `${utils_request.base_url}/user/editUserHeaders?id=${this.userInfo.id}`;
    const token = common_vendor.index.getStorageSync("token");
    common_vendor.index.uploadFile({
      url,
      filePath: avatarUrl,
      name: "img",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": token
      },
      success: (uploadFileRes) => {
        this.userInfo.avatarurl = avatarUrl;
        store_userInfo.useUserInfoStore().$patch({
          userInfo: this.userInfo
        });
        common_vendor.index.showToast({
          title: JSON.parse(uploadFileRes.data).message
        });
      },
      complete: () => {
        common_vendor.index.hideLoading();
      }
    });
  },
  methods: {
    loginOut() {
      common_vendor.index.showLoading({
        title: "退出登录中"
      });
      setTimeout(() => {
        common_vendor.index.switchTab({
          url: "/pages/mine/mine"
        }), this.userInfo = {}, store_userInfo.useUserInfoStore().$reset(), common_vendor.index.hideLoading(), common_vendor.index.showToast({
          title: "成功退出登录",
          mask: true
        });
        common_vendor.index.clearStorage();
      }, 1e3);
    },
    updateNickname(e) {
      const newNickname = e.detail.value;
      if (!newNickname) {
        common_vendor.index.showToast({
          title: "昵称不能为空",
          icon: "error"
        });
      } else {
        apis_user.editNicknameAPI({
          name: newNickname,
          id: this.userInfo.id
        }).then((res) => {
          if (res.status == 200) {
            this.userInfo.nickname = newNickname;
            store_userInfo.useUserInfoStore().$patch({
              userInfo: this.userInfo
            });
            common_vendor.index.showToast({
              title: res.message,
              icon: "success"
            });
          } else {
            common_vendor.index.showToast({
              title: "昵称更新失败" + res.message,
              icon: "error"
            });
          }
        }).catch((err) => {
          common_vendor.index.showToast({
            title: err,
            icon: "error"
          });
        });
      }
    }
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
    b: $data.userInfo.avatarurl,
    c: common_vendor.o((...args) => $options.updateNickname && $options.updateNickname(...args)),
    d: $data.userInfo.nickname,
    e: common_vendor.o(($event) => $options.loginOut())
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-24f63d34"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/secondPages/accountSet/accountSet.js.map
