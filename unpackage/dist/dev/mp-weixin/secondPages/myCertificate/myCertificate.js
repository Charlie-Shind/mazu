"use strict";
const common_vendor = require("../../common/vendor.js");
const store_userInfo = require("../../store/userInfo.js");
const pageBack = () => "../../components/title/title.js";
const _sfc_main = {
  name: "MyCertificatePage",
  components: {
    pageBack
  },
  data() {
    return {
      // 头部标题配置
      titleInfo: {
        titleShow: true,
        title: "我的证书",
        imageUrl: "http://t73sifiwt.hn-bkt.clouddn.com/pageBack/3.webp",
        heightShow: false,
        backShow: true
      },
      userInfo: {},
      totalIncense: 0,
      // 总香火值（用于证书显示）
      certificateDate: "",
      // 获得证书日期
      certificateImage: ""
      // 证书图片临时路径
    };
  },
  computed: {
    // 是否已获得证书（香火值 >= 5000）
    hasCertificate() {
      return this.userInfo && this.userInfo.balance >= 5e3;
    },
    // 进度百分比
    progressPercent() {
      if (!this.userInfo || !this.userInfo.balance)
        return 0;
      const percent = this.userInfo.balance / 5e3 * 100;
      return percent > 100 ? 100 : Math.round(percent);
    }
  },
  onLoad() {
    this.loadUserInfo();
  },
  onShow() {
    this.loadUserInfo();
  },
  // 小程序分享钩子
  onShareAppMessage() {
    return {
      title: `我的妈祖功德证书`,
      path: "/pages/certificate/certificate",
      imageUrl: this.certificateImage || ""
    };
  },
  // 朋友圈分享钩子
  onShareTimeline() {
    return {
      title: `我的妈祖功德证书，累计捐献${this.userInfo.balance || 0}点香火值！`,
      imageUrl: this.certificateImage || ""
    };
  },
  methods: {
    /**
     * 加载用户信息
     */
    loadUserInfo() {
      const store = store_userInfo.useUserInfoStore();
      this.userInfo = store.$state.userInfo || {};
      if (this.hasCertificate) {
        this.totalIncense = this.userInfo.balance || 0;
        const savedDate = common_vendor.index.getStorageSync("certificate_date");
        if (savedDate) {
          this.certificateDate = savedDate;
        } else {
          const now = /* @__PURE__ */ new Date();
          this.certificateDate = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`;
          common_vendor.index.setStorageSync("certificate_date", this.certificateDate);
        }
      }
    },
    /**
     * 前往登录
     */
    toLogin() {
      common_vendor.index.navigateTo({
        url: "/pages/login/login"
      });
    },
    /**
     * 前往捐献香火页面
     */
    goToIncense() {
      common_vendor.index.navigateTo({
        url: "/secondPages/incense/incense"
      });
    },
    /**
     * 小程序专用：将证书节点生成图片（核心修复）
     */
    async convertCertificateToImage() {
      return new Promise((resolve, reject) => {
        common_vendor.index.showLoading({
          title: "生成证书中..."
        });
        const query = common_vendor.index.createSelectorQuery().in(this);
        query.select("#certificateDom").boundingClientRect((rect) => {
          if (!rect) {
            common_vendor.index.hideLoading();
            common_vendor.index.showToast({
              title: "证书节点未找到",
              icon: "none"
            });
            reject("证书节点未找到");
            return;
          }
          common_vendor.index.canvasToTempFilePath({
            x: 0,
            y: 0,
            width: rect.width,
            height: rect.height,
            destWidth: rect.width * 3,
            // 3倍清晰度
            destHeight: rect.height * 3,
            canvasId: "certificateCanvas",
            success: (res) => {
              if (!res.tempFilePath) {
                this.drawCertificateToCanvas(rect.width, rect.height).then((tempPath) => {
                  common_vendor.index.hideLoading();
                  this.certificateImage = tempPath;
                  resolve(tempPath);
                }).catch((err) => {
                  common_vendor.index.hideLoading();
                  reject(err);
                });
                return;
              }
              common_vendor.index.hideLoading();
              this.certificateImage = res.tempFilePath;
              resolve(res.tempFilePath);
            },
            fail: (err) => {
              this.drawCertificateToCanvas(rect.width, rect.height).then((tempPath) => {
                common_vendor.index.hideLoading();
                this.certificateImage = tempPath;
                resolve(tempPath);
              }).catch((err2) => {
                common_vendor.index.hideLoading();
                common_vendor.index.showToast({
                  title: "生成证书失败",
                  icon: "none"
                });
                reject(err2);
              });
            }
          }, this);
        }).exec();
      });
    },
    /**
     * 兜底方案：手动绘制证书到画布
     */
    drawCertificateToCanvas(width, height) {
      return new Promise((resolve, reject) => {
        const ctx = common_vendor.index.createCanvasContext("certificateCanvas", this);
        const scale = 3;
        const w = width * scale;
        const h = height * scale;
        ctx.setFillStyle("#FFFBF2");
        ctx.fillRect(0, 0, w, h);
        ctx.setStrokeStyle("#D4A574");
        ctx.setLineWidth(18);
        ctx.roundRect(10, 10, w - 20, h - 20, 96);
        ctx.stroke();
        ctx.setFontSize(168);
        ctx.setFillStyle("#4D0000");
        ctx.setTextAlign("center");
        ctx.fillText("功德证书", w / 2, 240);
        ctx.setFontSize(66);
        ctx.setFillStyle("#999");
        ctx.fillText("Certificate of Merit", w / 2, 320);
        ctx.setStrokeStyle("#D4A574");
        ctx.setLineWidth(6);
        ctx.beginPath();
        ctx.moveTo(w / 2 - 600, 380);
        ctx.lineTo(w / 2 + 600, 380);
        ctx.stroke();
        ctx.setFontSize(72);
        ctx.setFillStyle("#999");
        ctx.fillText("功德主", w / 2, 500);
        ctx.setFontSize(144);
        ctx.setFillStyle("#D4A574");
        ctx.fillText(this.userInfo.nickname || "善信", w / 2, 680);
        ctx.setFontSize(108);
        ctx.setFillStyle("#4D0000");
        ctx.fillText("虔诚供奉，功德无量", w / 2, 840);
        ctx.setFontSize(78);
        ctx.setFillStyle("#999");
        ctx.fillText("心诚则灵，善念成真", w / 2, 940);
        ctx.setFontSize(72);
        ctx.setFillStyle("#999");
        ctx.fillText("累计香火值", w / 2 - 400, 1100);
        ctx.fillText("获得日期", w / 2 + 400, 1100);
        ctx.setFontSize(84);
        ctx.setFillStyle("#D4A574");
        ctx.fillText(`${this.totalIncense || this.userInfo.balance} 点`, w / 2 - 400, 1220);
        ctx.fillText(this.certificateDate, w / 2 + 400, 1220);
        ctx.setStrokeStyle("#D4A574");
        ctx.setLineWidth(12);
        ctx.arc(w - 420, 1400, 420, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.setFontSize(78);
        ctx.setFillStyle("#D4A574");
        ctx.fillText("功德", w - 420, 1360);
        ctx.fillText("圆满", w - 420, 1460);
        ctx.setStrokeStyle("#D4A574");
        ctx.setLineWidth(6);
        ctx.beginPath();
        ctx.moveTo(w / 2 - 600, 1700);
        ctx.lineTo(w / 2 + 600, 1700);
        ctx.stroke();
        ctx.setFontSize(96);
        ctx.setFillStyle("#4D0000");
        ctx.fillText("妈祖文化传承", w / 2, 1820);
        ctx.setFontSize(60);
        ctx.setFillStyle("#999");
        ctx.fillText("Mazu Cultural Heritage", w / 2, 1900);
        ctx.draw(false, () => {
          common_vendor.index.canvasToTempFilePath({
            x: 0,
            y: 0,
            width: w,
            height: h,
            destWidth: w,
            destHeight: h,
            canvasId: "certificateCanvas",
            success: (res) => {
              resolve(res.tempFilePath);
            },
            fail: (err) => {
              reject(err);
            }
          }, this);
        });
      });
    },
    /**
     * 分享证书（支持好友/朋友圈）
     */
    async shareCertificate() {
      try {
        const imagePath = await this.convertCertificateToImage();
        common_vendor.index.showActionSheet({
          itemList: ["分享给微信好友", "分享到朋友圈"],
          success: (res) => {
            if (res.tapIndex === 0) {
              common_vendor.index.shareAppMessage({
                title: `我的妈祖功德证书`,
                path: "/pages/certificate/certificate",
                imageUrl: imagePath,
                success: () => {
                  common_vendor.index.showToast({
                    title: "分享成功",
                    icon: "success"
                  });
                },
                fail: (err) => {
                  common_vendor.index.__f__("error", "at secondPages/myCertificate/myCertificate.vue:430", "分享好友失败：", err);
                  common_vendor.index.showToast({
                    title: "分享失败，请重试",
                    icon: "none"
                  });
                }
              });
            } else if (res.tapIndex === 1) {
              common_vendor.index.shareTimeline({
                title: `我的妈祖功德证书，累计捐献${this.userInfo.balance || 0}点香火值！`,
                imageUrl: imagePath,
                success: () => {
                  common_vendor.index.showToast({
                    title: "分享成功",
                    icon: "success"
                  });
                },
                fail: (err) => {
                  common_vendor.index.__f__("error", "at secondPages/myCertificate/myCertificate.vue:449", "分享朋友圈失败：", err);
                  common_vendor.index.showToast({
                    title: "分享失败，请重试",
                    icon: "none"
                  });
                }
              });
            }
          },
          fail: (err) => {
            common_vendor.index.__f__("error", "at secondPages/myCertificate/myCertificate.vue:459", "取消分享：", err);
          }
        });
      } catch (err) {
        common_vendor.index.__f__("error", "at secondPages/myCertificate/myCertificate.vue:463", "分享证书失败：", err);
        common_vendor.index.showToast({
          title: "分享失败，请重试",
          icon: "none"
        });
      }
    },
    /**
     * 保存证书图片到相册
     */
    async saveCertificate() {
      try {
        const imagePath = await this.convertCertificateToImage();
        const settingRes = await common_vendor.index.getSetting();
        if (!settingRes.authSetting["scope.writePhotosAlbum"]) {
          try {
            await common_vendor.index.authorize({
              scope: "scope.writePhotosAlbum"
            });
          } catch (authErr) {
            common_vendor.index.showModal({
              title: "提示",
              content: "需要您授权保存图片到相册的权限",
              confirmText: "去设置",
              success: (modalRes) => {
                if (modalRes.confirm) {
                  common_vendor.index.openSetting();
                }
              }
            });
            return;
          }
        }
        common_vendor.index.saveImageToPhotosAlbum({
          filePath: imagePath,
          success: () => {
            common_vendor.index.showToast({
              title: "保存成功",
              icon: "success"
            });
          },
          fail: (err) => {
            common_vendor.index.__f__("error", "at secondPages/myCertificate/myCertificate.vue:512", "保存图片失败：", err);
            common_vendor.index.showToast({
              title: "保存失败，请重试",
              icon: "none"
            });
          }
        });
      } catch (err) {
        common_vendor.index.__f__("error", "at secondPages/myCertificate/myCertificate.vue:520", "保存证书失败：", err);
        common_vendor.index.showToast({
          title: "保存失败，请重试",
          icon: "none"
        });
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
    b: !$data.userInfo || !$data.userInfo.id
  }, !$data.userInfo || !$data.userInfo.id ? {
    c: common_vendor.o((...args) => $options.toLogin && $options.toLogin(...args))
  } : !$options.hasCertificate ? {
    e: common_vendor.t($data.userInfo.balance || 0),
    f: common_vendor.t($options.progressPercent),
    g: $options.progressPercent + "%",
    h: common_vendor.o((...args) => $options.goToIncense && $options.goToIncense(...args))
  } : {
    i: common_vendor.t($data.userInfo.nickname || "善信"),
    j: common_vendor.t($data.totalIncense || $data.userInfo.balance),
    k: common_vendor.t($data.certificateDate),
    l: common_vendor.o((...args) => $options.shareCertificate && $options.shareCertificate(...args)),
    m: common_vendor.o((...args) => $options.saveCertificate && $options.saveCertificate(...args))
  }, {
    d: !$options.hasCertificate
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-06acf921"]]);
_sfc_main.__runtimeHooks = 6;
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/secondPages/myCertificate/myCertificate.js.map
