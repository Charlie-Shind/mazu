"use strict";
const common_vendor = require("../../common/vendor.js");
const store_userInfo = require("../../store/userInfo.js");
const apis_shop = require("../../apis/shop.js");
const common_assets = require("../../common/assets.js");
const pageBack = () => "../../components/title/title.js";
const _sfc_main = {
  data() {
    return {
      titleInfo: {
        titleShow: true,
        title: "创建订单",
        imageUrl: "https://mazu-1320314698.cos.ap-guangzhou.myqcloud.com/pageBack/1.webp",
        heightShow: false,
        backShow: true
      },
      contentInfo: {},
      address: {},
      note: ""
    };
  },
  components: {
    pageBack
  },
  onShow() {
    let that = this;
    common_vendor.index.$on("addressData", function(data) {
      that.address = data;
    });
  },
  onLoad(option) {
    apis_shop.getShopDetailAPI(option.shopId).then((res) => {
      this.contentInfo = res.message.map((item) => {
        return {
          ...item,
          imageUrl: JSON.parse(item.imageUrl)
        };
      });
    });
    this.getDefault();
  },
  onUnload() {
    common_vendor.index.$off("addressData");
  },
  methods: {
    // 修改收货地址页面
    toEditAdress() {
      common_vendor.index.navigateTo({
        url: "/secondPages/setAddress/setAddress"
      });
    },
    // 获取默认地址
    getDefault() {
      apis_shop.getDefaultAddressAPI(store_userInfo.useUserInfoStore().$state.userInfo.id).then((res) => {
        this.address = res.message[0];
      });
    },
    commitOrder() {
      common_vendor.index.showLoading({
        title: "提交订单中",
        mask: true
      });
      setTimeout(() => {
        common_vendor.index.hideLoading();
        if (!this.address || typeof this.address === "undefined") {
          common_vendor.index.hideLoading();
          common_vendor.index.showToast({
            title: "请选择收货地址",
            icon: "none"
          });
          return;
        }
        if (!this.contentInfo || typeof this.contentInfo === "undefined" || this.contentInfo.length === 0) {
          common_vendor.index.hideLoading();
          common_vendor.index.showToast({
            title: "商品错误，请重新下单",
            icon: "none"
          });
          return;
        }
        apis_shop.createOrderAPI({
          user_id: store_userInfo.useUserInfoStore().$state.userInfo.id,
          address_id: this.address.id,
          payment: this.contentInfo[0].price,
          note: this.note,
          shop_id: this.contentInfo[0].id
        }).then((res) => {
          if (res.status == 200) {
            common_vendor.index.showToast({
              title: res.message,
              mask: true
            });
            setTimeout(() => {
              common_vendor.index.redirectTo({
                url: `/secondPages/orderPage/orderPage?price=${this.contentInfo[0].price}&order_id=${res.order_no}`
              });
            }, 1e3);
          }
        });
      }, 1e3);
    }
  }
};
if (!Array) {
  const _component_pageBack = common_vendor.resolveComponent("pageBack");
  _component_pageBack();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n;
  return common_vendor.e({
    a: $data.contentInfo
  }, $data.contentInfo ? common_vendor.e({
    b: common_vendor.p({
      titleInfo: $data.titleInfo
    }),
    c: common_assets._imports_0$6,
    d: $data.address
  }, $data.address ? {
    e: common_vendor.t((_a = $data.address) == null ? void 0 : _a.name),
    f: common_vendor.t((_b = $data.address) == null ? void 0 : _b.mobile),
    g: common_vendor.t((_c = $data.address) == null ? void 0 : _c.province_id),
    h: common_vendor.t((_d = $data.address) == null ? void 0 : _d.city_id),
    i: common_vendor.t((_e = $data.address) == null ? void 0 : _e.district_id),
    j: common_vendor.t((_f = $data.address) == null ? void 0 : _f.remark)
  } : {}, {
    k: common_vendor.o((...args) => $options.toEditAdress && $options.toEditAdress(...args)),
    l: (_g = $data.contentInfo[0]) == null ? void 0 : _g.imageUrl[0],
    m: ((_h = $data.contentInfo[0]) == null ? void 0 : _h.shopname.length) > 12
  }, ((_i = $data.contentInfo[0]) == null ? void 0 : _i.shopname.length) > 12 ? {
    n: common_vendor.t((_j = $data.contentInfo[0]) == null ? void 0 : _j.shopname.slice(0, 13))
  } : {
    o: common_vendor.t((_k = $data.contentInfo[0]) == null ? void 0 : _k.shopname)
  }, {
    p: common_vendor.t((_l = $data.contentInfo[0]) == null ? void 0 : _l.price),
    q: common_vendor.t((_m = $data.contentInfo[0]) == null ? void 0 : _m.price),
    r: $data.note,
    s: common_vendor.o(($event) => $data.note = $event.detail.value),
    t: common_vendor.t((_n = $data.contentInfo[0]) == null ? void 0 : _n.price),
    v: common_vendor.o((...args) => $options.commitOrder && $options.commitOrder(...args)),
    w: _ctx.isIos ? 1 : ""
  }) : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-8cde6161"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/secondPages/commitOrder/commitOrder.js.map
