"use strict";
const common_vendor = require("../../common/vendor.js");
const apis_user = require("../../apis/user.js");
const store_userInfo = require("../../store/userInfo.js");
const store_switchTab = require("../../store/switchTab.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {};
  },
  methods: {
    back() {
      common_vendor.index.navigateBack({
        delta: 1
      });
    },
    login() {
      common_vendor.index.showLoading({
        mask: true,
        title: "登陆中"
      });
      common_vendor.index.login({
        provider: "weixin",
        success: function(loginRes) {
          common_vendor.index.__f__("log", "at pages/login/login.vue:51", 1123);
          common_vendor.index.getUserInfo({
            provider: "weixin",
            success: function(info) {
              apis_user.getOpenIdAPI(loginRes.code).then((res) => {
                common_vendor.index.__f__("log", "at pages/login/login.vue:57", loginRes.code);
                if (res.status == 200) {
                  apis_user.wxLoginAPI({
                    openid: res.message.openid,
                    nickname: info.userInfo.nickName,
                    avatarurl: info.userInfo.avatarUrl,
                    gender: info.userInfo.gender
                  }).then((res2) => {
                    if (res2.status == 200) {
                      common_vendor.index.setStorageSync(
                        "isLoggedIn",
                        true
                      );
                      common_vendor.index.setStorageSync(
                        "token",
                        res2.token
                      );
                      store_userInfo.useUserInfoStore().$state.userInfo = res2.user;
                      store_switchTab.useCounterStore().$state.currentTab = 4;
                      setTimeout(() => {
                        common_vendor.index.switchTab({
                          url: "/pages/mine/mine"
                        });
                      }, 1e3);
                      apis_user.userVisitCountAPI(res2.user.id).then((res3) => {
                        common_vendor.index.__f__("log", "at pages/login/login.vue:81", res3.message);
                        common_vendor.index.showToast({
                          title: "登录成功",
                          mask: true
                        });
                      });
                    } else {
                      common_vendor.index.showToast({
                        title: res2.message,
                        icon: "error"
                      });
                    }
                  });
                } else {
                  common_vendor.index.showToast({
                    title: res.message.errmsg,
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
          });
        },
        fail: function(err) {
          common_vendor.index.showToast({
            title: err,
            icon: "error"
          });
        }
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_assets._imports_0$2,
    b: common_vendor.o((...args) => $options.login && $options.login(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/login/login.js.map
