"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
require("./utils/interceptor.js");
if (!Math) {
  "./pages/index/index.js";
  "./pages/prays/prays.js";
  "./pages/shop/shop.js";
  "./pages/community/community.js";
  "./pages/mine/mine.js";
  "./pages/login/login.js";
  "./secondPages/news/news.js";
  "./secondPages/fuCulture/fuCulture.js";
  "./secondPages/faith/faith.js";
  "./secondPages/mazuCulture/mazuCulture.js";
  "./secondPages/palaceTemple/palaceTemple.js";
  "./secondPages/publication/publication.js";
  "./secondPages/cultureCreativity/cultureCreativity.js";
  "./secondPages/tourism/tourism.js";
  "./secondPages/accountSet/accountSet.js";
  "./secondPages/gridDetail/gridDetail.js";
  "./secondPages/communityDetail/communityDetail.js";
  "./secondPages/topicDetail/topicDetail.js";
  "./secondPages/search/search.js";
  "./secondPages/communityAdd/communityAdd.js";
  "./secondPages/shopDetail/shopDetail.js";
  "./secondPages/commitOrder/commitOrder.js";
  "./secondPages/setAddress/setAddress.js";
  "./secondPages/addAddress/addAddress.js";
  "./secondPages/orderPage/orderPage.js";
  "./secondPages/myOrder/myOrder.js";
  "./secondPages/tourHistory/tourHistory.js";
  "./secondPages/agreement/agreement.js";
  "./secondPages/contact/contact.js";
  "./secondPages/praysDetail/praysDetail.js";
  "./secondPages/incense/incense.js";
  "./secondPages/orderDetail/orderDetail.js";
  "./secondPages/myPost/myPost.js";
  "./secondPages/webview/webview.js";
  "./secondPages/webview/webview-2.js";
  "./secondPages/ARView/ARView.js";
  "./secondPages/myCertificate/myCertificate.js";
  "./secondPages/ai-chat/ai-chat.js";
  "./secondPages/ai-image/ai-image.js";
  "./secondPages/generateimg/generateimg.js";
}
const _sfc_main = {
  onLoad() {
    common_vendor.index.hideTabBar();
  },
  onShow() {
    setTimeout(() => {
      common_vendor.index.hideTabBar();
    }, 100);
  }
};
function createApp() {
  const app = common_vendor.createSSRApp(_sfc_main);
  const pinia = common_vendor.createPinia();
  app.use(pinia);
  return {
    app,
    Pinia: common_vendor.Pinia
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
//# sourceMappingURL=../.sourcemap/mp-weixin/app.js.map
