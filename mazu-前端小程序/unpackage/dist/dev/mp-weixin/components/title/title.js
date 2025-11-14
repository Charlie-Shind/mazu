"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  name: "title",
  data() {
    return {};
  },
  props: {
    titleInfo: {
      type: Object,
      default: () => ({
        titleShow: true,
        title: "福泽海韵",
        heightShow: false,
        imageUrl: "",
        backShow: true
      })
    }
  },
  mounted() {
  },
  methods: {
    backPage() {
      common_vendor.index.navigateBack({
        delta: 1
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $props.titleInfo.titleShow
  }, $props.titleInfo.titleShow ? common_vendor.e({
    b: $props.titleInfo.imageUrl,
    c: common_vendor.s(`margin-top:${$props.titleInfo.height}rpx`),
    d: $props.titleInfo.backShow
  }, $props.titleInfo.backShow ? {
    e: common_vendor.o((...args) => $options.backPage && $options.backPage(...args))
  } : {}, {
    f: common_vendor.t($props.titleInfo.title)
  }) : {}, {
    g: $props.titleInfo.backShow
  }, $props.titleInfo.backShow ? {
    h: common_vendor.o((...args) => $options.backPage && $options.backPage(...args))
  } : {}, {
    i: common_vendor.t($props.titleInfo.title),
    j: $props.titleInfo.heightShow
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-6526118c"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/title/title.js.map
