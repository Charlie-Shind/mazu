"use strict";
const common_vendor = require("../../common/vendor.js");
const store_userInfo = require("../../store/userInfo.js");
const apis_community = require("../../apis/community.js");
const common_assets = require("../../common/assets.js");
const pageBack = () => "../../components/title/title.js";
const _sfc_main = {
  data() {
    return {
      titleInfo: {
        titleShow: true,
        title: "我的发布",
        imageUrl: "http://t73sifiwt.hn-bkt.clouddn.com/pageBack/1.webp",
        heightShow: false,
        backShow: true
      },
      postInfo: [],
      showDeleteConfirm: false,
      show: false
    };
  },
  components: {
    pageBack
  },
  // 在 created 钩子中读取本地存储的搜索历史
  // created() {
  // 	// 从本地存储中读取搜索历史  
  // 	this.history = uni.getStorageSync('history').map(Number).toString() || []
  // },
  onLoad() {
    apis_community.getMyPostCommunityAPI({
      user_id: store_userInfo.useUserInfoStore().$state.userInfo.id
    }).then((res) => {
      this.postInfo = res.data.map((item) => {
        return {
          ...item,
          imageUrl: JSON.parse(item.imageUrl),
          showMore: false
        };
      });
      this.show = true;
    });
  },
  methods: {
    // 新增的点击删除后触发的方法
    deleteItem(postId, index) {
      common_vendor.index.showModal({
        title: "提示",
        content: "是否确认删除该条内容？",
        success: (res) => {
          if (res.confirm) {
            apis_community.deletePostCommunityAPI({
              user_id: store_userInfo.useUserInfoStore().$state.userInfo.id,
              id: postId
            }).then((res2) => {
              if (res2.status == 200) {
                apis_community.getMyPostCommunityAPI({
                  user_id: store_userInfo.useUserInfoStore().$state.userInfo.id
                }).then((res3) => {
                  this.postInfo = res3.data.map((item) => {
                    return {
                      ...item,
                      imageUrl: JSON.parse(item.imageUrl),
                      showMore: false
                    };
                  });
                  this.show = true;
                });
                common_vendor.index.showToast({
                  title: "删除成功"
                });
              } else {
                common_vendor.index.showToast({
                  title: "删除失败",
                  icon: "error"
                });
              }
            });
          }
        }
      });
    },
    getHistory(ids) {
      apis_community.byIdGetCommunityAPI(ids).then((res) => {
        this.postInfo = res.data.map((item) => {
          return {
            ...item,
            imageUrl: JSON.parse(item.imageUrl),
            showMore: false
          };
        });
        this.show = true;
      });
    },
    previewImage(urls, currentIndex) {
      common_vendor.index.previewImage({
        current: urls[currentIndex],
        urls
      });
    },
    showMore(item, index) {
      this.touchNum++;
      setTimeout(() => {
        if (this.touchNum === 1) {
          common_vendor.index.navigateTo({
            url: `/secondPages/communityDetail/communityDetail?postId=${item.id}`
          });
        } else if (this.touchNum >= 2) {
          this.postInfo[index].showMore = !this.postInfo[index].showMore;
        }
        this.touchNum = 0;
      }, 250);
    },
    confirmDeleteHistory() {
      common_vendor.index.removeStorageSync("history");
      this.postInfo = [];
      common_vendor.index.showToast({
        title: "历史游览已清空",
        icon: "success"
      });
      this.showDeleteConfirm = false;
    },
    cancelDeleteHistory() {
      this.showDeleteConfirm = false;
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
  return common_vendor.e({
    a: $data.show
  }, $data.show ? common_vendor.e({
    b: common_vendor.p({
      titleInfo: $data.titleInfo
    }),
    c: $data.postInfo.length >= 1
  }, $data.postInfo.length >= 1 ? {
    d: common_vendor.f($data.postInfo, (item, index, i0) => {
      return common_vendor.e({
        a: item.avatarurl,
        b: common_vendor.t(item.nickname),
        c: common_vendor.o(($event) => $options.deleteItem(item.id, index)),
        d: item.content.length < 100
      }, item.content.length < 100 ? {
        e: item.content,
        f: common_vendor.o(($event) => $options.showMore(item, index))
      } : common_vendor.e({
        g: !item.showMore
      }, !item.showMore ? {
        h: item.content.slice(0, 50)
      } : {
        i: item.content
      }, {
        j: common_vendor.o(($event) => $options.showMore(item, index))
      }), {
        k: item.imageUrl.length > 1
      }, item.imageUrl.length > 1 ? {
        l: common_vendor.f(item.imageUrl, (imgItem, imgIndex, i1) => {
          return {
            a: imgItem,
            b: common_vendor.o(($event) => $options.previewImage(item.imageUrl, imgIndex))
          };
        })
      } : {
        m: common_vendor.f(item.imageUrl, (imgItem, imgIndex, i1) => {
          return {
            a: imgItem,
            b: common_vendor.o(($event) => $options.previewImage(item.imageUrl, imgIndex))
          };
        })
      });
    })
  } : {
    e: common_assets._imports_0$6
  }) : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-ab3aab7c"]]);
_sfc_main.__runtimeHooks = 1;
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/secondPages/myPost/myPost.js.map
