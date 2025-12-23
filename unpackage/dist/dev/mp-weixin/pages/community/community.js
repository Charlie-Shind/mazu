"use strict";
const common_vendor = require("../../common/vendor.js");
const apis_community = require("../../apis/community.js");
const common_assets = require("../../common/assets.js");
const pageBack = () => "../../components/title/title.js";
const tabBar = () => "../../components/tabbar/tabbar.js";
const IncenseFab = () => "../../components/incense-fab/incense-fab.js";
const _sfc_main = {
  data() {
    return {
      titleInfo: {
        titleShow: true,
        title: "社区",
        imageUrl: "http://t73sifiwt.hn-bkt.clouddn.com/pageBack/4.jpg",
        heightShow: false,
        height: 300
      },
      recommend: [
        {
          id: 1,
          imageUrl: "/static/shop/fu1.jpg",
          title: "妈祖百科",
          text: "妈祖文化讨论",
          people: "3843"
        },
        {
          id: 2,
          imageUrl: "/static/shop/shoulian1.jpg",
          title: "妈祖庙宇",
          text: "妈祖庙宇交流区",
          people: "121"
        },
        {
          id: 3,
          imageUrl: "/static/shop/fu1.jpg",
          title: "妈祖百科",
          text: "妈祖文化讨论",
          people: "384"
        }
      ],
      topicRecommend: [],
      list: []
    };
  },
  onLoad() {
    apis_community.getCommunityItemAPI().then((res) => {
      this.list = res.message.map((item) => {
        return {
          ...item,
          imageUrl: JSON.parse(item.imageUrl)
        };
      });
      this.refresh();
    });
    apis_community.getCommunityTopicAPI().then((res) => {
      this.topicRecommend = res.message;
    });
  },
  components: {
    pageBack,
    tabBar,
    IncenseFab
  },
  computed: {
    groupedRecommend() {
      const groups = [];
      for (let i = 0; i < this.topicRecommend.length; i += 2) {
        groups.push([this.topicRecommend[i], this.topicRecommend[i + 1]]);
      }
      return this.shuffleArray(groups);
    }
  },
  methods: {
    toPage(item) {
      common_vendor.index.navigateTo({
        url: `/secondPages/topicDetail/topicDetail?topicId=${item.id}`
      });
    },
    sortByCommentUsers(data) {
      return data.sort((a, b) => {
        return b.comment_users - a.comment_users;
      });
    },
    shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    },
    detail(item) {
      common_vendor.index.navigateTo({
        url: `/secondPages/communityDetail/communityDetail?postId=${item.id}`
      });
    },
    refresh() {
      common_vendor.index.showLoading({
        title: "刷新中...",
        mask: true
      });
      apis_community.getCommunityItemAPI().then((res) => {
        this.list = res.message.map((item) => {
          return {
            ...item,
            imageUrl: JSON.parse(item.imageUrl)
          };
        });
        common_vendor.index.showToast({
          title: "刷新成功",
          icon: "success"
        });
      }).catch(() => {
        common_vendor.index.showToast({
          title: "刷新失败",
          icon: "none"
        });
      }).finally(() => {
        common_vendor.index.hideLoading();
      });
    },
    navigatoPage(url) {
      common_vendor.index.showLoading({
        title: "加载中"
      });
      common_vendor.index.navigateTo({
        url
      }).finally(() => {
        common_vendor.index.hideLoading();
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
  const _easycom_incense_fab2 = common_vendor.resolveComponent("incense-fab");
  const _component_tabBar = common_vendor.resolveComponent("tabBar");
  (_component_pageBack + _easycom_incense_fab2 + _component_tabBar)();
}
const _easycom_incense_fab = () => "../../components/incense-fab/incense-fab.js";
if (!Math) {
  _easycom_incense_fab();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.p({
      titleInfo: $data.titleInfo
    }),
    b: common_assets._imports_0$1,
    c: common_vendor.o(($event) => $options.navigatoPage("/secondPages/search/search")),
    d: common_vendor.o(($event) => $options.navigatoPage("/secondPages/communityAdd/communityAdd")),
    e: common_vendor.f($options.groupedRecommend, (item, index, i0) => {
      return {
        a: common_vendor.f(item, (list, k1, i1) => {
          return common_vendor.e({
            a: list
          }, list ? {
            b: common_assets._imports_0$2,
            c: common_vendor.t(list.name.slice(0, 4)),
            d: common_vendor.t(list.name),
            e: common_vendor.t(list.comment_users)
          } : {}, {
            f: common_vendor.o(($event) => $options.toPage(list))
          });
        }),
        b: item.id
      };
    }),
    f: common_vendor.f($options.sortByCommentUsers($data.topicRecommend).slice(0, 4), (item, index, i0) => {
      return {
        a: `../../static/community/序号${index + 1}.svg`,
        b: common_vendor.t(item.name),
        c: common_vendor.t(item.comment_users),
        d: common_vendor.t(item.topic_length * 3),
        e: common_vendor.o(($event) => $options.toPage(item))
      };
    }),
    g: common_assets._imports_2,
    h: common_vendor.o(($event) => $options.refresh()),
    i: common_vendor.f($data.list, (item, index, i0) => {
      return {
        a: item.imageUrl[0],
        b: common_vendor.t(item.title),
        c: item.avatarurl,
        d: common_vendor.t(item.nickname),
        e: index,
        f: common_vendor.o(($event) => $options.detail(item), index)
      };
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-a6ef5318"]]);
_sfc_main.__runtimeHooks = 1;
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/community/community.js.map
