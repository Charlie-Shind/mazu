"use strict";
const common_vendor = require("../common/vendor.js");
const useCounterStore = common_vendor.defineStore("switchTab", {
  state: () => {
    return {
      currentTab: 0
    };
  },
  actions: {
    // getPage() {
    // 	// 获取当前页面的路径
    // 	const pages = getCurrentPages(); // 获取页面栈
    // 	if (pages.length > 0) {
    // 		const currentPage = pages[pages.length - 1]; // 获取当前页面
    // 		const currentPath = currentPage.route; // 获取当前页面的路径
    // 		if (currentPath == 'pages/index/index' || currentPath == '/') {
    // 			this.currentTab = 0
    // 			uni.__f__('log','at store/switchTab.js:21','0');
    // 		} else if (currentPath == 'pages/shop/shop') {
    // 			this.currentTab = 2
    // 			uni.__f__('log','at store/switchTab.js:24','2');
    // 		}
    // 	} else {
    // 		uni.__f__('warn','at store/switchTab.js:27','No pages found in stack.');
    // 	}
    // }
  }
});
exports.useCounterStore = useCounterStore;
//# sourceMappingURL=../../.sourcemap/mp-weixin/store/switchTab.js.map
