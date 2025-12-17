import { createStore } from "vuex";
import { removeToken } from "~/composables/auth";
import { adminGetUserInfoAPI } from "~/api/manager";

// 将用户信息存储到 localStorage  
function setUserToStorage(user) {
  localStorage.setItem('user', JSON.stringify(user));
}

// 从 localStorage 中获取用户信息  
function getUserFromStorage() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : {};
}

const store = createStore({
  state() {
    return {
      // 用户信息  
      user: getUserFromStorage(),

      // 侧边宽度  
      asideWidth: "200px",
      isCollapse: false,
      ruleNames: [],
    };
  },
  mutations: {
    // 记录用户信息  
    SET_USERINFO(state, user) {
      state.user = user;
      setUserToStorage(user);
    },
    // 展开/缩起侧边  
    handleAsideWidth(state) {
      state.isCollapse = state.isCollapse === true ? false : true;
      state.asideWidth = state.isCollapse === true ? "64px" : "200px";
    },
    SET_RULENAMES(state, ruleNames) {
      state.ruleNames = ruleNames;
    },
  },
  actions: {
    // 退出登录  
    logout({ commit }) {
      // 移除cookie里的token  
      removeToken();
      // 清除当前用户状态 vuex  
      commit("SET_USERINFO", {});
      // 从 localStorage 中移除用户信息  
      localStorage.removeItem('user');
    },
    // 获取用户信息  
    async getUserInfo({ commit }, userId) {
      try {
        const res = await adminGetUserInfoAPI(userId);
        setToken(token);
        commit("SET_RULENAMES", res.data.roles);
        commit("SET_USERINFO", res.data.message);
      } catch (error) {
        console.error("获取用户信息失败:", error);
      }
    },
  },
});

export default store;