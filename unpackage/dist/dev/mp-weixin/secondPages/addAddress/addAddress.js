"use strict";
const common_vendor = require("../../common/vendor.js");
const apis_shop = require("../../apis/shop.js");
const store_userInfo = require("../../store/userInfo.js");
const pageBack = () => "../../components/title/title.js";
const cityPicker = () => "../../uni_modules/piaoyi-cityPicker/components/piaoyi-cityPicker/piaoyi-cityPicker.js";
const _sfc_main = {
  data() {
    return {
      titleInfo: {
        titleShow: true,
        title: "新增地址",
        imageUrl: "http://t73sifiwt.hn-bkt.clouddn.com/pageBack/1.webp",
        heightShow: false,
        backShow: true
      },
      addList: [],
      isDefault: false,
      visible: false,
      maskCloseAble: true,
      // 地址字符串  
      str: "请选择地址",
      // 省  
      provinceName: null,
      // 市  
      city: null,
      // 区  
      district: null,
      defaultValue: "",
      column: 3,
      isDefault: false,
      name: null,
      phone: null,
      address: null,
      addressId: null
    };
  },
  components: {
    pageBack,
    cityPicker
  },
  onLoad(option) {
    if (option.pageCode == 2 && option.addressId) {
      this.titleInfo.title = "修改地址";
      this.addressId = option.addressId;
      apis_shop.getIdAddressAPI(option.addressId).then((res) => {
        this.name = res.message[0].name;
        this.address = res.message[0].remark;
        this.phone = res.message[0].mobile;
        this.isDefault = res.message[0].isDefault;
        this.provinceName = res.message[0].province_id;
        this.city = res.message[0].city_id;
        this.district = res.message[0].district_id;
        this.str = `${res.message[0].province_id}-${res.message[0].city_id}-${res.message[0].district_id}`;
      });
    }
    this.getRegions();
  },
  methods: {
    open() {
      this.visible = true;
    },
    confirm(val) {
      this.str = `${val.provinceName}-${val.cityName}-${val.areaName}`;
      this.provinceName = val.provinceName;
      this.city = val.cityName;
      this.district = val.areaName;
      this.visible = false;
    },
    cancel() {
      this.visible = false;
    },
    // 提交  
    save() {
      if (!this.name || !this.phone || !this.address || !this.provinceName || !this.city || !this.district) {
        common_vendor.index.showToast({
          title: "请填写完整的地址信息",
          icon: "none"
        });
        return;
      }
      if (this.addressId == null) {
        apis_shop.addAddressAPI({
          user_id: store_userInfo.useUserInfoStore().$state.userInfo.id,
          province: this.provinceName,
          city: this.city,
          district: this.district,
          remark: this.address,
          name: this.name,
          mobile: this.phone,
          isDefault: this.isDefault
        }).then((res) => {
          this.message(res);
        });
      } else {
        apis_shop.editAddressAPI({
          id: this.addressId,
          user_id: store_userInfo.useUserInfoStore().$state.userInfo.id,
          province: this.provinceName,
          city: this.city,
          district: this.district,
          remark: this.address,
          name: this.name,
          mobile: this.phone,
          isDefault: this.isDefault
        }).then((res) => {
          this.message(res);
        });
      }
    },
    message(res) {
      if (res.status == 200) {
        common_vendor.index.navigateBack({
          delta: 1
        });
        common_vendor.index.showToast({
          title: "保存成功"
        });
      } else {
        common_vendor.index.showToast({
          title: res.message,
          icon: "error"
        });
      }
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
  const _component_cityPicker = common_vendor.resolveComponent("cityPicker");
  (_component_pageBack + _component_cityPicker)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.p({
      titleInfo: $data.titleInfo
    }),
    b: $data.isDefault ? 1 : "",
    c: common_vendor.o(($event) => $data.isDefault = !$data.isDefault),
    d: $data.name,
    e: common_vendor.o(($event) => $data.name = $event.detail.value),
    f: $data.phone,
    g: common_vendor.o(($event) => $data.phone = $event.detail.value),
    h: common_vendor.t(this.str),
    i: common_vendor.o((...args) => $options.open && $options.open(...args)),
    j: common_vendor.o($options.confirm),
    k: common_vendor.o($options.cancel),
    l: common_vendor.p({
      column: $data.column,
      ["default-value"]: $data.defaultValue,
      ["mask-close-able"]: $data.maskCloseAble,
      visible: $data.visible
    }),
    m: $data.address,
    n: common_vendor.o(($event) => $data.address = $event.detail.value),
    o: common_vendor.o((...args) => $options.save && $options.save(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-524d87db"]]);
_sfc_main.__runtimeHooks = 1;
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/secondPages/addAddress/addAddress.js.map
