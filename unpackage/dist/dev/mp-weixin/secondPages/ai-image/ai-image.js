"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_request = require("../../utils/request.js");
const store_userInfo = require("../../store/userInfo.js");
const common_assets = require("../../common/assets.js");
const pageBack = () => "../../components/title/title.js";
const _sfc_main = {
  components: {
    pageBack
  },
  name: "AiChatPage",
  data() {
    return {
      titleInfo: {
        titleShow: true,
        title: "妈祖AI助手-小默",
        imageUrl: "http://t73sifiwt.hn-bkt.clouddn.com/pageBack/1.webp",
        heightShow: false,
        backShow: true
      },
      inputContent: "",
      chatList: [],
      scrollTop: 0,
      sessionId: "",
      isLoading: false,
      scrollHeight: 0
      // 记录滚动容器高度
    };
  },
  computed: {
    // 计算属性：获取用户头像，无则返回默认值
    userAvatar() {
      const userInfoStore = store_userInfo.useUserInfoStore();
      const { userInfo } = common_vendor.storeToRefs(userInfoStore);
      const avatar = userInfo.value.avatar || common_vendor.index.getStorageSync("userAvatar") || "/static/user-avatar.png";
      return avatar;
    }
  },
  onLoad() {
    this.generateSessionId();
  },
  methods: {
    // 生成会话ID
    generateSessionId() {
      this.sessionId = `chat_${Date.now()}_${Math.floor(Math.random() * 9999)}`;
    },
    // 处理滚动事件（记录滚动高度）
    handleScroll(e) {
      this.scrollHeight = e.detail.scrollHeight;
    },
    // 发送消息
    sendMessage() {
      const content = this.inputContent.trim();
      if (!content || this.isLoading)
        return;
      this.chatList.push({
        role: "user",
        content
      });
      this.inputContent = "";
      this.scrollToBottom();
      this.isLoading = true;
      this.getAiReply(content);
    },
    // 调用AI接口
    async getAiReply(question) {
      var _a;
      try {
        const res = await utils_request.request({
          url: "/user/user/chat",
          method: "POST",
          data: {
            message: question,
            sessionId: this.sessionId,
            tenantId: common_vendor.index.getStorageSync("tenantId") || "xxx"
          },
          useAiUrl: true,
          timeout: 2e4
        });
        const aiReply = (res == null ? void 0 : res.reply) || ((_a = res == null ? void 0 : res.data) == null ? void 0 : _a.reply) || "抱歉，我暂时无法回答这个问题";
        this.chatList.push({
          role: "ai",
          content: aiReply
        });
      } catch (error) {
        common_vendor.index.__f__("error", "at secondPages/ai-image/ai-image.vue:139", "AI接口调用失败：", error);
        this.chatList.push({
          role: "ai",
          content: this.getErrorMsg(error)
        });
      } finally {
        this.isLoading = false;
        this.scrollToBottom();
      }
    },
    // 错误提示（更友好的文案）
    getErrorMsg(error) {
      var _a, _b;
      if ((_a = error.errMsg) == null ? void 0 : _a.includes("timeout"))
        return "请求超时啦😥，请检查网络后重试～";
      if ((_b = error.errMsg) == null ? void 0 : _b.includes("request:fail"))
        return "网络开小差了📶，请检查网络连接～";
      if (error.statusCode === 401)
        return "权限不足🚫，请重新登录～";
      if (error.statusCode === 404)
        return "接口未找到🔍，请联系管理员～";
      if (error.statusCode === 500)
        return "服务器开小差了💻，请稍后再试～";
      return "抱歉😞，暂时无法回答你的问题～";
    },
    // 解析换行符（适配↵和\n，防XSS）
    parseLineBreak(content) {
      if (!content)
        return "";
      return content.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/↵/g, "<br/>").replace(/\n/g, "<br/>");
    },
    // 滚动到底部（优化稳定性）
    scrollToBottom() {
      this.$nextTick(() => {
        setTimeout(() => {
          this.scrollTop = this.scrollHeight || 999999;
        }, 100);
      });
    }
  }
};
if (!Array) {
  const _component_pageBack = common_vendor.resolveComponent("pageBack");
  _component_pageBack();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.p({
      titleInfo: $data.titleInfo
    }),
    b: $data.chatList.length === 0
  }, $data.chatList.length === 0 ? {
    c: common_assets._imports_0$2
  } : {}, {
    d: common_vendor.f($data.chatList, (msg, idx, i0) => {
      return common_vendor.e({
        a: msg.role === "user"
      }, msg.role === "user" ? {
        b: common_vendor.t(msg.content),
        c: $options.userAvatar
      } : {
        d: common_assets._imports_0$2,
        e: $options.parseLineBreak(msg.content)
      }, {
        f: idx
      });
    }),
    e: $data.scrollTop,
    f: common_vendor.o((...args) => $options.handleScroll && $options.handleScroll(...args)),
    g: common_vendor.o((...args) => $options.sendMessage && $options.sendMessage(...args)),
    h: $data.isLoading,
    i: $data.inputContent,
    j: common_vendor.o(($event) => $data.inputContent = $event.detail.value),
    k: common_vendor.o((...args) => $options.sendMessage && $options.sendMessage(...args)),
    l: !$data.inputContent.trim() || $data.isLoading
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-19990280"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/secondPages/ai-image/ai-image.js.map
