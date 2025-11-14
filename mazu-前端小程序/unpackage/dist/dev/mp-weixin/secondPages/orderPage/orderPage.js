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
        title: "支付",
        imageUrl: "https://mazu-1320314698.cos.ap-guangzhou.myqcloud.com/pageBack/1.webp",
        heightShow: false,
        backShow: true
      },
      patMent: [
        {
          id: 1,
          name: `余额支付(${store_userInfo.useUserInfoStore().$state.userInfo.balance})`,
          svg: "/static/shopPay.svg"
        },
        {
          id: 2,
          name: "微信支付",
          svg: "/static/weChat.svg"
        }
      ],
      price: null,
      order_id: null,
      currentPaymentMethod: null
    };
  },
  components: {
    pageBack
  },
  onLoad(options) {
    this.price = options.price;
    this.order_id = options.order_id;
  },
  methods: {
    selectPaymentMethod(id) {
      this.currentPaymentMethod = id;
    },
    // 支付按钮
    confirmPay() {
      if (this.currentPaymentMethod === null) {
        common_vendor.index.showToast({
          title: "请选择付款方式",
          icon: "none"
        });
        return;
      }
      common_vendor.index.showLoading({
        title: "付款中",
        mask: true
      });
      setTimeout(() => {
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
          case 2:
            common_vendor.index.__f__("log", "at secondPages/orderPage/orderPage.vue:123", "微信支付");
            break;
          default:
            return common_vendor.index.showToast({
              title: "未知错误 请联系管理员",
              icon: "none"
            });
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
    b: common_vendor.t($data.price),
    c: common_vendor.f($data.patMent, (item, k0, i0) => {
      return {
        a: item.svg,
        b: common_vendor.t(item.name),
        c: $data.currentPaymentMethod === item.id ? 1 : "",
        d: $data.currentPaymentMethod === item.id ? 1 : "",
        e: common_vendor.o(($event) => $options.selectPaymentMethod(item.id))
      };
    }),
    d: common_vendor.o((...args) => $options.confirmPay && $options.confirmPay(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-efc0c1aa"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/secondPages/orderPage/orderPage.js.map
