import axios from "axios";
import { successToast, errorToast } from "~/composables/util";
import { getToken } from "~/composables/auth";
import store from "./store";
import { ElLoading } from "element-plus";
import baseUrl from "~/baseUrl";

const service = axios.create({
  baseURL: baseUrl,
  timeout: 5000,
  headers: { "X-Custom-Header": "foobar" },
});

let loadingInstance; // 用于存储加载实例

// 添加请求拦截器
service.interceptors.request.use(function (config) {
  // 往header头自动添加token
  const token = getToken();
  if (token) {
    config.headers["Authorization"] = `${token}`;
  }
  // 显示加载效果
  loadingInstance = ElLoading.service({
    lock: true,
    text: "Loading...",
    background: "rgba(255, 255, 255, 0.7)",
  });
  return config;
}, function (error) {
  // 对请求错误做些什么
  if (loadingInstance) loadingInstance.close();
  return Promise.reject(error);
});

// 添加响应拦截器
service.interceptors.response.use(
  function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    // 检查 response.data 中的 status 字段
    if (response.data.status === 501) {
      Promise.reject(new Error("非法token,请先登录！"));
      errorToast("非法token,请先登录！");
      setTimeout(() => {
        store.dispatch("logout").finally(() => location.reload());
      }, 2000);
    }
    // 关闭加载效果
    if (loadingInstance) loadingInstance.close();
    return response;
  },
  function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    console.error("响应错误:", error);
    // errorToast('响应错误:', error)
    // 关闭加载效果
    if (loadingInstance) loadingInstance.close();
    return Promise.reject(error);
  }
);

export default service;