"use strict";
const common_vendor = require("../../common/vendor.js");
const apis_shop = require("../../apis/shop.js");
const common_assets = require("../../common/assets.js");
const pageBack = () => "../../components/title/title.js";
const _sfc_main = {
  data() {
    return {
      titleInfo: {
        titleShow: true,
        title: "公益项目",
        imageUrl: "http://t73sifiwt.hn-bkt.clouddn.com/pageBack/3.webp",
        heightShow: false,
        backShow: true
      },
      list: [],
      searchText: ""
    };
  },
  components: {
    pageBack
  },
  onLoad() {
    this.getPublicProjects();
  },
  methods: {
    // ========== 新增：价格格式化方法 ==========
    formatPrice(price) {
      const num = Number(price);
      return isNaN(num) ? "0.00" : num.toFixed(2);
    },
    // 获取公益项目列表
    getPublicProjects() {
      apis_shop.gridSearchShopAPI("公益").then((res) => {
        if (res && res.message) {
          this.list = res.message.map((item) => {
            return {
              ...item,
              imageUrl: JSON.parse(item.imageUrl || "[]")
              // 容错：imageUrl 为空时解析为空数组
            };
          });
        } else {
          this.list = [];
        }
      }).catch((err) => {
        common_vendor.index.__f__("error", "at secondPages/incense/incense.vue:86", "获取公益项目失败：", err);
        this.list = [];
      });
    },
    // 搜索公益项目
    searchProjects() {
      if (!this.searchText) {
        this.getPublicProjects();
        return;
      }
      const filteredList = this.list.filter(
        (item) => item.shopname.toLowerCase().includes(this.searchText.toLowerCase())
      );
      this.list = filteredList;
    },
    // 跳转到商品详情页
    toShowDetail(id) {
      common_vendor.index.navigateTo({
        url: `/secondPages/shopDetail/shopDetail?shopId=${id}`
      });
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
    b: common_vendor.o([($event) => $data.searchText = $event.detail.value, (...args) => $options.searchProjects && $options.searchProjects(...args)]),
    c: $data.searchText,
    d: common_assets._imports_0$1,
    e: common_vendor.f($data.list, (item, index, i0) => {
      return {
        a: item.imageUrl[0],
        b: common_vendor.t(item.shopname),
        c: common_vendor.t($options.formatPrice(item.price)),
        d: index,
        e: common_vendor.o(($event) => $options.toShowDetail(item.id), index)
      };
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-e5e4e616"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/secondPages/incense/incense.js.map
