"use strict";
const common_vendor = require("../../common/vendor.js");
const tabBar = () => "../../components/tabbar/tabbar.js";
const IncenseFab = () => "../../components/incense-fab/incense-fab.js";
const _sfc_main = {
  data() {
    return {
      titleInfo: {
        titleShow: true,
        title: "祈福",
        imageUrl: "http://t73sifiwt.hn-bkt.clouddn.com/pageBack/3.webp",
        heightShow: false
      },
      isShaking: false,
      isProcessing: false
      // 新增状态变量
    };
  },
  components: {
    tabBar,
    IncenseFab
  },
  onLoad() {
    this.checkFirstVisit();
  },
  onShow() {
    this.startShakeListener();
    common_vendor.index.__f__("log", "at pages/prays/prays.vue:67", "我被触发辣1");
  },
  onHide() {
    this.stopShakeListener();
    common_vendor.index.__f__("log", "at pages/prays/prays.vue:71", "我被触发辣2");
  },
  methods: {
    /**
     * 检查是否首次进入
     */
    checkFirstVisit() {
      const hasVisited = common_vendor.index.getStorageSync("prays_first_visit");
      if (!hasVisited) {
        setTimeout(() => {
          this.$refs.firstVisitPopup.open();
        }, 300);
      }
    },
    /**
     * 关闭首次进入弹窗
     */
    closeFirstVisitPopup() {
      common_vendor.index.setStorageSync("prays_first_visit", true);
      this.$refs.firstVisitPopup.close();
    },
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
  const _easycom_incense_fab2 = common_vendor.resolveComponent("incense-fab");
  const _component_tabBar = common_vendor.resolveComponent("tabBar");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  (_easycom_incense_fab2 + _component_tabBar + _easycom_uni_popup2)();
}
const _easycom_incense_fab = () => "../../components/incense-fab/incense-fab.js";
const _easycom_uni_popup = () => "../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
if (!Math) {
  (_easycom_incense_fab + _easycom_uni_popup)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.isShaking ? 1 : "",
    b: common_vendor.o((...args) => $options.closeFirstVisitPopup && $options.closeFirstVisitPopup(...args)),
    c: common_vendor.sr("firstVisitPopup", "0f829124-2"),
    d: common_vendor.p({
      type: "center",
      isMaskClick: false
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/prays/prays.js.map
