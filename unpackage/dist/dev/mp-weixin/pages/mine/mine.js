"use strict";
const common_vendor = require("../../common/vendor.js");
const store_userInfo = require("../../store/userInfo.js");
const apis_user = require("../../apis/user.js");
const pageBack = () => "../../components/title/title.js";
const tabBar = () => "../../components/tabbar/tabbar.js";
const IncenseFab = () => "../../components/incense-fab/incense-fab.js";
const _sfc_main = {
  data() {
    return {
      titleInfo: {
        titleShow: true,
        title: "我的",
        imageUrl: "http://t73sifiwt.hn-bkt.clouddn.com/pageBack/2.webp",
        heightShow: false,
        height: 100
      },
      otherPage: [
        {
          id: 1,
          name: "我的订单",
          svg: "/static/mine/order.svg",
          url: "/secondPages/myOrder/myOrder"
        },
        {
          id: 2,
          name: "我的证书",
          svg: "/static/mine/order.svg",
          url: "/secondPages/myCertificate/myCertificate"
        },
        // {
        // 	id: 2,
        // 	name: "我的收藏",
        // 	svg: "/static/mine/hezuo.svg",
        // 	url: "/secondPages/agreement/agreement"
        // },
        {
          id: 3,
          name: "游览历史",
          svg: "/static/mine/history.svg",
          url: "/secondPages/tourHistory/tourHistory"
        },
        {
          id: 4,
          name: "联系开发者",
          svg: "/static/mine/kaifa.svg",
          url: "/secondPages/contact/contact"
        },
        {
          id: 5,
          name: "账户设置",
          svg: "/static/mine/set.svg",
          url: "/secondPages/accountSet/accountSet"
        },
        {
          id: 6,
          name: "我的发布",
          svg: "/static/mine/post.svg",
          url: "/secondPages/myPost/myPost"
        }
      ],
      userInfo: {},
      shade: false,
      one: false,
      two: false,
      signSuccess: false,
      signError: false,
      sign: false,
      signDays: ""
    };
  },
  components: {
    pageBack,
    tabBar,
    IncenseFab
  },
  onShow() {
    this.userInfo = store_userInfo.useUserInfoStore().$state.userInfo;
    apis_user.checkBalanceZeroAPI(this.userInfo.openid).then((res) => {
      this.shade = !res.message;
      this.one = !res.message;
    });
    this.getDays();
  },
  methods: {
    getDays() {
      apis_user.getContinuousSignInDaysAPI(this.userInfo.openid).then((res) => {
        this.signDays = res.continuousDays;
      });
    },
    toTwo() {
      common_vendor.index.showLoading({
        title: "开启红包中"
      });
      setTimeout(() => {
        common_vendor.index.clearStorage(), common_vendor.index.hideLoading(), this.one = false, this.two = true, common_vendor.index.showToast({
          title: "红包开启成功",
          mask: true
        });
      }, 1e3);
    },
    end() {
      common_vendor.index.showLoading({
        title: "领取中"
      });
      apis_user.addBalanceAPI(this.userInfo.openid).then((res) => {
        if (res.status == 200) {
          common_vendor.index.hideLoading();
          this.userInfo.balance = 1e4;
          this.two = false;
          this.shade = false;
          common_vendor.index.showToast({
            title: "恭喜你领取成功！",
            mask: true
          });
        } else {
          this.two = false, this.shade = false, common_vendor.index.showToast({
            title: "领取失败",
            icon: "error",
            mask: true
          });
        }
      });
    },
    signIn() {
      apis_user.signInAPI(this.userInfo.openid).then((res) => {
        if (res.status == 2002) {
          this.getDays();
          common_vendor.index.showModal({
            title: "提示",
            content: "签到成功",
            showCancel: false
          });
        } else {
          this.getDays();
          common_vendor.index.showModal({
            title: "提示",
            content: res.message,
            showCancel: false,
            icon: "error"
          });
        }
      });
    },
    toLogin() {
      common_vendor.index.navigateTo({
        url: "/pages/login/login"
      });
    },
    loginOut() {
      common_vendor.index.showLoading({
        title: "退出登录中"
      });
      setTimeout(() => {
        common_vendor.index.clearStorage(), this.userInfo = {}, store_userInfo.useUserInfoStore().$reset(), common_vendor.index.hideLoading(), common_vendor.index.showToast({
          title: "成功退出登录",
          mask: true
        });
      }, 1e3);
    },
    toSet() {
      common_vendor.index.navigateTo({
        url: "/secondPages/accountSet/accountSet"
      });
    },
    toPage(id, url) {
      common_vendor.index.navigateTo({
        url
      });
    }
  },
  onPageScroll(e) {
    if (e.scrollTop >= 80) {
      this.titleInfo.heightShow = true;
    }
    if (e.scrollTop < 80) {
      this.titleInfo.heightShow = false;
    }
  }
};
if (!Array) {
  const _component_pageBack = common_vendor.resolveComponent("pageBack");
  const _easycom_incense_fab2 = common_vendor.resolveComponent("incense-fab");
  const _component_tabBar = common_vendor.resolveComponent("tabBar");
  (_component_pageBack + _easycom_incense_fab2 + _component_tabBar)();
}
const _easycom_incense_fab = () => "../../components/incense-fab/incense-fab.js";
if (!Math) {
  _easycom_incense_fab();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.p({
      titleInfo: $data.titleInfo
    }),
    b: $data.userInfo && Object.keys($data.userInfo).length > 0
  }, $data.userInfo && Object.keys($data.userInfo).length > 0 ? {
    c: $data.userInfo.avatarurl,
    d: common_vendor.t($data.userInfo.nickname),
    e: common_vendor.t($data.signDays),
    f: common_vendor.t($data.userInfo.balance || 0),
    g: common_vendor.o((...args) => $options.toSet && $options.toSet(...args)),
    h: common_vendor.o(($event) => $options.signIn())
  } : {
    i: common_vendor.o((...args) => $options.toLogin && $options.toLogin(...args))
  }, {
    j: common_vendor.f($data.otherPage, (item, k0, i0) => {
      return {
        a: item.svg,
        b: common_vendor.t(item.name),
        c: common_vendor.o(($event) => $options.toPage(item.id, item.url))
      };
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-7c2ebfa5"]]);
_sfc_main.__runtimeHooks = 1;
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/mine/mine.js.map
