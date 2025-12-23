"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  name: "IncenseFab",
  methods: {
    goIncense() {
      common_vendor.index.navigateTo({
        url: "/secondPages/incense/incense"
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o((...args) => $options.goIncense && $options.goIncense(...args))
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-570a7450"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/incense-fab/incense-fab.js.map
