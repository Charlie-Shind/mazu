"use strict";
const common_vendor = require("../../common/vendor.js");
const apis_index = require("../../apis/index.js");
const common_assets = require("../../common/assets.js");
const pageBack = () => "../../components/title/title.js";
const _sfc_main = {
  data() {
    return {
      titleInfo: {
        titleShow: true,
        title: "妈祖文创",
        imageUrl: "http://t73sifiwt.hn-bkt.clouddn.com/pageBack/1.webp",
        heightShow: false,
        backShow: true
      },
      titles: [],
      currentIndex: 0,
      // 当前选中的标题索引
      list: [{
        title: "不止只有冰雕，几千年前的“东北人”还能把他整“活”了",
        time: "2024/06/07",
        imageUrl: "/static/logo.png"
      }],
      swiperHeight: 0,
      gridNews: {},
      newsGridNews: [{}, {}, {}]
    };
  },
  components: {
    pageBack
  },
  onLoad(option) {
    this.pageType = option.pageType;
  },
  onReady() {
    apis_index.getindexGridCultureCreativityAPI().then((res) => {
      this.list = res.message.map((item) => {
        return {
          ...item,
          // 解析图片字符串
          imageUrl: JSON.parse(item.imageUrl),
          // 调用formatDate函数解析时间
          time: this.formatDate(item.time)
        };
      });
      this.titles = [...new Set(this.list.map((item) => item.grid))].filter((grid) => grid !== void 0);
      this.list.forEach((item) => {
        const {
          grid
        } = item;
        if (!this.gridNews[grid]) {
          this.gridNews[grid] = [];
        }
        this.gridNews[grid].push(item);
      });
      this.newsGridNews = Object.values(this.gridNews);
      this.toSwiper(0);
    });
  },
  methods: {
    toSwiper(index) {
      this.currentIndex = index;
      this.getItemHeight(this.newsGridNews[index].length);
    },
    onSwiperChange(e) {
      this.currentIndex = e.detail.current;
      this.getItemHeight(this.newsGridNews[e.detail.current].length);
    },
    getItemHeight(count) {
      const query = common_vendor.index.createSelectorQuery().in(this);
      query.select(".itemBox").boundingClientRect((data) => {
        this.swiperHeight = count * data.height;
      }).exec();
    },
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
    toPage(item) {
      const {
        grid,
        id
      } = item;
      common_vendor.index.navigateTo({
        url: `/secondPages/gridDetail/gridDetail?pageType=${this.pageType}&pageId=${id}&pageGrid=${grid}`
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
  _component_pageBack();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.p({
      titleInfo: $data.titleInfo
    }),
    b: common_assets._imports_0$2,
    c: common_vendor.t($data.list.length),
    d: common_vendor.f($data.titles, (item, index, i0) => {
      return {
        a: common_vendor.t(item),
        b: $data.currentIndex === index ? 1 : "",
        c: common_vendor.o(($event) => $options.toSwiper(index))
      };
    }),
    e: common_vendor.f($data.newsGridNews, (item2, index, i0) => {
      return {
        a: common_vendor.f(item2, (item, k1, i1) => {
          return {
            a: common_vendor.t(item.title),
            b: common_vendor.t(item.time),
            c: item.imageUrl[0],
            d: common_vendor.o(($event) => $options.toPage(item))
          };
        })
      };
    }),
    f: $data.currentIndex,
    g: common_vendor.o((...args) => $options.onSwiperChange && $options.onSwiperChange(...args)),
    h: $data.swiperHeight + "px"
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-12a6ca7e"]]);
_sfc_main.__runtimeHooks = 1;
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/secondPages/cultureCreativity/cultureCreativity.js.map
