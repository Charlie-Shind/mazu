"use strict";
const common_vendor = require("../../../../common/vendor.js");
const PickerColor = () => "./color-picker.js";
const _sfc_main = {
  components: {
    PickerColor
  },
  props: {
    api: {
      type: String,
      default: ""
    },
    photoUrl: {
      type: String,
      default: ""
    },
    values: {
      type: String,
      default: ""
    },
    readOnly: {
      type: Boolean,
      default: false
    },
    maxlength: {
      type: Number,
      default: 300
    },
    name: {
      type: String,
      default: "file"
    }
  },
  data() {
    return {
      currentTab: 0,
      curColor: "#000000",
      show: true,
      hdid: "",
      myHtml: "",
      formats: {}
    };
  },
  methods: {
    showPicker() {
      this.$refs.colorPicker.open();
    },
    confirm(e) {
      this.editorCtx.format("color", e.hex);
    },
    saveContens() {
      let that = this;
      let maxlength = parseInt(that.maxlength);
      that.editorCtx.getContents({
        success: function(res) {
          let html_text = res.html;
          let html_length = html_text.length;
          if (html_length > maxlength) {
            common_vendor.index.showModal({
              title: "最多只能输入" + maxlength + "字",
              confirmText: "确定",
              showCancel: false,
              success(res2) {
                that.$emit("changes", {
                  html: res2.html,
                  length: html_length
                });
              }
            });
          } else {
            that.$emit("changes", {
              html: res.html,
              length: html_length
            });
          }
        }
      });
    },
    update() {
      let that = this;
      setTimeout(() => {
        that.editorCtx.setContents({
          "html": that.values
        });
      }, 1e3);
    },
    onEditorReady() {
      let that = this;
      common_vendor.index.__f__("log", "at uni_modules/piaoyi-editor/components/piaoyi-editor/piaoyi-editor.vue:154", common_vendor.index.createSelectorQuery().in(this).select("#editor"));
      common_vendor.index.createSelectorQuery().in(this).select("#editor").context((res) => {
        that.editorCtx = res.context;
        that.update();
      }).exec((result) => {
      });
    },
    undo() {
      this.editorCtx.undo();
    },
    redo() {
      this.editorCtx.redo();
    },
    format(e) {
      let {
        name,
        value
      } = e.target.dataset;
      if (!name)
        return;
      if (name == "color") {
        this.showPicker();
      } else {
        this.editorCtx.format(name, value);
      }
    },
    onStatusChange(e) {
      const formats = e.detail;
      this.formats = formats;
    },
    insertDivider() {
      this.editorCtx.insertDivider();
    },
    clear() {
      this.editorCtx.clear();
      this.$emit();
    },
    insertDate() {
      const date = /* @__PURE__ */ new Date();
      const formatDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
      this.editorCtx.insertText({
        text: formatDate
      });
    },
    insertImage() {
      let that = this;
      common_vendor.index.chooseMedia({
        count: 1,
        mediaType: ["image"],
        sourceType: ["album"],
        sizeType: "compressed",
        success: (chooseImageRes) => {
          const tempFilePaths = chooseImageRes.tempFiles[0].tempFilePath;
          common_vendor.index.__f__("log", "at uni_modules/piaoyi-editor/components/piaoyi-editor/piaoyi-editor.vue:261", tempFilePaths);
          if (!this.api || !this.photoUrl) {
            that.editorCtx.insertImage({
              src: tempFilePaths,
              alt: "图像",
              success: function() {
              }
            });
            common_vendor.index.showToast({
              title: "未传入api字段或者photoUrl字段，此为临时图片路径",
              duration: 3e3,
              icon: "none"
            });
          } else {
            common_vendor.index.uploadFile({
              url: this.photoUrl + this.api,
              filePath: tempFilePaths,
              name: this.name,
              formData: {},
              success: (uploadFileRes) => {
                var obj = JSON.parse(uploadFileRes.data);
                if (obj.code == 200) {
                  this.img = this.photoUrl + "/" + obj.data;
                  common_vendor.wx$1.showToast({
                    title: obj.msg,
                    icon: "none"
                  });
                  this.editorCtx.insertImage({
                    src: this.img,
                    alt: "图像",
                    success: function() {
                    }
                  });
                } else {
                  common_vendor.wx$1.showToast({
                    title: obj.msg,
                    icon: "none"
                  });
                }
              },
              fail(err) {
                common_vendor.index.__f__("log", "at uni_modules/piaoyi-editor/components/piaoyi-editor/piaoyi-editor.vue:300", err);
                common_vendor.index.showToast({
                  title: err.errMsg,
                  icon: "none"
                });
              }
            });
          }
        }
      });
    }
  }
};
if (!Array) {
  const _component_PickerColor = common_vendor.resolveComponent("PickerColor");
  _component_PickerColor();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.sr("colorPicker", "577f656e-0"),
    b: common_vendor.o($options.confirm),
    c: common_vendor.p({
      color: {
        r: 255,
        g: 0,
        b: 0,
        a: 0.6
      }
    }),
    d: common_vendor.o((...args) => $options.onStatusChange && $options.onStatusChange(...args)),
    e: $props.readOnly,
    f: common_vendor.o((...args) => $options.onEditorReady && $options.onEditorReady(...args)),
    g: common_vendor.o((...args) => $options.saveContens && $options.saveContens(...args)),
    h: common_vendor.n($data.formats.fontSize === "24px" ? "ql-active" : ""),
    i: common_vendor.n($data.formats.color ? "ql-active" : ""),
    j: $data.formats.color,
    k: common_vendor.n($data.formats.header === 1 ? "ql-active" : ""),
    l: common_vendor.n($data.formats.header === 2 ? "ql-active" : ""),
    m: common_vendor.n($data.formats.bold ? "ql-active" : ""),
    n: common_vendor.n($data.formats.italic ? "ql-active" : ""),
    o: common_vendor.n($data.formats.underline ? "ql-active" : ""),
    p: common_vendor.n($data.formats.strike ? "ql-active" : ""),
    q: common_vendor.n($data.formats.align === "left" ? "ql-active" : ""),
    r: common_vendor.n($data.formats.align === "center" ? "ql-active" : ""),
    s: common_vendor.n($data.formats.align === "right" ? "ql-active" : ""),
    t: common_vendor.n($data.formats.align === "justify" ? "ql-active" : ""),
    v: common_vendor.n($data.formats.lineHeight ? "ql-active" : ""),
    w: common_vendor.n($data.formats.list === "ordered" ? "ql-active" : ""),
    x: common_vendor.n($data.formats.list === "bullet" ? "ql-active" : ""),
    y: common_vendor.o((...args) => $options.insertDivider && $options.insertDivider(...args)),
    z: common_vendor.o((...args) => $options.undo && $options.undo(...args)),
    A: common_vendor.o((...args) => $options.redo && $options.redo(...args)),
    B: common_vendor.o((...args) => $options.clear && $options.clear(...args)),
    C: common_vendor.o((...args) => $options.format && $options.format(...args))
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-577f656e"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/uni_modules/piaoyi-editor/components/piaoyi-editor/piaoyi-editor.js.map
