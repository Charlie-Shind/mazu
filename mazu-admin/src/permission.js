import { router } from "~/router";  // 引入路由实例
import { getToken } from "~/composables/auth";  // 引入获取 token 的方法
import { successToast, showFullLoading, hideFullLoading } from "~/composables/util";  // 引入工具函数
import store from "./store";  // 引入 Vuex store

// 全局前置守卫
router.beforeEach((to, from, next) => {
    // 显示 loading
    showFullLoading();

    const token = getToken();  // 获取 token

    // 没有登录，强制跳转回登录页
    if (!token && to.path !== "/login") {
        successToast("请先登录", "error");
        return next({ path: "/login" });
    }

    // 防止重复登录
    if (token && to.path === "/login") {
        successToast("请勿重复登录", "error");
        return next({ path: from.path ? from.path : "/" });
    }

    // 设置页面标题
    const title = (to.meta.title ? to.meta.title : "福泽海韵管理后台");
    document.title = title;

    next();  // 继续导航
});

// 全局后置守卫
router.afterEach(() => hideFullLoading());  // 隐藏 loading
