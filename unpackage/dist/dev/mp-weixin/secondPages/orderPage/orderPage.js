"use strict";
const common_vendor = require("../../common/vendor.js");
const store_userInfo = require("../../store/userInfo.js");
const apis_shop = require("../../apis/shop.js");
const pageBack = () => "../../components/title/title.js";
const _sfc_main = {
  data() {
    return {
      titleInfo: {
        titleShow: true,
        title: "兑换",
        imageUrl: "http://t73sifiwt.hn-bkt.clouddn.com/pageBack/1.webp",
        heightShow: false,
        backShow: true
      },
      patMent: [{
        id: 1,
        name: `香火值兑换（可用：${store_userInfo.useUserInfoStore().$state.userInfo.balance}）`,
        svg: "/static/shopPay.svg"
      }],
      price: null,
      order_id: null,
      grid: null,
      currentPaymentMethod: 1
    };
  },
  components: {
    pageBack
  },
  onLoad(options) {
    this.price = options.price;
    this.order_id = options.order_id;
    this.grid = options.grid;
    if (this.grid === "公益") {
      this.titleInfo.title = "捐赠";
      this.patMent[0].name = `金额捐赠`;
    }
  },
  methods: {
    selectPaymentMethod(id) {
      this.currentPaymentMethod = id;
    },
    // 支付按钮
    confirmPay() {
      common_vendor.index.showLoading({
        title: this.grid === "公益" ? "捐赠中" : "兑换中",
        mask: true
      });
      setTimeout(() => {
        if (this.grid === "公益") {
          common_vendor.index.hideLoading();
          const store = store_userInfo.useUserInfoStore();
          const donatedAmount = Number(this.price);
          store.$state.userInfo.balance = Number(store.$state.userInfo.balance || 0) + donatedAmount;
          common_vendor.index.showToast({
            title: "捐赠成功",
            mask: true
          });
          setTimeout(() => {
            common_vendor.index.navigateBack({
              delta: 1
            });
          }, 1e3);
        } else {
          switch (this.currentPaymentMethod) {
            case 1:
              apis_shop.shopPayMoneyAPI({
                pay_money: this.price,
                pay_ment: this.currentPaymentMethod,
                order_id: this.order_id,
                user_id: store_userInfo.useUserInfoStore().$state.userInfo.id
              }).then((res) => {
                if (res.status == 200) {
                  store_userInfo.useUserInfoStore().$state.userInfo.balance = res.new_balance;
                  common_vendor.index.showToast({
                    title: res.message,
                    mask: true
                  });
                  setTimeout(() => {
                    common_vendor.index.navigateBack({
                      delta: 1
                    });
                  }, 1e3);
                } else {
                  common_vendor.index.showToast({
                    title: res.message,
                    icon: "none",
                    mask: true
                  });
                }
              });
              break;
            default:
              return common_vendor.index.showToast({
                title: "未知错误 请联系管理员",
                icon: "none"
              });
          }
        }
      }, 1e3);
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
    b: common_vendor.t($data.grid === "公益" ? "捐赠所需金额" : "兑换所需香火值"),
    c: common_vendor.t($data.grid === "公益" ? "金额" : "香火值"),
    d: common_vendor.t($data.price),
    e: common_vendor.f($data.patMent, (item, k0, i0) => {
      return {
        a: item.svg,
        b: common_vendor.t(item.name),
        c: $data.currentPaymentMethod === item.id ? 1 : "",
        d: $data.currentPaymentMethod === item.id ? 1 : "",
        e: common_vendor.o(($event) => $options.selectPaymentMethod(item.id))
      };
    }),
    f: common_vendor.o((...args) => $options.confirmPay && $options.confirmPay(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-efc0c1aa"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/secondPages/orderPage/orderPage.js.map
