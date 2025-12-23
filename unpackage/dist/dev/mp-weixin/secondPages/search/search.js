"use strict";
const common_vendor = require("../../common/vendor.js");
const apis_community = require("../../apis/community.js");
const common_assets = require("../../common/assets.js");
const pageBack = () => "../../components/title/title.js";
const _sfc_main = {
  data() {
    return {
      titleInfo: {
        titleShow: true,
        title: "搜索",
        imageUrl: "http://t73sifiwt.hn-bkt.clouddn.com/pageBack/1.webp",
        heightShow: false,
        backShow: true
      },
      searchHistory: [],
      postInfo: [],
      contentShow: false,
      judgeContent: false,
      searchHistoryKey: "searchHistory",
      searchText: "",
      showDeleteConfirm: false,
      touchNum: 0
    };
  },
  // 在 created 钩子中读取本地存储的搜索历史
  created() {
    this.searchHistory = common_vendor.index.getStorageSync(this.searchHistoryKey) || [];
  },
  components: {
    pageBack
  },
  onPageScroll(e) {
    if (e.scrollTop >= 80) {
      this.titleInfo.heightShow = true;
    }
    if (e.scrollTop < 80) {
      this.titleInfo.heightShow = false;
    }
  },
  methods: {
    inputSearch(e) {
      if (e.detail.value.trim() === "") {
        return common_vendor.index.showToast({
          title: "内容不得为空",
          icon: "none"
        });
      }
      if (!this.searchHistory.includes(e.detail.value)) {
        this.searchHistory.unshift(e.detail.value);
        common_vendor.index.setStorageSync(this.searchHistoryKey, this.searchHistory);
      }
      this.contentShow = true;
      common_vendor.index.showLoading({
        title: "搜索中"
      });
      apis_community.searchCommunityAPI({
        content: e.detail.value
      }).then((res) => {
        if (res.message.length > 0) {
          this.judgeContent = true;
        }
        this.postInfo = res.message.map((item) => {
          return {
            ...item,
            imageUrl: JSON.parse(item.imageUrl)
          };
        });
      }).finally(() => {
        common_vendor.index.hideLoading();
      });
    },
    postHistory(item) {
      this.searchText = item;
      this.inputSearch({
        detail: {
          value: item
        }
      });
    },
    delHistory() {
      this.showDeleteConfirm = true;
    },
    confirmDeleteHistory() {
      this.searchHistory = [];
      common_vendor.index.setStorageSync(this.searchHistoryKey, this.searchHistory);
      this.showDeleteConfirm = false;
    },
    cancelDeleteHistory() {
      this.showDeleteConfirm = false;
    },
    // 点击图片放大
    previewImage(urls, currentIndex) {
      common_vendor.index.previewImage({
        current: urls[currentIndex],
        urls
      });
    },
    // 展开/进入
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
    b: common_vendor.o((...args) => $options.inputSearch && $options.inputSearch(...args)),
    c: $data.searchText,
    d: common_vendor.o(($event) => $data.searchText = $event.detail.value),
    e: common_assets._imports_0$1,
    f: !$data.contentShow
  }, !$data.contentShow ? common_vendor.e({
    g: $data.searchHistory.length > 0
  }, $data.searchHistory.length > 0 ? {
    h: common_vendor.o((...args) => $options.delHistory && $options.delHistory(...args))
  } : {}, {
    i: common_vendor.f($data.searchHistory.slice(0, 9), (item, k0, i0) => {
      return common_vendor.e({
        a: item.length > 5
      }, item.length > 5 ? {
        b: common_vendor.t(item.slice(0, 5))
      } : {
        c: common_vendor.t(item)
      }, {
        d: common_vendor.o(($event) => $options.postHistory(item))
      });
    })
  }) : {
    j: common_assets._imports_1,
    k: !$data.judgeContent,
    l: common_vendor.f($data.postInfo, (item, index, i0) => {
      return common_vendor.e({
        a: item.avatarurl,
        b: common_vendor.t(item.nickname),
        c: item.content.length < 100
      }, item.content.length < 100 ? {
        d: item.content,
        e: common_vendor.o(($event) => $options.showMore(item, index))
      } : common_vendor.e({
        f: !item.showMore
      }, !item.showMore ? {
        g: item.content.slice(0, 50)
      } : {
        h: common_vendor.t(item.content)
      }, {
        i: common_vendor.o(($event) => $options.showMore(item, index))
      }), {
        j: item.imageUrl.length > 1
      }, item.imageUrl.length > 1 ? {
        k: common_vendor.f(item.imageUrl, (imgItem, imgIndex, i1) => {
          return {
            a: imgItem,
            b: common_vendor.o(($event) => $options.previewImage(item.imageUrl, imgIndex))
          };
        })
      } : {
        l: common_vendor.f(item.imageUrl, (imgItem, imgIndex, i1) => {
          return {
            a: imgItem,
            b: common_vendor.o(($event) => $options.previewImage(item.imageUrl, imgIndex))
          };
        })
      });
    })
  }, {
    m: $data.showDeleteConfirm
  }, $data.showDeleteConfirm ? {
    n: common_vendor.o((...args) => $options.confirmDeleteHistory && $options.confirmDeleteHistory(...args)),
    o: common_vendor.o((...args) => $options.cancelDeleteHistory && $options.cancelDeleteHistory(...args))
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-6a2bbde2"]]);
_sfc_main.__runtimeHooks = 1;
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/secondPages/search/search.js.map
