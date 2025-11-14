"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const pageBack = () => "../../components/title/title.js";
const _sfc_main = {
  data() {
    return {
      titleInfo: {
        titleShow: true,
        title: "妈祖灵签",
        imageUrl: "https://mazu-1320314698.cos.ap-guangzhou.myqcloud.com/pageBack/1.webp",
        heightShow: false,
        backShow: true,
        classShow: true
      },
      imageShow: true
    };
  },
  components: {
    pageBack
  },
  onLoad(option) {
    common_vendor.index.__f__("log", "at secondPages/praysDetail/praysDetail.vue:46", option.randomPrays);
  },
  methods: {
    explain() {
      this.imageShow = !this.imageShow;
    }
  }
};
if (!Array) {
  const _component_pageBack = common_vendor.resolveComponent("pageBack");
  _component_pageBack();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.p({
      titleInfo: $data.titleInfo
    }),
    b: $data.imageShow
  }, $data.imageShow ? {
    c: common_assets._imports_0$8,
    d: common_vendor.o((...args) => $options.explain && $options.explain(...args))
  } : {
    e: common_vendor.o((...args) => $options.explain && $options.explain(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/secondPages/praysDetail/praysDetail.js.map
