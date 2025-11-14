"use strict";
const common_vendor = require("../common/vendor.js");
const useUserInfoStore = common_vendor.defineStore("userInfo", {
  state: () => {
    return {
      userInfo: {}
    };
  },
  actions: {},
  // uniapp方式持久化
  persist: {
    storage: {
      getItem: common_vendor.index.getStorageSync,
      setItem: common_vendor.index.setStorageSync
    }
  }
});
exports.useUserInfoStore = useUserInfoStore;
//# sourceMappingURL=../../.sourcemap/mp-weixin/store/userInfo.js.map
