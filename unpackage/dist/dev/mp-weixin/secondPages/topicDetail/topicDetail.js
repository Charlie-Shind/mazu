"use strict";
const common_vendor = require("../../common/vendor.js");
const apis_community = require("../../apis/community.js");
const pageBack = () => "../../components/title/title.js";
const _sfc_main = {
  data() {
    return {
      titleInfo: {
        titleShow: true,
        title: "话题",
        imageUrl: "http://t73sifiwt.hn-bkt.clouddn.com/pageBack/1.webp",
        heightShow: false,
        backShow: true
      },
      topicInfo: {},
      postInfo: [],
      isShowingFullText: false,
      tabList: [
        {
          id: 1,
          name: "默认"
        },
        {
          id: 2,
          name: "最新发布"
        },
        {
          id: 3,
          name: "热门发布"
        }
      ],
      tabCurrent: 0,
      touchNum: 0
    };
  },
  components: {
    pageBack
  },
  onLoad(option) {
    apis_community.getTopicInfoAPI({
      id: option.topicId
    }).then((res) => {
      this.topicInfo = res.message.topic;
      this.postInfo = res.message.postAndUser.map((item) => {
        return {
          ...item,
          imageUrl: JSON.parse(item.imageUrl),
          showMore: false
        };
      });
    });
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
    showFullText() {
      this.isShowingFullText = !this.isShowingFullText;
    },
    chooseType(id, index) {
      this.tabCurrent = index;
      common_vendor.index.showLoading({
        title: "加载中"
      });
      setTimeout(() => {
        if (id === 1) {
          this.postInfo.sort(() => Math.random() - 0.5);
        } else if (id === 2) {
          this.postInfo.sort((a, b) => new Date(b.time) - new Date(a.time));
        } else if (id === 3) {
          this.postInfo.sort((a, b) => b.comment_count - a.comment_count);
        }
        common_vendor.index.hideLoading();
      }, 500);
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
            url: `/secondPages/communityDetail/communityDetail?postId=${item.post_id}`
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
  var _a, _b, _c, _d;
  return common_vendor.e({
    a: common_vendor.p({
      titleInfo: $data.titleInfo
    }),
    b: (_a = $data.topicInfo) == null ? void 0 : _a.cover,
    c: common_vendor.t((_b = $data.topicInfo) == null ? void 0 : _b.name),
    d: common_vendor.t((_c = $data.postInfo) == null ? void 0 : _c.length),
    e: common_vendor.t((_d = $data.topicInfo) == null ? void 0 : _d.comment_count),
    f: !$data.isShowingFullText
  }, !$data.isShowingFullText ? {
    g: common_vendor.t($data.topicInfo.description.slice(0, 30))
  } : {
    h: common_vendor.t($data.topicInfo.description)
  }, {
    i: common_vendor.o((...args) => $options.showFullText && $options.showFullText(...args)),
    j: common_vendor.f($data.tabList, (item, index, i0) => {
      return {
        a: common_vendor.t(item.name),
        b: $data.tabCurrent === index ? 1 : "",
        c: common_vendor.o(($event) => $options.chooseType(item.id, index))
      };
    }),
    k: common_vendor.f($data.postInfo, (item, index, i0) => {
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
        h: item.content
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
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-1b35aa71"]]);
_sfc_main.__runtimeHooks = 1;
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/secondPages/topicDetail/topicDetail.js.map
