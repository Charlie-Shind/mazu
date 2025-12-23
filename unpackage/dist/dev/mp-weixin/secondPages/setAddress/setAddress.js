"use strict";
const common_vendor = require("../../common/vendor.js");
const apis_shop = require("../../apis/shop.js");
const store_userInfo = require("../../store/userInfo.js");
const pageBack = () => "../../components/title/title.js";
const _sfc_main = {
  data() {
    return {
      titleInfo: {
        titleShow: true,
        title: "收货地址",
        imageUrl: "http://t73sifiwt.hn-bkt.clouddn.com/pageBack/1.webp",
        heightShow: false,
        backShow: true
      },
      addList: [],
      isDefault: false,
      showDeleteConfirm: false,
      delId: null,
      delUserId: null
    };
  },
  components: {
    pageBack
  },
  onShow() {
    this.getAddress();
  },
  methods: {
    toAdd(code, id) {
      common_vendor.index.navigateTo({
        url: `/secondPages/addAddress/addAddress?pageCode=${code}&addressId=${id}`
      });
    },
    chooseItem(item) {
      common_vendor.index.$emit("addressData", item);
      common_vendor.index.navigateBack({
        delta: 1
      });
    },
    getAddress() {
      apis_shop.getAddressAPI(store_userInfo.useUserInfoStore().$state.userInfo.id).then((res) => {
        this.addList = res.message;
      });
    },
    handleSwitchChange(item) {
      const newIsDefault = !item.isDefault;
      if (newIsDefault) {
        this.addList.forEach((address) => {
          if (address.id !== item.id) {
            address.isDefault = false;
            apis_shop.editAddressAPI({
              id: address.id,
              user_id: address.user_id,
              province: address.province_id,
              city: address.city_id,
              district: address.district_id,
              remark: address.remark,
              name: address.name,
              mobile: address.mobile,
              isDefault: false
              // 将其他地址设置为非默认
            });
          }
        });
      }
      apis_shop.editAddressAPI({
        id: item.id,
        user_id: item.user_id,
        province: item.province_id,
        city: item.city_id,
        district: item.district_id,
        remark: item.remark,
        name: item.name,
        mobile: item.mobile,
        isDefault: newIsDefault
        // 传递新的 isDefault 值
      }).then((res) => {
        common_vendor.index.__f__("log", "at secondPages/setAddress/setAddress.vue:141", "地址修改成功:", res);
        common_vendor.index.$emit("addressData", item);
        common_vendor.index.navigateBack({
          delta: 1
        });
        item.isDefault = newIsDefault;
      }).catch((error) => {
        common_vendor.index.__f__("error", "at secondPages/setAddress/setAddress.vue:149", "地址修改失败:", error);
      });
    },
    del(id, userId) {
      this.showDeleteConfirm = true;
      this.delId = id;
      this.delUserId = userId;
    },
    confirmDeleteHistory() {
      this.showDeleteConfirm = false;
      apis_shop.delAddressAPI({
        id: this.delId,
        user_id: this.delUserId
      }).then((res) => {
        if (res.status == 200) {
          this.getAddress();
          common_vendor.index.showToast({
            title: "删除成功"
          });
        } else {
          common_vendor.index.showToast({
            title: "删除失败" + res.message,
            icon: "none"
          });
        }
      });
    },
    cancelDeleteHistory() {
      this.showDeleteConfirm = false;
    }
  }
};
if (!Array) {
  const _component_pageBack = common_vendor.resolveComponent("pageBack");
  _component_pageBack();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.addList
  }, $data.addList ? common_vendor.e({
    b: common_vendor.p({
      titleInfo: $data.titleInfo
    }),
    c: common_vendor.f($data.addList, (item, k0, i0) => {
      return {
        a: common_vendor.t(item.name),
        b: common_vendor.t(item.mobile),
        c: common_vendor.o(($event) => $options.chooseItem(item)),
        d: common_vendor.t(item.province_id),
        e: common_vendor.t(item.city_id),
        f: common_vendor.t(item.district_id),
        g: common_vendor.t(item.remark),
        h: common_vendor.o(($event) => $options.chooseItem(item)),
        i: item.isDefault,
        j: common_vendor.o(($event) => $options.handleSwitchChange(item)),
        k: common_vendor.o(($event) => $options.toAdd(2, item.id)),
        l: common_vendor.o(($event) => $options.del(item.id, item.user_id))
      };
    }),
    d: common_vendor.o(($event) => $options.toAdd(1)),
    e: $data.showDeleteConfirm
  }, $data.showDeleteConfirm ? {
    f: common_vendor.o((...args) => $options.confirmDeleteHistory && $options.confirmDeleteHistory(...args)),
    g: common_vendor.o((...args) => $options.cancelDeleteHistory && $options.cancelDeleteHistory(...args))
  } : {}) : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-989495d0"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/secondPages/setAddress/setAddress.js.map
