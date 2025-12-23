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
        title: "商品详情",
        imageUrl: "http://t73sifiwt.hn-bkt.clouddn.com/pageBack/1.webp",
        heightShow: false,
        backShow: true
      },
      contentInfo: {},
      isIos: false,
      shopId: null,
      // 收藏图标判断
      imageJudge: null
    };
  },
  components: {
    pageBack
  },
  mounted() {
    if (common_vendor.index.getSystemInfoSync().platform == "ios" || common_vendor.index.getSystemInfoSync().platform == "devtools") {
      this.isIos = true;
    }
  },
  onLoad(option) {
    apis_shop.getShopDetailAPI(option.shopId).then((res) => {
      var _a;
      this.contentInfo = res.message.map((item) => {
        return {
          ...item,
          imageUrl: JSON.parse(item.imageUrl)
        };
      });
      this.titleInfo.title = ((_a = this.contentInfo[0]) == null ? void 0 : _a.grid) === "公益" ? "公益项目" : "商品详情";
    });
    this.shopId = option.shopId;
    apis_shop.judgeCollectAPI({
      user_id: store_userInfo.useUserInfoStore().$state.userInfo.id,
      goods_id: option.shopId
    }).then((res) => {
      this.imageJudge = res.judge;
    });
  },
  onPageScroll(e) {
    if (e.scrollTop >= 80) {
      this.titleInfo.heightShow = true;
    }
    if (e.scrollTop < 80) {
      this.titleInfo.heightShow = false;
    }
  },
  methods: {
    toBuy() {
      common_vendor.index.navigateTo({
        url: `/secondPages/commitOrder/commitOrder?shopId=${this.shopId}`
      });
    },
    // 收藏
    collect() {
      if (!store_userInfo.useUserInfoStore().$state.userInfo.id) {
        common_vendor.index.navigateTo({
          url: "/pages/login/login"
        });
        return;
      }
      if (this.imageJudge) {
        this.collectGoods(store_userInfo.useUserInfoStore().$state.userInfo.id, this.contentInfo[0].id, false);
      } else {
        this.collectGoods(store_userInfo.useUserInfoStore().$state.userInfo.id, this.contentInfo[0].id, true);
      }
    },
    //收藏api
    collectGoods(user_id, goods_id, judge) {
      apis_shop.collectGoodsAPI({
        user_id,
        goods_id,
        judge
      }).then((res) => {
        if (res.status == 200) {
          this.imageJudge = !this.imageJudge;
          common_vendor.index.showToast({
            title: res.message
          });
        }
      });
    }
  }
};
if (!Array) {
  const _component_pageBack = common_vendor.resolveComponent("pageBack");
  _component_pageBack();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k;
  return common_vendor.e({
    a: common_vendor.p({
      titleInfo: $data.titleInfo
    }),
    b: common_vendor.f($data.contentInfo, (item, index, i0) => {
      return {
        a: common_vendor.f(item.imageUrl.length, (list, index2, i1) => {
          return {
            a: item.imageUrl[index2]
          };
        })
      };
    }),
    c: common_vendor.t(((_a = $data.contentInfo[0]) == null ? void 0 : _a.grid) === "公益" ? "捐款金额" : "香火值"),
    d: common_vendor.t((_b = $data.contentInfo[0]) == null ? void 0 : _b.price),
    e: common_vendor.t(((_c = $data.contentInfo[0]) == null ? void 0 : _c.grid) === "公益" ? "元" : "兑换"),
    f: ((_d = $data.contentInfo[0]) == null ? void 0 : _d.grid) !== "公益"
  }, ((_e = $data.contentInfo[0]) == null ? void 0 : _e.grid) !== "公益" ? {} : {}, {
    g: common_vendor.t((_f = $data.contentInfo[0]) == null ? void 0 : _f.shopname),
    h: ((_g = $data.contentInfo[0]) == null ? void 0 : _g.grid) === "公益"
  }, ((_h = $data.contentInfo[0]) == null ? void 0 : _h.grid) === "公益" ? {} : {}, {
    i: common_vendor.t(((_i = $data.contentInfo[0]) == null ? void 0 : _i.grid) === "公益" ? "公益背景" : "产品详情"),
    j: common_vendor.t(((_j = $data.contentInfo[0]) == null ? void 0 : _j.grid) === "公益" ? "暂无公益项目介绍..." : "暂无介绍..."),
    k: common_vendor.f($data.contentInfo[0].imageUrl, (item, k0, i0) => {
      return {
        a: item
      };
    }),
    l: $data.imageJudge ? "../../static/shoucang_active.svg" : "../../static/shoucang.svg",
    m: common_vendor.o((...args) => $options.collect && $options.collect(...args)),
    n: common_vendor.t(((_k = $data.contentInfo[0]) == null ? void 0 : _k.grid) === "公益" ? "捐赠款项" : "立即兑换"),
    o: common_vendor.o((...args) => $options.toBuy && $options.toBuy(...args)),
    p: $data.isIos ? 1 : ""
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-ca87d06e"]]);
_sfc_main.__runtimeHooks = 1;
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/secondPages/shopDetail/shopDetail.js.map
