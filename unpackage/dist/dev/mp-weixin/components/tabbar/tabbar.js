"use strict";
const common_vendor = require("../../common/vendor.js");
const store_switchTab = require("../../store/switchTab.js");
const _sfc_main = {
  name: "tabbar",
  data() {
    return {
      tabInfo: [
        {
          id: 1,
          icon: "http://t73sifiwt.hn-bkt.clouddn.com/tabbatIcon/home.svg",
          icon_active: "http://t73sifiwt.hn-bkt.clouddn.com/tabbatIcon/home_active.svg",
          url: "/pages/index/index",
          name: "首页"
        },
        {
          id: 2,
          icon: "http://t73sifiwt.hn-bkt.clouddn.com/tabbatIcon/community.svg",
          icon_active: "http://t73sifiwt.hn-bkt.clouddn.com/tabbatIcon/community_active.svg",
          url: "/pages/community/community",
          name: "社区"
        },
        {
          id: 3,
          icon: "http://t73sifiwt.hn-bkt.clouddn.com/tabbatIcon/prays.svg",
          icon_active: "http://t73sifiwt.hn-bkt.clouddn.com/tabbatIcon/prays_active.svg",
          url: "/pages/prays/prays",
          name: "祈福"
        },
        {
          id: 4,
          icon: "http://t73sifiwt.hn-bkt.clouddn.com/tabbatIcon/shop.svg",
          icon_active: "http://t73sifiwt.hn-bkt.clouddn.com/tabbatIcon/shop_active.svg",
          url: "/pages/shop/shop",
          name: "商城"
        },
        {
          id: 5,
          icon: "http://t73sifiwt.hn-bkt.clouddn.com/tabbatIcon/mine.svg",
          icon_active: "http://t73sifiwt.hn-bkt.clouddn.com/tabbatIcon/mine_active.svg",
          url: "/pages/mine/mine",
          name: "我的"
        }
      ],
      isIos: false
    };
  },
  mounted() {
    if (common_vendor.index.getSystemInfoSync().platform == "ios" || common_vendor.index.getSystemInfoSync().platform == "devtools") {
      this.isIos = true;
    }
  },
  computed: {
    currentTab() {
      return store_switchTab.useCounterStore().$state.currentTab;
    }
  },
  methods: {
    clickTab(item) {
      store_switchTab.useCounterStore().$state.currentTab = item.id - 1;
      common_vendor.index.switchTab({
        url: item.url
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($data.tabInfo, (item, k0, i0) => {
      return {
        a: $options.currentTab === item.id - 1 ? item.icon_active : item.icon,
        b: common_vendor.t(item.name),
        c: item.id,
        d: $options.currentTab === item.id - 1 ? 1 : "",
        e: common_vendor.o(($event) => $options.clickTab(item), item.id)
      };
    }),
    b: $data.isIos ? 1 : ""
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-e9b92a61"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/tabbar/tabbar.js.map
