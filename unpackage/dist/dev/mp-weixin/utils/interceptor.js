"use strict";
const common_vendor = require("../common/vendor.js");
const whiteList = [
  "/secondPages/news/news",
  "/secondPages/faith/faith",
  "/secondPages/cultureCreativity/cultureCreativity",
  "/secondPages/fuCulture/fuCulture",
  "/secondPages/mazuCulture/mazuCulture",
  "/secondPages/palaceTemple/palaceTemple",
  "/secondPages/publication/publication",
  "/secondPages/tourism/tourism",
  "/secondPages/gridDetail/gridDetail",
  "/secondPages/communityDetail/communityDetail",
  "/secondPages/topicDetail/topicDetail",
  "/secondPages/search/search",
  "/secondPages/shopDetail/shopDetail",
  "/secondPages/contact/contact",
  // 开发所需
  // '/secondPages/commitOrder/commitOrder',
  // '/secondPages/setAddress/setAddress',
  // '/secondPages/addAddress/addAddress',
  "/secondPages/praysDetail/praysDetail"
];
let navigateToCount = 0;
function hasPermission(url) {
  const isLoggedIn = common_vendor.index.getStorageSync("isLoggedIn");
  const urlPath = url.split("?")[0];
  return whiteList.includes(urlPath) || isLoggedIn;
}
common_vendor.index.addInterceptor("navigateTo", {
  invoke(e) {
    if (!hasPermission(e.url)) {
      navigateToCount++;
      if (navigateToCount < 2) {
        common_vendor.index.navigateTo({
          url: "/pages/login/login"
        });
        return false;
      } else {
        navigateToCount = 0;
        return true;
      }
    }
    return true;
  },
  success(e) {
  }
});
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/interceptor.js.map
