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
      searchText: "",
      // 你提供的8张静态封面图地址【核心配置，全部保留】
      staticCoverList: [
        "https://java-ai-ch.oss-cn-beijing.aliyuncs.com/80e2fd9ef24effee752512adfa510fa9.jpg",
        "https://java-ai-ch.oss-cn-beijing.aliyuncs.com/ff59f72d6dd7553974a67b0f9bdeaa5f.jpg",
        "https://java-ai-ch.oss-cn-beijing.aliyuncs.com/dc5eeb8220085d40ac92870d36e25f47.jpg",
        "https://java-ai-ch.oss-cn-beijing.aliyuncs.com/ce99e3bb8a518c78e125db3e679b1c54.jpg",
        "https://java-ai-ch.oss-cn-beijing.aliyuncs.com/4ef8a58c70eaa82f2b7bbabc78e5f022.jpg",
        "https://java-ai-ch.oss-cn-beijing.aliyuncs.com/99ab73a598a00013403781c59b2dfe24.png",
        "https://java-ai-ch.oss-cn-beijing.aliyuncs.com/a78c50ef3df1256278ab813f380b76f3.png",
        "https://java-ai-ch.oss-cn-beijing.aliyuncs.com/3e66ba63898238a9704182b0701819d5.png"
      ]
    };
  },
  components: {
    pageBack
  },
  onLoad() {
    this.getPublicProjects();
    setTimeout(() => {
      this.$refs.publicPopup.open();
    }, 300);
  },
  methods: {
    // ✅ 新增：关闭公益弹窗的方法
    closePublicPopup() {
      this.$refs.publicPopup.close();
    },
    // 价格格式化方法
    formatPrice(price) {
      const num = Number(price);
      return isNaN(num) ? "0.00" : num.toFixed(2);
    },
    // 获取公益项目列表【接口请求保留不变】
    getPublicProjects() {
      apis_shop.gridSearchShopAPI("公益").then((res) => {
        if (res && res.message) {
          this.list = res.message;
        } else {
          this.list = [];
        }
      }).catch((err) => {
        common_vendor.index.__f__("error", "at secondPages/incense/incense.vue:112", "获取公益项目失败：", err);
        this.list = [];
      });
    },
    // 搜索公益项目【保留不变】
    searchProjects() {
      if (!this.searchText) {
        this.getPublicProjects();
        return;
      }
      const filteredList = this.list.filter((item) => item.shopname.toLowerCase().includes(this.searchText.toLowerCase()));
      this.list = filteredList;
    },
    // 跳转到商品详情页【保留不变】
    toShowDetail(id) {
      common_vendor.index.navigateTo({
        url: `/secondPages/shopDetail/shopDetail?shopId=${id}`
      });
    }
  }
};
if (!Array) {
  const _component_pageBack = common_vendor.resolveComponent("pageBack");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  (_component_pageBack + _easycom_uni_popup2)();
}
const _easycom_uni_popup = () => "../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
if (!Math) {
  _easycom_uni_popup();
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
        a: $data.staticCoverList[index % $data.staticCoverList.length],
        b: common_vendor.t(item.shopname),
        c: common_vendor.t($options.formatPrice(item.price)),
        d: index,
        e: common_vendor.o(($event) => $options.toShowDetail(item.id), index)
      };
    }),
    f: common_vendor.o((...args) => $options.closePublicPopup && $options.closePublicPopup(...args)),
    g: common_vendor.sr("publicPopup", "e5e4e616-1"),
    h: common_vendor.p({
      type: "center",
      isMaskClick: false
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-e5e4e616"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/secondPages/incense/incense.js.map
