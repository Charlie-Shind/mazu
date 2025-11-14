"use strict";
const common_vendor = require("../../common/vendor.js");
const apis_shop = require("../../apis/shop.js");
const common_assets = require("../../common/assets.js");
const pageBack = () => "../../components/title/title.js";
const tabBar = () => "../../components/tabbar/tabbar.js";
const _sfc_main = {
  data() {
    return {
      titleInfo: {
        titleShow: true,
        title: "商城",
        imageUrl: "https://mazu-1320314698.cos.ap-guangzhou.myqcloud.com/pageBack/1.webp",
        heightShow: false,
        backShow: false
      },
      list: [],
      recommendList: [],
      gridList: [],
      activeIndex: 0
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
    tabBar
  },
  methods: {
    // 洗牌算法 进行随机操作
    randomRecommendList(count) {
      const shuffled = [...this.list];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled.slice(0, count);
    },
    setActiveGrid(index, item) {
      this.activeIndex = index;
      apis_shop.gridSearchShopAPI(
        item.grid
      ).then((res) => {
        this.list = res.message.map((item2) => {
          return {
            ...item2,
            imageUrl: JSON.parse(item2.imageUrl)
          };
        });
      });
    },
    // 获取种类
    getGrid() {
      apis_shop.getShopGridAPI().then((res) => {
        const filteredList = res.message.filter((item) => item.grid !== "其他");
        const shuffleArray = (array) => {
          for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
          }
          return array;
        };
        const shuffledList = shuffleArray(filteredList);
        const selectedItems = shuffledList.slice(0, 3);
        this.gridList = [{
          grid: "全部"
        }, ...selectedItems, {
          grid: "其他"
        }];
      });
    },
    // 获取商品数据
    getShopList() {
      apis_shop.getShopListAPI().then((res) => {
        this.list = res.message.map((item) => {
          return {
            ...item,
            imageUrl: JSON.parse(item.imageUrl)
          };
        });
        this.recommendList = this.randomRecommendList(5);
      });
    },
    // 获取商品页面
    toShowDetail(id) {
      common_vendor.index.__f__("log", "at pages/shop/shop.vue:172", id);
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
  const _component_tabBar = common_vendor.resolveComponent("tabBar");
  (_component_pageBack + _component_tabBar)();
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
        c: common_vendor.t(item.price.toFixed(2)),
        d: common_vendor.o(($event) => $options.toShowDetail(item.id), item.id),
        e: item.id
      };
    }),
    e: common_vendor.f($data.list, (item, index, i0) => {
      return {
        a: item.imageUrl[0],
        b: common_vendor.t(item.shopname),
        c: common_vendor.t(item.price.toFixed(2)),
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
