"use strict";
const common_vendor = require("../common/vendor.js");
const domain = "http://47.122.115.28";
const base_url = `${domain}:${common_vendor.wx$1.getSystemInfoSync().platform === "devtools" ? 8889 : 6869}`;
const timeout = 5e3;
const request = (params) => {
  let url = params.url;
  let method = params.method || "get";
  let data = params.data || {};
  const token = common_vendor.index.getStorageSync("token");
  let header = {
    "Blade-Auth": common_vendor.index.getStorageSync("token") || "",
    "Content-Type": "application/json;charset=UTF-8",
    "Authorization": token,
    "Tenant-Id": common_vendor.index.getStorageSync("tenantId") || "xxx",
    ...params.header
  };
  if (method == "post") {
    header = {
      "Content-Type": "application/json"
    };
  }
  return new Promise((resolve, reject) => {
    common_vendor.index.showLoading({
      title: "加载中...",
      mask: true
    });
    common_vendor.index.request({
      url: base_url + url,
      method,
      header,
      data,
      timeout,
      success(response) {
        const res = response;
        if (res.statusCode == 200) {
          resolve(res.data);
        } else {
          switch (res.statusCode) {
            case 401:
              common_vendor.index.showModal({
                title: "提示",
                content: "请登录",
                showCancel: false
                // 这里可以添加跳转到登录页面的逻辑  
              });
              break;
            case 404:
              common_vendor.index.showToast({
                title: "请求地址不存在...",
                duration: 2e3
              });
              break;
            default:
              common_vendor.index.showToast({
                title: "请重试...",
                duration: 2e3
              });
              break;
          }
          reject(res);
        }
      },
      fail(err) {
        common_vendor.index.__f__("log", "at utils/request.js:74", "错误" + err);
        if (err.errMsg.indexOf("request:fail") !== -1) {
          common_vendor.index.showToast({
            title: "网络异常",
            icon: "error",
            duration: 2e3
          });
        } else {
          common_vendor.index.showToast({
            title: "未知异常",
            duration: 2e3
          });
        }
        reject(err);
      },
      // 请求结束时隐藏 loading 动画  
      complete() {
        common_vendor.index.hideLoading();
      }
    });
  }).catch(() => {
    common_vendor.index.hideLoading();
  });
};
exports.base_url = base_url;
exports.request = request;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/request.js.map
