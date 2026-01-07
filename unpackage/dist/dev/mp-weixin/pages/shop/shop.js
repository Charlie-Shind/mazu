"use strict";
const common_vendor = require("../../common/vendor.js");
const apis_shop = require("../../apis/shop.js");
const common_assets = require("../../common/assets.js");
const pageBack = () => "../../components/title/title.js";
const tabBar = () => "../../components/tabbar/tabbar.js";
const IncenseFab = () => "../../components/incense-fab/incense-fab.js";
const _sfc_main = {
  data() {
    return {
      titleInfo: {
        titleShow: true,
        title: "商城",
        imageUrl: "http://t73sifiwt.hn-bkt.clouddn.com/pageBack/1.webp",
        heightShow: false,
        backShow: false
      },
      list: [],
      recommendList: [],
      gridList: [],
      activeIndex: 0,
      activeGridName: "全部",
      // ✅新增：记录当前选中的分类名称
      // ✅新增：你的8张公益静态图片地址 完整保留
      staticImgList: [
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
  onLoad() {
    this.getShopList();
  },
  onShow() {
    this.setActiveGrid(0, {
      grid: "全部"
    });
    this.getGrid();
  },
  components: {
    pageBack,
    tabBar,
    IncenseFab
  },
  methods: {
    // ========== 价格格式化方法 ==========
    formatPrice(price) {
      const num = Number(price);
      return isNaN(num) ? "0.00" : num.toFixed(2);
    },
    // ========== 洗牌算法 进行随机操作 ==========
    randomRecommendList(count) {
      const filterNoPublic = [...this.list].filter((item) => item.grid !== "公益");
      const shuffled = [...filterNoPublic];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled.slice(0, count);
    },
    // ✅修改：新增记录当前选中的分类名称
    setActiveGrid(index, item) {
      this.activeIndex = index;
      this.activeGridName = item.grid;
      apis_shop.gridSearchShopAPI(item.grid).then((res) => {
        if (res && res.message) {
          this.list = res.message.map((item2) => {
            return {
              ...item2,
              imageUrl: JSON.parse(item2.imageUrl || "[]")
            };
          });
        } else {
          this.list = [];
        }
      }).catch((err) => {
        common_vendor.index.__f__("error", "at pages/shop/shop.vue:152", "分类查询失败：", err);
        this.list = [];
      });
    },
    // 获取种类
    getGrid() {
      apis_shop.getShopGridAPI().then((res) => {
        const originalList = (res == null ? void 0 : res.message) || [];
        const filteredList = originalList.filter((item) => (item == null ? void 0 : item.grid) !== "其他");
        const shuffleArray = (array) => {
          const newArray = [...array];
          for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
          }
          return newArray;
        };
        const shuffledList = shuffleArray(filteredList);
        const selectedItems = shuffledList.length > 0 ? shuffledList.slice(0, 3) : [];
        this.gridList = [{ grid: "全部" }, ...selectedItems, { grid: "其他" }];
      }).catch((err) => {
        common_vendor.index.__f__("error", "at pages/shop/shop.vue:178", "获取分类列表失败：", err);
        this.gridList = [{ grid: "全部" }, { grid: "其他" }];
      });
    },
    // 获取商品数据
    getShopList() {
      apis_shop.getShopListAPI().then((res) => {
        if (res && res.message) {
          this.list = res.message.map((item) => {
            return {
              ...item,
              imageUrl: JSON.parse(item.imageUrl || "[]")
            };
          });
          this.recommendList = this.randomRecommendList(5);
        } else {
          this.list = [];
          this.recommendList = [];
        }
      }).catch((err) => {
        common_vendor.index.__f__("error", "at pages/shop/shop.vue:200", "获取商品列表失败：", err);
        this.list = [];
        this.recommendList = [];
      });
    },
    // 获取商品页面
    toShowDetail(id) {
      common_vendor.index.__f__("log", "at pages/shop/shop.vue:207", id);
      common_vendor.index.navigateTo({
        url: `/secondPages/shopDetail/shopDetail?shopId=${id}`
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
  return {
    a: common_vendor.p({
      titleInfo: $data.titleInfo
    }),
    b: common_assets._imports_0$1,
    c: common_vendor.f($data.gridList, (item, index, i0) => {
      return {
        a: common_vendor.t(item.grid),
        b: index,
        c: $data.activeIndex === index ? 1 : "",
        d: common_vendor.o(($event) => $options.setActiveGrid(index, item), index)
      };
    }),
    d: common_vendor.f($data.recommendList, (item, k0, i0) => {
      return {
        a: item.imageUrl[0],
        b: common_vendor.t(item.shopname),
        c: common_vendor.t($options.formatPrice(item.price)),
        d: common_vendor.o(($event) => $options.toShowDetail(item.id), item.id),
        e: item.id
      };
    }),
    e: common_vendor.f($data.list, (item, index, i0) => {
      return {
        a: $data.activeGridName === "公益" ? $data.staticImgList[index % $data.staticImgList.length] : item.imageUrl[0],
        b: common_vendor.t(item.shopname),
        c: common_vendor.t($options.formatPrice(item.price)),
        d: index,
        e: common_vendor.o(($event) => $options.toShowDetail(item.id), index)
      };
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-2a6aaf81"]]);
_sfc_main.__runtimeHooks = 1;
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/shop/shop.js.map
