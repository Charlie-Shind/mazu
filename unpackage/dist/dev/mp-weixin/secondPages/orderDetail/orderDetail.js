"use strict";
const apis_shop = require("../../apis/shop.js");
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const pageBack = () => "../../components/title/title.js";
const _sfc_main = {
  data() {
    return {
      titleInfo: {
        titleShow: true,
        title: "订单详情",
        imageUrl: "http://t73sifiwt.hn-bkt.clouddn.com/pageBack/1.webp",
        heightShow: false,
        backShow: true
      },
      orderData: []
    };
  },
  components: {
    pageBack
  },
  onLoad(option) {
    apis_shop.getOrderInfoAPI(option.id).then((res) => {
      this.orderData = res.message.map((item) => {
        return {
          ...item,
          imageUrl: JSON.parse(item.imageUrl)
        };
      });
    });
  },
  methods: {
    formatDate(isoDate) {
      const date = new Date(isoDate);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    },
    handClick(item, status) {
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
    b: common_vendor.f($data.orderData, (item, k0, i0) => {
      return {
        a: item.imageUrl[0],
        b: common_vendor.t(item == null ? void 0 : item.shopname),
        c: common_vendor.t(item == null ? void 0 : item.grid),
        d: common_vendor.t(item == null ? void 0 : item.shopInfo),
        e: common_vendor.t(item == null ? void 0 : item.payment),
        f: common_vendor.o(($event) => $options.handClick(item, "delete")),
        g: common_vendor.o(($event) => $options.handClick(item, "againBuy"))
      };
    }),
    c: common_assets._imports_0$2,
    d: common_vendor.t($data.orderData[0].payment),
    e: common_vendor.t($data.orderData[0].order_id),
    f: common_vendor.t($data.orderData[0].payment_type = "商城支付"),
    g: common_vendor.t($options.formatDate($data.orderData[0].pay_time)),
    h: common_vendor.t($options.formatDate($data.orderData[0].create_time)),
    i: common_vendor.t($data.orderData[0].name),
    j: common_vendor.t($data.orderData[0].mobile),
    k: common_vendor.t($data.orderData[0].province_id),
    l: common_vendor.t($data.orderData[0].city_id),
    m: common_vendor.t($data.orderData[0].district_id),
    n: common_vendor.t($data.orderData[0].remark)
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-c9d50fba"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/secondPages/orderDetail/orderDetail.js.map
