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
      // AI加载状态
      isSending: false,
      // 用户发送状态
      scrollHeight: 0,
      showStatusTip: false,
      // 是否显示状态提示
      statusTipText: "",
      // 状态提示文本
      inputTimer: null
      // 输入防抖定时器
    };
  },
  computed: {
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
  onUnload() {
    if (this.inputTimer)
      clearTimeout(this.inputTimer);
  },
  methods: {
    // 生成会话ID
    generateSessionId() {
      this.sessionId = `chat_${Date.now()}_${Math.floor(Math.random() * 9999)}`;
    },
    // 处理滚动事件
    handleScroll(e) {
      this.scrollHeight = e.detail.scrollHeight;
    },
    // 处理输入事件（模拟用户正在输入状态）
    handleInput() {
      if (this.inputTimer)
        clearTimeout(this.inputTimer);
      if (this.inputContent.trim()) {
        this.showStatusTip = true;
        this.statusTipText = "你正在输入...";
        this.inputTimer = setTimeout(() => {
          this.showStatusTip = false;
        }, 2e3);
      } else {
        this.showStatusTip = false;
      }
    },
    // 发送消息
    sendMessage() {
      const content = this.inputContent.trim();
      if (!content || this.isLoading || this.isSending)
        return;
      this.isSending = true;
      this.showStatusTip = true;
      this.statusTipText = "正在发送消息...";
      this.chatList.push({
        role: "user",
        content
      });
      this.inputContent = "";
      this.scrollToBottom();
      setTimeout(() => {
        this.isSending = false;
        this.showAiLoading();
        this.getAiReply(content);
      }, 300);
    },
    // 显示AI加载状态
    showAiLoading() {
      this.isLoading = true;
      this.showStatusTip = true;
      this.statusTipText = "小默正在思考...";
      this.chatList.push({
        role: "ai-loading"
      });
      this.scrollToBottom();
    },
    // 移除AI加载状态
    removeAiLoading() {
      this.isLoading = false;
      this.showStatusTip = false;
      this.chatList = this.chatList.filter((item) => item.role !== "ai-loading");
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
        this.removeAiLoading();
        const aiReply = (res == null ? void 0 : res.reply) || ((_a = res == null ? void 0 : res.data) == null ? void 0 : _a.reply) || "抱歉，我暂时无法回答这个问题";
        this.chatList.push({
          role: "ai",
          content: aiReply
        });
        this.showStatusTip = true;
        this.statusTipText = "小默已回复";
        setTimeout(() => {
          this.showStatusTip = false;
        }, 1500);
      } catch (error) {
        common_vendor.index.__f__("error", "at secondPages/ai-chat/ai-chat.vue:222", "AI接口调用失败：", error);
        this.removeAiLoading();
        this.chatList.push({
          role: "ai",
          content: this.getErrorMsg(error)
        });
        this.showStatusTip = true;
        this.statusTipText = "回复失败";
        setTimeout(() => {
          this.showStatusTip = false;
        }, 2e3);
      } finally {
        this.scrollToBottom();
      }
    },
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
    // 解析换行符
    parseLineBreak(content) {
      if (!content)
        return "";
      return content.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/↵/g, "<br/>").replace(/\n/g, "<br/>");
    },
    // 滚动到底部
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
    b: $data.chatList.length === 0 && !$data.isLoading
  }, $data.chatList.length === 0 && !$data.isLoading ? {
    c: common_assets._imports_0$2
  } : {}, {
    d: common_vendor.f($data.chatList, (msg, idx, i0) => {
      return common_vendor.e({
        a: msg.role === "user"
      }, msg.role === "user" ? {
        b: common_vendor.t(msg.content),
        c: common_assets._imports_0$2
      } : msg.role === "ai" ? {
        e: common_assets._imports_0$2,
        f: $options.parseLineBreak(msg.content)
      } : msg.role === "ai-loading" ? {
        h: common_assets._imports_0$2
      } : {}, {
        d: msg.role === "ai",
        g: msg.role === "ai-loading",
        i: idx
      });
    }),
    e: $data.scrollTop,
    f: common_vendor.o((...args) => $options.handleScroll && $options.handleScroll(...args)),
    g: common_vendor.o((...args) => $options.sendMessage && $options.sendMessage(...args)),
    h: $data.isLoading,
    i: common_vendor.o([($event) => $data.inputContent = $event.detail.value, (...args) => $options.handleInput && $options.handleInput(...args)]),
    j: $data.inputContent,
    k: common_vendor.t($data.isSending ? "发送中..." : "发送"),
    l: common_vendor.o((...args) => $options.sendMessage && $options.sendMessage(...args)),
    m: !$data.inputContent.trim() || $data.isLoading,
    n: $data.showStatusTip
  }, $data.showStatusTip ? {
    o: common_vendor.t($data.statusTipText)
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-dbdf8ed7"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/secondPages/ai-chat/ai-chat.js.map
