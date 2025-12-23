"use strict";
const apis_user = require("../../apis/user.js");
const store_userInfo = require("../../store/userInfo.js");
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      isShow: false,
      time: 5,
      timer: null,
      clickLocked: false
      // 防止重复触发
    };
  },
  mounted() {
    this.isShow = true;
    this.autoClose();
    const user = store_userInfo.useUserInfoStore().$state.userInfo;
    if (user == null ? void 0 : user.id)
      apis_user.userVisitCountAPI(user.id);
    apis_user.visitCountAPI();
  },
  methods: {
    // 点击遮罩空白区域时不触发任何事件
    onMaskClick(e) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    },
    // 点击“跳过”
    closeMask(e) {
      if (e && e.stopPropagation)
        e.stopPropagation();
      this.isShow = false;
      setTimeout(() => {
        this.$emit("mask-closed", true);
      }, 800);
    },
    // 自动倒计时关闭
    autoClose() {
      this.timer = setInterval(() => {
        this.time--;
        if (this.time <= 0) {
          clearInterval(this.timer);
          this.closeMask();
        }
      }, 1e3);
    }
  },
  beforeDestroy() {
    clearInterval(this.timer);
  }
};
if (!Array) {
  const _component_transition = common_vendor.resolveComponent("transition");
  _component_transition();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.isShow
  }, $data.isShow ? {
    b: common_vendor.t($data.time),
    c: common_vendor.o((...args) => $options.closeMask && $options.closeMask(...args)),
    d: common_vendor.o((...args) => $options.onMaskClick && $options.onMaskClick(...args))
  } : {}, {
    e: common_vendor.p({
      name: "mask-transition"
    })
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-10056c54"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/mask/mask.js.map
