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
        imageUrl: "http://t73sifiwt.hn-bkt.clouddn.com/pageBack/1.webp",
        heightShow: false,
        backShow: true
      },
      contentInfo: {},
      address: {},
      note: "",
      // 捐款人信息字段
      donorName: "",
      donorPhone: ""
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
        var _a, _b;
        common_vendor.index.hideLoading();
        if (!this.contentInfo || typeof this.contentInfo === "undefined" || this.contentInfo.length === 0) {
          common_vendor.index.hideLoading();
          common_vendor.index.showToast({
            title: "商品错误，请重新下单",
            icon: "none"
          });
          return;
        }
        if (((_a = this.contentInfo[0]) == null ? void 0 : _a.grid) === "公益") {
          if (!this.donorName || !this.donorPhone) {
            common_vendor.index.hideLoading();
            common_vendor.index.showToast({
              title: "请填写完整的捐款人信息",
              icon: "none"
            });
            return;
          }
        } else {
          if (!this.address || typeof this.address === "undefined") {
            common_vendor.index.hideLoading();
            common_vendor.index.showToast({
              title: "请选择收货地址",
              icon: "none"
            });
            return;
          }
        }
        apis_shop.createOrderAPI({
          user_id: store_userInfo.useUserInfoStore().$state.userInfo.id,
          address_id: ((_b = this.contentInfo[0]) == null ? void 0 : _b.grid) === "公益" ? null : this.address.id,
          payment: this.contentInfo[0].price,
          note: this.note,
          shop_id: this.contentInfo[0].id,
          donor_name: this.donorName,
          donor_phone: this.donorPhone
        }).then((res) => {
          if (res.status == 200) {
            common_vendor.index.showToast({
              title: res.message,
              mask: true
            });
            setTimeout(() => {
              common_vendor.index.redirectTo({
                url: `/secondPages/orderPage/orderPage?price=${this.contentInfo[0].price}&order_id=${res.order_no}&grid=${this.contentInfo[0].grid}`
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
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _A, _B, _C, _D, _E;
  return common_vendor.e({
    a: $data.contentInfo
  }, $data.contentInfo ? common_vendor.e({
    b: common_vendor.p({
      titleInfo: $data.titleInfo
    }),
    c: ((_a = $data.contentInfo[0]) == null ? void 0 : _a.grid) === "公益"
  }, ((_b = $data.contentInfo[0]) == null ? void 0 : _b.grid) === "公益" ? {
    d: $data.donorName,
    e: common_vendor.o(($event) => $data.donorName = $event.detail.value),
    f: $data.donorPhone,
    g: common_vendor.o(($event) => $data.donorPhone = $event.detail.value),
    h: $data.note,
    i: common_vendor.o(($event) => $data.note = $event.detail.value)
  } : common_vendor.e({
    j: common_assets._imports_0$5,
    k: $data.address
  }, $data.address ? {
    l: common_vendor.t((_c = $data.address) == null ? void 0 : _c.name),
    m: common_vendor.t((_d = $data.address) == null ? void 0 : _d.mobile),
    n: common_vendor.t((_e = $data.address) == null ? void 0 : _e.province_id),
    o: common_vendor.t((_f = $data.address) == null ? void 0 : _f.city_id),
    p: common_vendor.t((_g = $data.address) == null ? void 0 : _g.district_id),
    q: common_vendor.t((_h = $data.address) == null ? void 0 : _h.remark)
  } : {}, {
    r: common_vendor.o((...args) => $options.toEditAdress && $options.toEditAdress(...args))
  }), {
    s: common_vendor.t(((_i = $data.contentInfo[0]) == null ? void 0 : _i.grid) === "公益" ? "捐赠项目" : "商品信息"),
    t: (_j = $data.contentInfo[0]) == null ? void 0 : _j.imageUrl[0],
    v: ((_k = $data.contentInfo[0]) == null ? void 0 : _k.shopname.length) > 12
  }, ((_l = $data.contentInfo[0]) == null ? void 0 : _l.shopname.length) > 12 ? {
    w: common_vendor.t((_m = $data.contentInfo[0]) == null ? void 0 : _m.shopname.slice(0, 13))
  } : {
    x: common_vendor.t((_n = $data.contentInfo[0]) == null ? void 0 : _n.shopname)
  }, {
    y: ((_o = $data.contentInfo[0]) == null ? void 0 : _o.grid) === "公益"
  }, ((_p = $data.contentInfo[0]) == null ? void 0 : _p.grid) === "公益" ? {} : {}, {
    z: common_vendor.t(((_q = $data.contentInfo[0]) == null ? void 0 : _q.grid) === "公益" ? "捐赠金额" : "香火值"),
    A: common_vendor.t((_r = $data.contentInfo[0]) == null ? void 0 : _r.price),
    B: common_vendor.t(((_s = $data.contentInfo[0]) == null ? void 0 : _s.grid) === "公益" ? "捐赠金额款项" : "商品合计（香火值）"),
    C: common_vendor.t((_t = $data.contentInfo[0]) == null ? void 0 : _t.price),
    D: ((_u = $data.contentInfo[0]) == null ? void 0 : _u.grid) !== "公益"
  }, ((_v = $data.contentInfo[0]) == null ? void 0 : _v.grid) !== "公益" ? {} : {}, {
    E: ((_w = $data.contentInfo[0]) == null ? void 0 : _w.grid) !== "公益"
  }, ((_x = $data.contentInfo[0]) == null ? void 0 : _x.grid) !== "公益" ? {} : {}, {
    F: ((_y = $data.contentInfo[0]) == null ? void 0 : _y.grid) !== "公益"
  }, ((_z = $data.contentInfo[0]) == null ? void 0 : _z.grid) !== "公益" ? {
    G: common_vendor.t(((_A = $data.contentInfo[0]) == null ? void 0 : _A.grid) === "公益" ? "捐赠留言" : "备注"),
    H: ((_B = $data.contentInfo[0]) == null ? void 0 : _B.grid) === "公益" ? "请填写捐赠留言" : "请填写备注信息",
    I: $data.note,
    J: common_vendor.o(($event) => $data.note = $event.detail.value)
  } : {}, {
    K: common_vendor.t(((_C = $data.contentInfo[0]) == null ? void 0 : _C.grid) === "公益" ? "所需捐赠金额" : "所需香火值"),
    L: common_vendor.t((_D = $data.contentInfo[0]) == null ? void 0 : _D.price),
    M: common_vendor.t(((_E = $data.contentInfo[0]) == null ? void 0 : _E.grid) === "公益" ? "提交捐赠" : "提交兑换"),
    N: common_vendor.o((...args) => $options.commitOrder && $options.commitOrder(...args)),
    O: _ctx.isIos ? 1 : ""
  }) : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-8cde6161"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/secondPages/commitOrder/commitOrder.js.map
