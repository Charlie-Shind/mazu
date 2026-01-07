"use strict";
const common_vendor = require("../common/vendor.js");
const domain = "https://duoxie.cc.cd/mazu/node";
const base_url = `${domain}${common_vendor.wx$1.getSystemInfoSync().platform === "devtools" ? "" : ""}`;
const ai_base_url = "http://47.95.210.123:8080";
const timeout = 5e4;
const aiWhiteList = ["/user/user/chat", "/user/image/generateimg", "/user/image/mazuCarousel"];
function isAiWhiteList(url) {
  return aiWhiteList.includes(url);
}
const request = (params) => {
  let url = params.url;
  let method = (params.method || "get").toLowerCase();
  let data = params.data || {};
  const finalBaseUrl = isAiWhiteList(url) ? ai_base_url : base_url;
  const token = common_vendor.index.getStorageSync("token");
  let header = {
    "Content-Type": "application/json;charset=UTF-8",
    "Tenant-Id": common_vendor.index.getStorageSync("tenantId") || "xxx",
    ...params.header
    // 外部传入的头优先
  };
  common_vendor.index.__f__("log", "at utils/request.js:31", "是否为非AI接口：", !isAiWhiteList(url));
  common_vendor.index.__f__("log", "at utils/request.js:32", "获取到的token：", token);
  if (!isAiWhiteList(url) && token) {
    header["Blade-Auth"] = token;
    header["Authorization"] = token;
  }
  if (method === "post" && !isAiWhiteList(url)) {
    header["Content-Type"] = "application/json";
  }
  common_vendor.index.__f__("log", "at utils/request.js:45", "===== 请求调试信息 =====");
  common_vendor.index.__f__("log", "at utils/request.js:46", "请求地址:", finalBaseUrl + url);
  common_vendor.index.__f__("log", "at utils/request.js:47", "是否为AI接口:", isAiWhiteList(url));
  common_vendor.index.__f__("log", "at utils/request.js:48", "是否免Token:", isAiWhiteList(url));
  common_vendor.index.__f__("log", "at utils/request.js:49", "最终请求头:", header);
  return new Promise((resolve, reject) => {
    common_vendor.index.request({
      url: finalBaseUrl + url,
      method,
      header,
      data,
      timeout,
      success(response) {
        if (response.statusCode == 200) {
          resolve(response.data);
        } else {
          if (response.statusCode === 401 && isAiWhiteList(url)) {
            common_vendor.index.showToast({
              title: "AI接口请求失败，无需登录",
              icon: "none",
              duration: 2e3
            });
          } else {
            switch (response.statusCode) {
              case 401:
                common_vendor.index.showModal({
                  title: "提示",
                  content: "请登录",
                  showCancel: false
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
                  title: `请求错误：${response.statusCode}`,
                  icon: "none",
                  duration: 2e3
                });
                break;
            }
          }
          reject(response);
        }
      },
      fail(err) {
        common_vendor.index.__f__("error", "at utils/request.js:98", "请求失败详情:", err);
        if (err.errMsg.indexOf("request:fail") !== -1) {
          common_vendor.index.showToast({
            title: "网络异常，请检查连接",
            icon: "none",
            duration: 2e3
          });
        } else if (err.errMsg.includes("timeout")) {
          common_vendor.index.showToast({
            title: "请求超时，请稍后重试",
            icon: "none",
            duration: 2e3
          });
        } else {
          common_vendor.index.showToast({
            title: "未知异常",
            icon: "none",
            duration: 2e3
          });
        }
        reject(err);
      },
      complete() {
      }
    });
  }).catch(() => {
  });
};
exports.base_url = base_url;
exports.request = request;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/request.js.map
