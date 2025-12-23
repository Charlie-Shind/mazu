"use strict";
const common_vendor = require("../../common/vendor.js");
const apis_community = require("../../apis/community.js");
const store_userInfo = require("../../store/userInfo.js");
const common_assets = require("../../common/assets.js");
const pageBack = () => "../../components/title/title.js";
const _sfc_main = {
  data() {
    return {
      titleInfo: {
        titleShow: true,
        title: "社区",
        imageUrl: "http://t73sifiwt.hn-bkt.clouddn.com/pageBack/1.webp",
        heightShow: false,
        backShow: true
      },
      pageInfo: [],
      comment: [],
      isInputFocus: false,
      pageIndex: null,
      placeholder: "善语善言结善缘,期待您的评论~",
      superior_id: null,
      // 父评论ID（二级评论传父评论id）
      comment_id: null,
      // 评论ID
      mainId: null,
      // 最顶级评论ID
      replyContent: ""
      // 输入框内容
    };
  },
  onLoad(option) {
    this.pageIndex = option.postId;
    let history = common_vendor.index.getStorageSync("history") || [];
    let index = history.indexOf(option.postId);
    if (index !== -1) {
      history.splice(index, 1);
      history.unshift(option.postId);
    } else {
      history.unshift(option.postId);
    }
    common_vendor.index.setStorageSync("history", history);
    this.getPostDetail();
    this.getCommentList();
    this.checkMyPost();
  },
  components: {
    pageBack
  },
  methods: {
    // 格式化日期（兼容null）
    formatDate(isoDate) {
      if (!isoDate)
        return "";
      const date = new Date(isoDate.replace(" ", "T"));
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    },
    // 预览图片
    previewImage(currentIndex) {
      var _a;
      const urls = ((_a = this.pageInfo[0]) == null ? void 0 : _a.imageUrl) || [];
      if (urls.length === 0)
        return;
      common_vendor.index.previewImage({
        current: urls[currentIndex],
        urls
      });
    },
    // 点击评论（回复功能）
    replyComment(item) {
      this.$nextTick(() => {
        if (!item.id)
          return;
        this.mainId = item.mainId || item.id;
        this.superior_id = item.id;
        this.comment_id = item.id;
        this.isInputFocus = true;
        this.placeholder = `回复 @${item.nickname}`;
      });
    },
    // 输入框失焦
    outFocus() {
      this.superior_id = null;
      this.comment_id = null;
      this.mainId = null;
      this.replyContent = "";
      this.isInputFocus = false;
      this.placeholder = "善语善言结善缘,期待您的评论~";
    },
    // 发送评论
    sendReply() {
      var _a;
      const replyContent = this.replyContent.trim();
      const userStore = store_userInfo.useUserInfoStore();
      const userId = (_a = userStore.$state.userInfo) == null ? void 0 : _a.id;
      const commentParams = {
        post_id: this.pageIndex,
        user_id: userId,
        reply_content: replyContent,
        superior_id: this.superior_id,
        comment_id: this.comment_id,
        mainId: this.mainId
      };
      if (!userId) {
        common_vendor.index.navigateTo({ url: "/pages/login/login" });
        return;
      }
      if (!replyContent) {
        common_vendor.index.showToast({ title: "请输入评论内容", mask: true, icon: "none" });
        return;
      }
      apis_community.addCommentsAPI(commentParams).then((res) => {
        if (res.status === 200) {
          this.getCommentList();
          this.outFocus();
          common_vendor.index.showToast({ title: "发布成功", mask: true });
        } else {
          common_vendor.index.showToast({ title: res.message || "发布失败", mask: true, icon: "error" });
        }
      }).catch((err) => {
        common_vendor.index.__f__("error", "at secondPages/communityDetail/communityDetail.vue:246", "评论发布失败：", err);
        common_vendor.index.showToast({ title: "网络异常，发布失败", mask: true, icon: "error" });
      });
    },
    // 获取帖子详情
    getPostDetail() {
      apis_community.getCommunityItemInfoAPI({ id: this.pageIndex }).then((res) => {
        if (res.message && res.message.length > 0) {
          this.pageInfo = res.message.map((item) => ({
            ...item,
            imageUrl: item.imageUrl ? JSON.parse(item.imageUrl) : []
          }));
        }
      }).catch((error) => {
        common_vendor.index.__f__("error", "at secondPages/communityDetail/communityDetail.vue:262", "获取帖子详情失败：", error);
        common_vendor.index.showToast({ title: "加载帖子失败", mask: true, icon: "error" });
      });
    },
    // 获取评论列表
    getCommentList() {
      apis_community.getCommentAPI({ id: this.pageIndex }).then((res) => {
        if (res.comments && Array.isArray(res.comments)) {
          const comments = [...res.comments];
          if (comments.length >= 2 && comments[comments.length - 1].id === comments[comments.length - 2].id) {
            this.comment = comments.slice(0, -1);
          } else {
            this.comment = comments;
          }
        } else {
          this.comment = [];
        }
      }).catch((error) => {
        common_vendor.index.__f__("error", "at secondPages/communityDetail/communityDetail.vue:283", "获取评论失败：", error);
        common_vendor.index.showToast({ title: "加载评论失败", mask: true, icon: "error" });
      });
    },
    // 检查是否为自己发布的帖子
    checkMyPost() {
      var _a;
      const userStore = store_userInfo.useUserInfoStore();
      const userId = (_a = userStore.$state.userInfo) == null ? void 0 : _a.id;
      if (!userId)
        return;
      apis_community.checkMyPostCommunityAPI({ user_id: userId, id: this.pageIndex }).then((res) => {
        common_vendor.index.__f__("log", "at secondPages/communityDetail/communityDetail.vue:295", "是否自己发布的帖子：", res);
      }).catch((error) => {
        common_vendor.index.__f__("error", "at secondPages/communityDetail/communityDetail.vue:300", "检查帖子归属失败：", error);
      });
    }
  },
  onPageScroll(e) {
    this.titleInfo.heightShow = e.scrollTop >= 80;
  }
};
if (!Array) {
  const _component_pageBack = common_vendor.resolveComponent("pageBack");
  _component_pageBack();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m;
  return common_vendor.e({
    a: common_vendor.p({
      titleInfo: $data.titleInfo
    }),
    b: $data.placeholder,
    c: $data.isInputFocus,
    d: common_vendor.o((...args) => $options.sendReply && $options.sendReply(...args)),
    e: $data.replyContent,
    f: common_vendor.o(($event) => $data.replyContent = $event.detail.value),
    g: common_vendor.o((...args) => $options.sendReply && $options.sendReply(...args)),
    h: common_vendor.t((_a = $data.pageInfo[0]) == null ? void 0 : _a.title),
    i: $data.pageInfo[0]
  }, $data.pageInfo[0] ? {
    j: (_b = $data.pageInfo[0]) == null ? void 0 : _b.avatarurl,
    k: common_vendor.t((_c = $data.pageInfo[0]) == null ? void 0 : _c.nickname),
    l: common_vendor.t($options.formatDate((_d = $data.pageInfo[0]) == null ? void 0 : _d.time))
  } : {}, {
    m: (_e = $data.pageInfo[0]) == null ? void 0 : _e.content,
    n: ((_f = $data.pageInfo[0]) == null ? void 0 : _f.imageUrl) && ((_g = $data.pageInfo[0]) == null ? void 0 : _g.imageUrl.length) > 1
  }, ((_h = $data.pageInfo[0]) == null ? void 0 : _h.imageUrl) && ((_i = $data.pageInfo[0]) == null ? void 0 : _i.imageUrl.length) > 1 ? {
    o: common_vendor.f((_j = $data.pageInfo[0]) == null ? void 0 : _j.imageUrl, (item, index, i0) => {
      return {
        a: item,
        b: common_vendor.o(($event) => $options.previewImage(index), index),
        c: index
      };
    })
  } : ((_k = $data.pageInfo[0]) == null ? void 0 : _k.imageUrl) ? {
    q: common_vendor.f((_l = $data.pageInfo[0]) == null ? void 0 : _l.imageUrl, (item, index, i0) => {
      return {
        a: item,
        b: common_vendor.o(($event) => $options.previewImage(index), index),
        c: index
      };
    })
  } : {}, {
    p: (_m = $data.pageInfo[0]) == null ? void 0 : _m.imageUrl,
    r: $data.comment.length > 0
  }, $data.comment.length > 0 ? {
    s: common_vendor.f($data.comment, (item, k0, i0) => {
      return common_vendor.e({
        a: item.avatarurl,
        b: common_vendor.t(item.nickname),
        c: common_vendor.t(item.reply_content),
        d: common_vendor.o(($event) => $options.replyComment(item), item.id),
        e: common_vendor.t($options.formatDate(item.reply_time)),
        f: item.replies && item.replies.length > 0
      }, item.replies && item.replies.length > 0 ? {
        g: common_vendor.f(item.replies, (list, k1, i1) => {
          return common_vendor.e({
            a: list.avatarurl,
            b: common_vendor.t(list.nickname),
            c: common_vendor.t(list.parent_nickname),
            d: common_vendor.t(list.reply_content),
            e: common_vendor.o(($event) => $options.replyComment(list), list.id),
            f: common_vendor.t($options.formatDate(list.reply_time)),
            g: list.replies && list.replies.length > 0
          }, list.replies && list.replies.length > 0 ? {
            h: common_vendor.f(list.replies, (third, k2, i2) => {
              return common_vendor.e({
                a: third.avatarurl,
                b: common_vendor.t(third.nickname),
                c: common_vendor.t(third.parent_nickname),
                d: common_vendor.t(third.reply_content),
                e: common_vendor.o(($event) => $options.replyComment(third), third.id),
                f: common_vendor.t($options.formatDate(third.reply_time)),
                g: third.replies && third.replies.length > 0
              }, third.replies && third.replies.length > 0 ? {
                h: common_vendor.f(third.replies, (fourth, k3, i3) => {
                  return {
                    a: fourth.avatarurl,
                    b: common_vendor.t(fourth.nickname),
                    c: common_vendor.t(fourth.parent_nickname),
                    d: common_vendor.t(fourth.reply_content),
                    e: common_vendor.o(($event) => $options.replyComment(fourth), fourth.id),
                    f: common_vendor.t($options.formatDate(fourth.reply_time)),
                    g: fourth.id
                  };
                })
              } : {}, {
                i: third.id
              });
            })
          } : {}, {
            i: list.id
          });
        })
      } : {}, {
        h: item.id
      });
    })
  } : {
    t: common_assets._imports_0$3
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-20d74254"]]);
_sfc_main.__runtimeHooks = 1;
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/secondPages/communityDetail/communityDetail.js.map
