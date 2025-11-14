"use strict";
const common_vendor = require("../../common/vendor.js");
const tabBar = () => "../../components/tabbar/tabbar.js";
const _sfc_main = {
  data() {
    return {
      titleInfo: {
        titleShow: true,
        title: "祈福",
        imageUrl: "https://mazu-1320314698.cos.ap-guangzhou.myqcloud.com/pageBack/3.webp",
        heightShow: false
      },
      isShaking: false,
      isProcessing: false
      // 新增状态变量
    };
  },
  components: {
    tabBar
  },
  onShow() {
    this.startShakeListener();
    common_vendor.index.__f__("log", "at pages/prays/prays.vue:44", "我被触发辣1");
  },
  onHide() {
    this.stopShakeListener();
    common_vendor.index.__f__("log", "at pages/prays/prays.vue:48", "我被触发辣2");
  },
  methods: {
    startShakeListener() {
      this.handleShake = this.handleShake.bind(this);
      this.gyroscopeChangeHandler = common_vendor.index.onGyroscopeChange(this.handleShake);
      common_vendor.index.startGyroscope({
        interval: "normal"
      });
    },
    stopShakeListener() {
      if (this.gyroscopeChangeHandler) {
        this.gyroscopeChangeHandler();
        this.gyroscopeChangeHandler = null;
      }
      common_vendor.index.stopGyroscope();
    },
    handleShake(res) {
      if (this.isProcessing)
        return;
      if (Math.abs(res.x) > 20 || Math.abs(res.y) > 4 || Math.abs(res.z) > 3) {
        this.isProcessing = true;
        common_vendor.index.showLoading({
          title: "求签中",
          mask: true
        });
        this.randomNumber = Math.floor(Math.random() * 60) + 1;
        this.isShaking = true;
        setTimeout(() => {
          this.isShaking = false;
        }, 2e3);
        setTimeout(() => {
          common_vendor.index.hideLoading();
          common_vendor.index.navigateTo({
            url: `/secondPages/praysDetail/praysDetail?randomPrays=${this.randomNumber}`
          });
          this.isProcessing = false;
        }, 3e3);
      }
    }
  }
};
if (!Array) {
  const _component_tabBar = common_vendor.resolveComponent("tabBar");
  _component_tabBar();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.isShaking ? 1 : ""
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/prays/prays.js.map
