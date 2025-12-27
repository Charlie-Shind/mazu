"use strict";
const common_vendor = require("../../common/vendor.js");
const apis_index = require("../../apis/index.js");
const apis_community = require("../../apis/community.js");
const common_assets = require("../../common/assets.js");
const tabBar = () => "../../components/tabbar/tabbar.js";
const pageBack = () => "../../components/title/title.js";
const maskPage = () => "../../components/mask/mask.js";
const IncenseFab = () => "../../components/incense-fab/incense-fab.js";
const _sfc_main = {
  data() {
    return {
      // 轮播图数据
      swiperData: [],
      // grid宫格数据
      gridData: [
        {
          id: 1,
          imageUrl: "http://t73sifiwt.hn-bkt.clouddn.com/index/icon/new.svg",
          text: "新闻中心",
          url: "/secondPages/news/news"
        },
        {
          id: 2,
          imageUrl: "http://t73sifiwt.hn-bkt.clouddn.com/index/icon/fu.svg",
          text: "福文化",
          url: "/secondPages/fuCulture/fuCulture"
        },
        {
          id: 3,
          imageUrl: "http://t73sifiwt.hn-bkt.clouddn.com/index/icon/xin.svg",
          text: "信俗活动",
          url: "/secondPages/faith/faith"
        },
        {
          id: 4,
          imageUrl: "http://t73sifiwt.hn-bkt.clouddn.com/index/icon/ma.svg",
          text: "妈祖文化",
          url: "/secondPages/mazuCulture/mazuCulture"
        },
        {
          id: 5,
          imageUrl: "http://t73sifiwt.hn-bkt.clouddn.com/index/icon/miao.svg",
          text: "天下宫庙",
          url: "/secondPages/palaceTemple/palaceTemple"
        },
        {
          id: 6,
          imageUrl: "http://t73sifiwt.hn-bkt.clouddn.com/index/icon/shu.svg",
          text: "数字出版",
          url: "/secondPages/publication/publication"
        },
        {
          id: 7,
          imageUrl: "http://t73sifiwt.hn-bkt.clouddn.com/index/icon/wen.svg",
          text: "妈祖文创",
          url: "/secondPages/cultureCreativity/cultureCreativity"
        },
        {
          id: 8,
          imageUrl: "http://t73sifiwt.hn-bkt.clouddn.com/index/icon/you.svg",
          text: "两岸旅游",
          url: "/secondPages/tourism/tourism"
        }
      ],
      // 妈祖动态数据
      news: [],
      // 文创作品数据
      creativity: [],
      // 瀑布流数据
      list: [],
      titleInfo: {
        titleShow: true,
        title: "福泽海韵",
        heightShow: false,
        imageUrl: ""
      },
      isMaskLoaded: false,
      navBlocked: false
    };
  },
  components: {
    pageBack,
    tabBar,
    maskPage,
    IncenseFab
  },
  onLoad() {
    apis_index.getCarouselAPI().then((res) => {
      this.swiperData = res.message;
    });
    apis_community.getCommunityItemAPI().then((res) => {
      common_vendor.index.__f__("log", "at pages/index/index.vue:239", res);
      this.list = res.message.map((item) => {
        return {
          ...item,
          imageUrl: JSON.parse(item.imageUrl)
        };
      });
      common_vendor.index.__f__("log", "at pages/index/index.vue:246", this.list);
      this.list.sort(() => Math.random() - 0.5);
    });
    apis_index.getindexGridNewsAPI().then((res) => {
      this.news = res.message.map((item) => {
        return {
          ...item,
          imageUrl: JSON.parse(item.imageUrl)
        };
      });
    });
    apis_index.getindexGridCultureCreativityAPI().then((res) => {
      this.creativity = res.message.map((item) => {
        return {
          ...item,
          imageUrl: JSON.parse(item.imageUrl)
        };
      });
    });
  },
  methods: {
    onMaskClosed() {
      common_vendor.index.showLoading({
        title: "页面加载中请稍后...",
        mask: true
      });
      this.navBlocked = true;
      setTimeout(() => {
        this.isMaskLoaded = true;
        this.navBlocked = false;
        common_vendor.index.hideLoading();
      }, 5e3);
    },
    to(url) {
      common_vendor.index.navigateTo({ url });
    },
    // 其他导航也做同样检查
    toIconPage(item) {
      common_vendor.index.navigateTo({
        url: item.url + `?pageType=${item.text}`
      });
    },
    toPage(item, type) {
      const { id, grid } = item;
      common_vendor.index.navigateTo({
        url: `/secondPages/gridDetail/gridDetail?pageType=${type}&pageId=${id}&pageGrid=${grid}`
      });
    },
    detail(item) {
      common_vendor.index.navigateTo({
        url: `/secondPages/communityDetail/communityDetail?postId=${item.id}`
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
  const _component_maskPage = common_vendor.resolveComponent("maskPage");
  const _component_pageBack = common_vendor.resolveComponent("pageBack");
  const _easycom_incense_fab2 = common_vendor.resolveComponent("incense-fab");
  const _component_tabBar = common_vendor.resolveComponent("tabBar");
  (_component_maskPage + _component_pageBack + _easycom_incense_fab2 + _component_tabBar)();
}
const _easycom_incense_fab = () => "../../components/incense-fab/incense-fab.js";
if (!Math) {
  _easycom_incense_fab();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: !$data.isMaskLoaded
  }, !$data.isMaskLoaded ? {
    b: common_vendor.o($options.onMaskClosed)
  } : {}, {
    c: common_vendor.o(($event) => $options.to("/secondPages/ARView/ARView")),
    d: common_assets._imports_0,
    e: common_vendor.o(($event) => $options.to("/secondPages/ai-chat/ai-chat")),
    f: $data.isMaskLoaded
  }, $data.isMaskLoaded ? {
    g: common_vendor.p({
      titleInfo: $data.titleInfo
    }),
    h: common_vendor.f($data.swiperData, (item, k0, i0) => {
      return {
        a: item.imageUrl,
        b: item.id
      };
    }),
    i: common_vendor.o(($event) => $options.to("/secondPages/webview/webview-2")),
    j: common_vendor.o(($event) => $options.to("/secondPages/webview/webview")),
    k: common_vendor.f($data.gridData, (item, k0, i0) => {
      return {
        a: item.imageUrl,
        b: common_vendor.t(item.text),
        c: common_vendor.o(($event) => $options.toIconPage(item), item.id),
        d: item.id
      };
    }),
    l: common_vendor.o(($event) => $options.to("/secondPages/news/news")),
    m: common_vendor.f($data.news.slice(7, 15), (item, index, i0) => {
      return {
        a: item.imageUrl,
        b: common_vendor.t(item.title),
        c: common_vendor.o(($event) => $options.toPage(item, "新闻中心"))
      };
    }),
    n: common_vendor.o((...args) => _ctx.scroll && _ctx.scroll(...args)),
    o: common_vendor.o(($event) => $options.to("/secondPages/cultureCreativity/cultureCreativity")),
    p: common_vendor.f($data.creativity, (item, index, i0) => {
      return {
        a: item.imageUrl,
        b: common_vendor.t(item.title),
        c: item.content,
        d: common_vendor.o(($event) => $options.toPage(item, "妈祖文创"))
      };
    }),
    q: common_vendor.o((...args) => _ctx.scroll && _ctx.scroll(...args)),
    r: common_vendor.f($data.list, (item, index, i0) => {
      return {
        a: item.imageUrl[0],
        b: common_vendor.t(item.title),
        c: item.avatarurl,
        d: common_vendor.t(item.nickname),
        e: index,
        f: common_vendor.o(($event) => $options.detail(item), index)
      };
    })
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-1cf27b2a"]]);
_sfc_main.__runtimeHooks = 1;
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
