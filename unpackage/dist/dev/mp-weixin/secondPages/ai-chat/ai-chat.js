"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_request = require("../../utils/request.js");
const store_userInfo = require("../../store/userInfo.js");
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
      inputTimer: null,
      // 输入防抖定时器
      chatContentHeight: "calc(100vh - 320rpx)",
      // 聊天区域高度（避免动态计算闪烁）
      statusTimer: null,
      // 状态提示定时器
      scrollTimer: null,
      // 滚动防抖定时器
      scrollPending: false,
      // 滚动标记
      resizeTimer: null
      // 窗口调整定时器
    };
  },
  computed: {
    userAvatar() {
      var _a;
      const userInfoStore = store_userInfo.useUserInfoStore();
      const { userInfo } = common_vendor.storeToRefs(userInfoStore);
      const avatar = ((_a = userInfo.value) == null ? void 0 : _a.avatar) || common_vendor.index.getStorageSync("userAvatar") || "/static/user-avatar.png";
      return avatar;
    }
  },
  onLoad() {
    this.generateSessionId();
    this.initChatHeight();
  },
  onUnload() {
    clearTimeout(this.inputTimer);
    clearTimeout(this.statusTimer);
    clearTimeout(this.scrollTimer);
    clearTimeout(this.resizeTimer);
    this.inputTimer = null;
    this.statusTimer = null;
    this.scrollTimer = null;
    this.resizeTimer = null;
  },
  onResize() {
    clearTimeout(this.resizeTimer);
    this.resizeTimer = setTimeout(() => {
      this.initChatHeight();
    }, 100);
  },
  methods: {
    handleAvatarError(e) {
      e.target.src = "/static/default-avatar.png";
    },
    initChatHeight() {
      common_vendor.index.getSystemInfo({
        success: (res) => {
          var _a;
          const windowHeight = res.windowHeight;
          const safeBottom = ((_a = res.safeAreaInsets) == null ? void 0 : _a.bottom) || 0;
          this.chatContentHeight = `${windowHeight - 160 - safeBottom}px`;
        }
      });
    },
    generateSessionId() {
      this.sessionId = `chat_${Date.now()}_${Math.floor(Math.random() * 9999)}`;
    },
    handleScroll(e) {
      if (!this.scrollTimer) {
        this.scrollTimer = setTimeout(() => {
          this.scrollHeight = e.detail.scrollHeight;
          clearTimeout(this.scrollTimer);
          this.scrollTimer = null;
        }, 50);
      }
    },
    handleInput() {
      clearTimeout(this.inputTimer);
      clearTimeout(this.statusTimer);
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
    showAiLoading() {
      this.isLoading = true;
      this.showStatusTip = true;
      this.statusTipText = "小默正在思考...";
      const lastItem = this.chatList[this.chatList.length - 1];
      if (!lastItem || lastItem.role !== "ai-loading") {
        this.chatList.push({
          role: "ai-loading"
        });
      }
      this.scrollToBottom();
    },
    removeAiLoading() {
      this.isLoading = false;
      this.chatList = this.chatList.filter((item) => item.role !== "ai-loading");
    },
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
        this.statusTimer = setTimeout(() => {
          this.showStatusTip = false;
        }, 1500);
        this.scrollToBottom();
      } catch (error) {
        common_vendor.index.__f__("error", "at secondPages/ai-chat/ai-chat.vue:263", "AI接口调用失败：", error);
        this.removeAiLoading();
        this.chatList.push({
          role: "ai",
          content: this.getErrorMsg(error)
        });
        this.showStatusTip = true;
        this.statusTipText = "回复失败";
        this.statusTimer = setTimeout(() => {
          this.showStatusTip = false;
        }, 2e3);
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
    parseLineBreak(content) {
      if (!content)
        return "";
      return content.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/↵/g, "<br/>").replace(/\n/g, "<br/>");
    },
    scrollToBottom() {
      this.$nextTick(() => {
        if (!this.scrollPending) {
          this.scrollPending = true;
          setTimeout(() => {
            const query = common_vendor.index.createSelectorQuery().in(this);
            query.select(".chat-content").boundingClientRect((rect) => {
              if (rect) {
                this.scrollTop = rect.scrollHeight || 999999;
              }
            }).exec(() => {
              this.scrollPending = false;
            });
          }, 50);
        }
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
    c: common_vendor.o((...args) => $options.handleAvatarError && $options.handleAvatarError(...args))
  } : {}, {
    d: common_vendor.f($data.chatList, (msg, idx, i0) => {
      return common_vendor.e({
        a: msg.role === "user"
      }, msg.role === "user" ? {
        b: common_vendor.t(msg.content),
        c: common_vendor.o((...args) => $options.handleAvatarError && $options.handleAvatarError(...args), idx + msg.role)
      } : msg.role === "ai" ? {
        e: common_vendor.o((...args) => $options.handleAvatarError && $options.handleAvatarError(...args), idx + msg.role),
        f: $options.parseLineBreak(msg.content)
      } : msg.role === "ai-loading" ? {
        h: common_vendor.o((...args) => $options.handleAvatarError && $options.handleAvatarError(...args), idx + msg.role)
      } : {}, {
        d: msg.role === "ai",
        g: msg.role === "ai-loading",
        i: idx + msg.role
      });
    }),
    e: $data.scrollTop,
    f: common_vendor.o((...args) => $options.handleScroll && $options.handleScroll(...args)),
    g: $data.chatContentHeight,
    h: common_vendor.o((...args) => $options.sendMessage && $options.sendMessage(...args)),
    i: $data.isLoading,
    j: common_vendor.o([($event) => $data.inputContent = $event.detail.value, (...args) => $options.handleInput && $options.handleInput(...args)]),
    k: $data.inputContent,
    l: common_vendor.t($data.isSending ? "发送中..." : "发送"),
    m: common_vendor.o((...args) => $options.sendMessage && $options.sendMessage(...args)),
    n: !$data.inputContent.trim() || $data.isLoading,
    o: $data.showStatusTip
  }, $data.showStatusTip ? {
    p: common_vendor.t($data.statusTipText),
    q: $data.showStatusTip ? 1 : ""
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-dbdf8ed7"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/secondPages/ai-chat/ai-chat.js.map
