"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_request = require("../../utils/request.js");
const pageBack = () => "../../components/title/title.js";
const _sfc_main = {
  components: {
    pageBack
  },
  pageStyle: {
    navigationBarTitleText: "AI创意工坊"
  },
  data() {
    return {
      titleInfo: {
        titleShow: true,
        title: "AI创意工坊",
        imageUrl: "http://t73sifiwt.hn-bkt.clouddn.com/pageBack/1.webp",
        heightShow: false,
        backShow: true
      },
      typeList: [
        { name: "妈祖IP", value: "妈祖IP" },
        { name: "平安符", value: "平安符" },
        { name: "冰箱贴", value: "冰箱贴" },
        { name: "纪念币", value: "纪念币" },
        { name: "盲盒", value: "盲盒" }
      ],
      styleList: [
        { name: "卡通风格", value: "卡通风格" },
        { name: "传统国风", value: "传统国风" },
        { name: "珐琅风格", value: "珐琅风格" },
        { name: "简约风格", value: "简约风格" }
      ],
      selectedType: { name: "妈祖IP", value: "妈祖IP" },
      selectedStyle: { name: "卡通风格", value: "卡通风格" },
      extraDemand: "",
      isLoading: false,
      imageUrl: "",
      countdown: 1,
      // 1. 倒计时初始值改为1（正数开始）
      countdownTimer: null,
      sampleList: [],
      scrollX: 0,
      scrollTimer: null,
      itemWidth: 0,
      isScrolling: true,
      scrollSpeed: 2,
      scrollInterval: 20
    };
  },
  computed: {
    renderList() {
      return [...this.sampleList, ...this.sampleList];
    }
  },
  onLoad() {
    this.$nextTick(() => {
      this.getMazuCarousel();
      setTimeout(() => {
        this.initScroll();
      }, 300);
    });
  },
  onUnload() {
    if (this.scrollTimer)
      clearInterval(this.scrollTimer);
    this.clearCountdown();
  },
  onReady() {
    common_vendor.index.hideTabBar({ fail: () => {
    } });
  },
  methods: {
    onTypeChange(e) {
      this.selectedType = this.typeList[e.detail.value];
    },
    onStyleChange(e) {
      this.selectedStyle = this.styleList[e.detail.value];
    },
    handleClearResult() {
      this.imageUrl = "";
      common_vendor.index.showToast({ title: "已清除当前结果", icon: "none" });
    },
    // 2. 倒计时改为正数递增（核心修改）
    initCountdown() {
      this.countdown = 1;
      if (this.countdownTimer)
        clearInterval(this.countdownTimer);
      this.countdownTimer = setInterval(() => {
        this.countdown++;
      }, 1e3);
    },
    clearCountdown() {
      this.countdownTimer && (clearInterval(this.countdownTimer), this.countdownTimer = null, this.countdown = 1);
    },
    async handleGenerate() {
      if (!this.extraDemand.trim())
        return common_vendor.index.showToast({ title: "请输入祈福关键词", icon: "none" });
      if (this.isLoading)
        return;
      this.imageUrl = "";
      this.initCountdown();
      this.isLoading = true;
      try {
        const res = await utils_request.request({
          url: "/user/image/generateimg",
          method: "POST",
          data: {
            generateType: this.selectedType.value,
            style: this.selectedStyle.value,
            extraDemand: this.extraDemand.trim()
          }
        });
        if (res && [1, 200].includes(res.code) && res.data) {
          this.imageUrl = res.data;
          common_vendor.index.showToast({ title: "生成成功", icon: "success" });
          this.getMazuCarousel();
        } else {
          common_vendor.index.showToast({ title: (res == null ? void 0 : res.msg) || "生成失败", icon: "none" });
        }
      } catch (err) {
        common_vendor.index.__f__("error", "at secondPages/generateimg/generateimg.vue:209", "生成失败：", err);
        common_vendor.index.showToast({ title: "网络错误", icon: "none" });
      } finally {
        this.isLoading = false;
        this.clearCountdown();
      }
    },
    previewImage() {
      this.imageUrl && common_vendor.index.previewImage({ urls: [this.imageUrl], current: this.imageUrl });
    },
    getRealIndex(index) {
      return index % this.sampleList.length;
    },
    previewSample(index) {
      common_vendor.index.previewImage({
        urls: this.sampleList.map((item) => item.url),
        current: this.sampleList[index].url
      });
    },
    handleSaveImage() {
      if (!this.imageUrl)
        return;
      common_vendor.index.showLoading({ title: "保存中..." });
      common_vendor.index.downloadFile({
        url: this.imageUrl,
        success: (res) => {
          if (res.statusCode === 200) {
            common_vendor.index.saveImageToPhotosAlbum({
              filePath: res.tempFilePath,
              success: () => {
                common_vendor.index.hideLoading();
                common_vendor.index.showToast({ title: "保存成功", icon: "success" });
              },
              fail: (err) => {
                common_vendor.index.hideLoading();
                if (err.errMsg.includes("auth deny")) {
                  common_vendor.index.showModal({
                    title: "权限提示",
                    content: "需要相册权限才能保存",
                    success: (res2) => res2.confirm && common_vendor.index.openSetting()
                  });
                } else {
                  common_vendor.index.showToast({ title: "保存失败", icon: "none" });
                }
              }
            });
          } else {
            common_vendor.index.hideLoading();
            common_vendor.index.showToast({ title: "下载失败", icon: "none" });
          }
        },
        fail: () => {
          common_vendor.index.hideLoading();
          common_vendor.index.showToast({ title: "下载失败", icon: "none" });
        }
      });
    },
    initScroll() {
      common_vendor.index.createSelectorQuery().in(this).select(".sample-item").boundingClientRect((rect) => {
        if (rect) {
          this.itemWidth = rect.width + 20;
          this.startScroll();
        }
      }).exec();
    },
    startScroll() {
      this.scrollTimer && clearInterval(this.scrollTimer);
      this.scrollTimer = setInterval(() => {
        this.scrollX -= this.scrollSpeed;
        const maxX = this.itemWidth * this.sampleList.length;
        Math.abs(this.scrollX) >= maxX && (this.scrollX = 0);
      }, this.scrollInterval);
    },
    stopScroll() {
      this.isScrolling = false;
      this.scrollTimer && (clearInterval(this.scrollTimer), this.scrollTimer = null);
    },
    // 3. 极简获取轮播图数据（原样赋值，不过滤）
    async getMazuCarousel() {
      const res = await utils_request.request({ url: "/user/image/mazuCarousel", method: "get" });
      if (res && res.data && Array.isArray(res.data)) {
        this.sampleList = res.data;
      } else {
        this.sampleList = [
          { id: 91, url: "https://javaweb-ai-ch.oss-cn-beijing.aliyuncs.com/2025/12/盲盒_bdbd71e5-9989-4a77-975d-a3bf704d0b2a.png", prompt: "盲盒，卡通风格，平安" },
          { id: 1, url: "https://javaweb-ai-ch.oss-cn-beijing.aliyuncs.com/2025/12/妈祖IP_c99e1313-10d5-4c9d-83ec-47c4cfe6440d.png", prompt: "妈祖IP，传统国风，出海顺遂" },
          { id: 2, url: "https://javaweb-ai-ch.oss-cn-beijing.aliyuncs.com/2025/12/平安福_909591ef-c65b-40de-a8cb-b3c7810f7c5c.png", prompt: "平安福，卡通风格，高考必胜" }
        ];
      }
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
    b: common_vendor.t($data.selectedType.name),
    c: common_vendor.o((...args) => $options.onTypeChange && $options.onTypeChange(...args)),
    d: $data.typeList,
    e: common_vendor.t($data.selectedStyle.name),
    f: common_vendor.o((...args) => $options.onStyleChange && $options.onStyleChange(...args)),
    g: $data.styleList,
    h: $data.extraDemand,
    i: common_vendor.o(($event) => $data.extraDemand = $event.detail.value),
    j: common_vendor.t($data.imageUrl ? "重新创作" : "生成设计"),
    k: $data.isLoading && $data.countdown >= 1
  }, $data.isLoading && $data.countdown >= 1 ? {
    l: common_vendor.t($data.countdown)
  } : {}, {
    m: common_vendor.o((...args) => $options.handleGenerate && $options.handleGenerate(...args)),
    n: $data.isLoading,
    o: $data.isLoading
  }, $data.isLoading ? {
    p: common_vendor.f(3, (i, k0, i0) => {
      return {
        a: `${i * 0.2}s`,
        b: i
      };
    })
  } : {}, {
    q: $data.imageUrl
  }, $data.imageUrl ? {
    r: common_vendor.o((...args) => $options.handleClearResult && $options.handleClearResult(...args)),
    s: $data.imageUrl,
    t: common_vendor.o((...args) => $options.previewImage && $options.previewImage(...args)),
    v: common_vendor.o((...args) => $options.previewImage && $options.previewImage(...args)),
    w: common_vendor.o((...args) => $options.handleSaveImage && $options.handleSaveImage(...args))
  } : !$data.isLoading ? {} : {}, {
    x: !$data.isLoading,
    y: $data.isLoading
  }, $data.isLoading ? {
    z: common_vendor.t($data.countdown)
  } : {}, {
    A: $data.sampleList.length > 0
  }, $data.sampleList.length > 0 ? {
    B: common_vendor.f($options.renderList, (item, index, i0) => {
      return {
        a: item.url,
        b: common_vendor.t(item.prompt || "无描述"),
        c: index,
        d: common_vendor.o(($event) => $options.previewSample($options.getRealIndex(index)), index)
      };
    }),
    C: `translateX(${$data.scrollX}px)`,
    D: $data.isScrolling ? "transform 0.3s ease" : "none",
    E: common_vendor.o((...args) => $options.stopScroll && $options.stopScroll(...args)),
    F: common_vendor.o((...args) => $options.startScroll && $options.startScroll(...args))
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-76a33e65"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/secondPages/generateimg/generateimg.js.map
