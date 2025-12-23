"use strict";
const common_vendor = require("../../common/vendor.js");
const apis_index = require("../../apis/index.js");
const pageBack = () => "../../components/title/title.js";
const _sfc_main = {
  data() {
    return {
      titleInfo: {
        titleShow: true,
        title: "",
        imageUrl: "http://t73sifiwt.hn-bkt.clouddn.com/pageBack/1.webp",
        heightShow: false,
        backShow: true
      },
      pageInfo: []
    };
  },
  onLoad(option) {
    this.titleInfo.title = option.pageGrid;
    const apiMapping = {
      // 新闻中心
      "新闻中心": apis_index.getindexNewsItemAPI,
      "妈祖新闻": apis_index.getindexNewsItemAPI,
      "两岸交流": apis_index.getindexNewsItemAPI,
      "福文化": apis_index.getindexFuCultureItemAPI,
      "信俗活动": apis_index.getindexFaithItemAPI,
      "妈祖文化": apis_index.getindexGridPalaceTempleAPI,
      "天下宫庙": apis_index.getindexPalaceTempleItemAPI,
      "数字出版": apis_index.getindexPublicationItemAPI,
      // 妈祖文创
      "妈祖文创": apis_index.getindexCultureCreativityItemAPI,
      "摄影作品": apis_index.getindexCultureCreativityItemAPI,
      "两岸旅游": apis_index.getindexTourismItemAPI,
      "妈祖诞辰": apis_index.getindexGridFaithAPI,
      // 妈祖传说
      "妈祖传说": apis_index.getindexGridMazuCultureAPI,
      "妈祖非遗": apis_index.getindexGridMazuCultureAPI
    };
    const apiFunction = apiMapping[option.pageGrid];
    if (apiFunction) {
      apiFunction({
        id: option.pageId
      }).then((res) => {
        this.pageInfo = res.message.map((item) => {
          return {
            ...item,
            imageUrl: JSON.parse(item.imageUrl)
          };
        });
      }).catch((error) => {
        common_vendor.index.__f__("error", "at secondPages/gridDetail/gridDetail.vue:98", "获取数据时出错:", error);
      });
    }
  },
  components: {
    pageBack
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
    previewImage(currentIndex) {
      var _a;
      const urls = ((_a = this.pageInfo[0]) == null ? void 0 : _a.imageUrl) || [];
      common_vendor.index.previewImage({
        current: urls[currentIndex],
        // 当前显示图片的http链接
        urls
        // 需要预览的图片http链接列表
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
  var _a, _b, _c, _d, _e, _f, _g;
  return common_vendor.e({
    a: common_vendor.p({
      titleInfo: $data.titleInfo
    }),
    b: common_vendor.t((_a = $data.pageInfo[0]) == null ? void 0 : _a.title),
    c: common_vendor.t($options.formatDate((_b = $data.pageInfo[0]) == null ? void 0 : _b.time)),
    d: (_c = $data.pageInfo[0]) == null ? void 0 : _c.content,
    e: ((_d = $data.pageInfo[0]) == null ? void 0 : _d.imageUrl.length) > 1
  }, ((_e = $data.pageInfo[0]) == null ? void 0 : _e.imageUrl.length) > 1 ? {
    f: common_vendor.f((_f = $data.pageInfo[0]) == null ? void 0 : _f.imageUrl, (item, index, i0) => {
      return {
        a: item,
        b: common_vendor.o(($event) => $options.previewImage(index))
      };
    })
  } : {
    g: common_vendor.f((_g = $data.pageInfo[0]) == null ? void 0 : _g.imageUrl, (item, index, i0) => {
      return {
        a: item,
        b: common_vendor.o(($event) => $options.previewImage(index))
      };
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-f9b31096"]]);
_sfc_main.__runtimeHooks = 1;
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/secondPages/gridDetail/gridDetail.js.map
