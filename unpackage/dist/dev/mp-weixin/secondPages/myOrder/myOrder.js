"use strict";
const common_vendor = require("../../common/vendor.js");
require("../../store/userInfo.js");
const apis_shop = require("../../apis/shop.js");
const common_assets = require("../../common/assets.js");
const pageBack = () => "../../components/title/title.js";
const _sfc_main = {
  data() {
    return {
      titleInfo: {
        titleShow: true,
        title: "我的订单",
        imageUrl: "http://t73sifiwt.hn-bkt.clouddn.com/pageBack/1.webp",
        heightShow: false,
        backShow: true
      },
      selectBar: [
        {
          id: 1,
          name: "全部",
          type: null
        },
        {
          id: 2,
          name: "待付款",
          type: 10
        },
        {
          id: 3,
          name: "待收货",
          type: 20
        },
        {
          id: 4,
          name: "已完成",
          type: 40
        },
        {
          id: 5,
          name: "已取消",
          type: 0
        }
      ],
      selectIndex: 0,
      // 初始选中第一个,
      orderList: [],
      show: false,
      content: "hello",
      msgType: "success",
      type: "info",
      orderItem: [],
      orderStatus: null
    };
  },
  components: {
    pageBack
  },
  onShow() {
    this.getShopOrder(null);
  },
  methods: {
    selectItem(index, item) {
      if (this.selectIndex === index)
        return;
      this.selectIndex = index;
      this.getShopOrder(item.type);
    },
    getShopOrder(params) {
      apis_shop.getShopOrderAPI(params).then((res) => {
        this.orderList = res.message.map((item) => {
          return {
            ...item,
            imageUrl: JSON.parse(item.imageUrl)
          };
        });
        this.show = true;
      });
    },
    getStatusColor(status) {
      switch (status) {
        case 10:
          return "red";
        case 20:
        case 30:
          return "green";
        case 40:
          return "black";
        case 0:
          return "gray";
        default:
          return "black";
      }
    },
    getStatusText(status) {
      switch (status) {
        case 10:
          return "待付款";
        case 20:
        case 30:
          return "待收货";
        case 40:
          return "已完成";
        case 0:
          return "已取消";
        default:
          return "未知";
      }
    },
    handClick(item, status) {
      this.orderItem = item;
      this.orderStatus = status;
      switch (status) {
        case 0:
          this.$refs.popup.open();
          this.content = "是否取消该订单";
          this.type = "info";
          break;
        case 40:
          this.$refs.popup.open();
          this.content = "是否确认收货";
          this.type = "success";
          break;
        case "delete":
          this.$refs.popup.open();
          this.content = "是否确认删除该订单";
          this.type = "warn";
          break;
        case "check":
          common_vendor.index.navigateTo({
            url: `/secondPages/orderDetail/orderDetail?id=${item.order_id}`
          });
      }
    },
    // 取消
    dialogClose() {
      this.$refs.popup.close();
    },
    // 确认  
    confirmDeleteImage() {
      this.$refs.popup.close();
      this.judgeFunction(this.orderItem, this.orderStatus);
    },
    // 各类接口调用  
    judgeFunction(item, status) {
      if (status == 0 || status == 40) {
        apis_shop.editOrderAPI({
          editCode: status,
          id: item.order_id,
          order_no: item.order_no
        }).then((res) => {
          common_vendor.index.showToast({
            title: res.message
          });
          this.getShopOrder(null);
        });
      }
      if (status == "delete") {
        apis_shop.deleteShopOrderAPI({
          id: item.order_id,
          user_id: item.user_id,
          order_no: item.order_no
        }).then((res) => {
          common_vendor.index.showToast({
            title: "删除成功"
          });
          this.getShopOrder(null);
        });
      }
    },
    // 再次购买
    againBuy(shopId) {
      common_vendor.index.navigateTo({
        url: `/secondPages/shopDetail/shopDetail?shopId=${shopId}`
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
  const _easycom_uni_popup_dialog2 = common_vendor.resolveComponent("uni-popup-dialog");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  (_component_pageBack + _easycom_uni_popup_dialog2 + _easycom_uni_popup2)();
}
const _easycom_uni_popup_dialog = () => "../../uni_modules/uni-popup/components/uni-popup-dialog/uni-popup-dialog.js";
const _easycom_uni_popup = () => "../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
if (!Math) {
  (_easycom_uni_popup_dialog + _easycom_uni_popup)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.show
  }, $data.show ? common_vendor.e({
    b: common_vendor.p({
      titleInfo: $data.titleInfo
    }),
    c: common_vendor.f($data.selectBar, (item, index, i0) => {
      return {
        a: common_vendor.t(item.name),
        b: item.id,
        c: common_vendor.o(($event) => $options.selectItem(index, item), item.id),
        d: $data.selectIndex === index ? 1 : ""
      };
    }),
    d: $data.orderList.length > 0
  }, $data.orderList.length > 0 ? {
    e: common_vendor.f($data.orderList, (item, k0, i0) => {
      return common_vendor.e({
        a: common_vendor.t($options.getStatusText(item.order_status)),
        b: $options.getStatusColor(item.order_status),
        c: item.imageUrl[0],
        d: common_vendor.t(item == null ? void 0 : item.shopname),
        e: common_vendor.t(item == null ? void 0 : item.grid),
        f: common_vendor.t(item == null ? void 0 : item.shopInfo),
        g: common_vendor.t(item == null ? void 0 : item.payment),
        h: item.order_status === 0
      }, item.order_status === 0 ? {
        i: common_vendor.o(($event) => $options.handClick(item, "delete"))
      } : {}, {
        j: item.order_status === 0 || item.order_status === 10
      }, item.order_status === 0 || item.order_status === 10 ? {
        k: common_vendor.o(($event) => $options.handClick(item, "check"))
      } : {}, {
        l: item.order_status === 10
      }, item.order_status === 10 ? {
        m: common_vendor.o(($event) => $options.handClick(item, 0))
      } : {}, {
        n: item.order_status === 10
      }, item.order_status === 10 ? {} : {}, {
        o: item.order_status === 20 || item.order_status === 30
      }, item.order_status === 20 || item.order_status === 30 ? {
        p: common_vendor.o(($event) => $options.handClick(item, "check"))
      } : {}, {
        q: item.order_status === 20 || item.order_status === 30
      }, item.order_status === 20 || item.order_status === 30 ? {
        r: common_vendor.o(($event) => $options.handClick(item, 40))
      } : {}, {
        s: item.order_status === 40
      }, item.order_status === 40 ? {
        t: common_vendor.o(($event) => $options.handClick(item, "delete"))
      } : {}, {
        v: item.order_status === 40
      }, item.order_status === 40 ? {
        w: common_vendor.o(($event) => $options.handClick(item, "check"))
      } : {}, {
        x: item.order_status === 40
      }, item.order_status === 40 ? {
        y: common_vendor.o(($event) => $options.againBuy(item.id))
      } : {});
    }),
    f: common_assets._imports_0$2
  } : {
    g: common_assets._imports_1$1
  }) : {}, {
    h: common_vendor.o($options.confirmDeleteImage),
    i: common_vendor.o($options.dialogClose),
    j: common_vendor.p({
      type: $data.type,
      cancelText: "取消",
      confirmText: "确定",
      title: "提示",
      content: $data.content
    }),
    k: common_vendor.sr("popup", "97867ff4-1"),
    l: common_vendor.p({
      type: "dialog"
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-97867ff4"]]);
_sfc_main.__runtimeHooks = 1;
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/secondPages/myOrder/myOrder.js.map
