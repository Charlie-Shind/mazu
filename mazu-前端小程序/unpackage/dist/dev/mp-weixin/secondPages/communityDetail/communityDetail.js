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
        imageUrl: "https://mazu-1320314698.cos.ap-guangzhou.myqcloud.com/pageBack/1.webp",
        heightShow: false,
        backShow: true
      },
      pageInfo: [],
      comment: [],
      value: "",
      isInputFocus: false,
      // 页面id
      pageIndex: null,
      placeholder: "善语善言结善缘,期待您的评论~",
      // 上级id
      superior_id: null,
      // 上级的评论id
      comment_id: null,
      // 最顶级评论id
      mainId: null,
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
    apis_community.getCommunityItemInfoAPI({
      id: option.postId
    }).then((res) => {
      this.pageInfo = res.message.map((item) => {
        return {
          ...item,
          imageUrl: JSON.parse(item.imageUrl)
        };
      });
    }).catch((error) => {
      common_vendor.index.__f__("error", "at secondPages/communityDetail/communityDetail.vue:150", "获取数据时出错:", error);
    });
    apis_community.getCommentAPI({
      id: option.postId
    }).then((res) => {
      this.comment = res.comments.slice(0, -1);
    });
    apis_community.checkMyPostCommunityAPI({
      user_id: store_userInfo.useUserInfoStore().$state.userInfo.id,
      id: option.postId
    }).then((res) => {
      common_vendor.index.__f__("log", "at secondPages/communityDetail/communityDetail.vue:164", res);
    });
  },
  components: {
    pageBack
  },
  methods: {
    formatDate(isoDate) {
      const date = new Date(isoDate);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    },
    previewImage(currentIndex) {
      var _a;
      const urls = ((_a = this.pageInfo[0]) == null ? void 0 : _a.imageUrl) || [];
      common_vendor.index.previewImage({
        current: urls[currentIndex],
        // 当前显示图片的http链接
        urls
        // 需要预览的图片http链接列表
      });
    },
    // 点击评论聚焦事件
    replyComment(item) {
      this.$nextTick(() => {
        if (item.mainId == null) {
          this.mainId = item.id;
        } else {
          this.mainId = item.mainId;
        }
        this.superior_id = item.user_id;
        this.comment_id = item.id;
        this.isInputFocus = true;
        this.placeholder = `回复 @${item.nickname}`;
      });
    },
    // 失焦事件
    outFocus() {
      this.superior_id = null;
      this.comment_id = null;
      this.mainId = null;
      this.replyContent = "";
      this.isInputFocus = false;
      this.placeholder = "善语善言结善缘,期待您的评论~";
    },
    // 发送  
    sendReply() {
      const replyContent = this.replyContent.trim();
      if (!store_userInfo.useUserInfoStore().$state.userInfo.id) {
        common_vendor.index.navigateTo({
          url: "/pages/login/login"
        });
        return;
      }
      if (!replyContent) {
        common_vendor.index.showToast({
          title: "请输入评论内容",
          mask: true,
          icon: "none"
        });
        return;
      }
      apis_community.addCommentsAPI({
        post_id: this.pageIndex,
        user_id: store_userInfo.useUserInfoStore().$state.userInfo.id,
        reply_content: replyContent,
        superior_id: this.superior_id,
        comment_id: this.comment_id,
        mainId: this.mainId
      }).then((res) => {
        if (res.status === 200) {
          apis_community.getCommentAPI({
            id: this.pageIndex
          }).then((res2) => {
            this.comment = res2.comments.slice(0, -1);
            common_vendor.index.showToast({
              title: "发布成功",
              mask: true
            });
          });
          this.outFocus();
        } else {
          common_vendor.index.showToast({
            title: "其他异常",
            mask: true,
            icon: "error"
          });
        }
      });
    }
  },
  onPageScroll(e) {
    if (e.scrollTop >= 80) {
      this.titleInfo.heightShow = true;
    }
    if (e.scrollTop < 80) {
      this.titleInfo.heightShow = false;
    }
  }
};
if (!Array) {
  const _component_pageBack = common_vendor.resolveComponent("pageBack");
  _component_pageBack();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i;
  return common_vendor.e({
    a: common_vendor.p({
      titleInfo: $data.titleInfo
    }),
    b: $data.placeholder,
    c: $data.isInputFocus,
    d: common_vendor.o((...args) => $options.outFocus && $options.outFocus(...args)),
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
    n: ((_f = $data.pageInfo[0]) == null ? void 0 : _f.imageUrl.length) > 1
  }, ((_g = $data.pageInfo[0]) == null ? void 0 : _g.imageUrl.length) > 1 ? {
    o: common_vendor.f((_h = $data.pageInfo[0]) == null ? void 0 : _h.imageUrl, (item, index, i0) => {
      return {
        a: item,
        b: common_vendor.o(($event) => $options.previewImage(index))
      };
    })
  } : {
    p: common_vendor.f((_i = $data.pageInfo[0]) == null ? void 0 : _i.imageUrl, (item, index, i0) => {
      return {
        a: item,
        b: common_vendor.o(($event) => $options.previewImage(index))
      };
    })
  }, {
    q: $data.comment.length > 0
  }, $data.comment.length > 0 ? {
    r: common_vendor.f($data.comment, (item, k0, i0) => {
      return common_vendor.e({
        a: item.avatarurl,
        b: common_vendor.t(item.nickname),
        c: common_vendor.t(item.reply_content),
        d: common_vendor.o(($event) => $options.replyComment(item)),
        e: common_vendor.t($options.formatDate(item.reply_time)),
        f: item.replies.length > 0
      }, item.replies.length > 0 ? {
        g: common_vendor.f(item.replies, (list, k1, i1) => {
          return {
            a: list.avatarurl,
            b: common_vendor.t(list.nickname),
            c: common_vendor.t(list.parent_nickname),
            d: common_vendor.t(list.reply_content),
            e: common_vendor.o(($event) => $options.replyComment(list)),
            f: common_vendor.t($options.formatDate(list.reply_time))
          };
        })
      } : {});
    })
  } : {
    s: common_assets._imports_0$4
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-20d74254"]]);
_sfc_main.__runtimeHooks = 1;
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/secondPages/communityDetail/communityDetail.js.map
