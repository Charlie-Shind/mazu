if (typeof Promise !== "undefined" && !Promise.prototype.finally) {
  Promise.prototype.finally = function(callback) {
    const promise = this.constructor;
    return this.then(
      (value) => promise.resolve(callback()).then(() => value),
      (reason) => promise.resolve(callback()).then(() => {
        throw reason;
      })
    );
  };
}
;
if (typeof uni !== "undefined" && uni && uni.requireGlobal) {
  const global2 = uni.requireGlobal();
  ArrayBuffer = global2.ArrayBuffer;
  Int8Array = global2.Int8Array;
  Uint8Array = global2.Uint8Array;
  Uint8ClampedArray = global2.Uint8ClampedArray;
  Int16Array = global2.Int16Array;
  Uint16Array = global2.Uint16Array;
  Int32Array = global2.Int32Array;
  Uint32Array = global2.Uint32Array;
  Float32Array = global2.Float32Array;
  Float64Array = global2.Float64Array;
  BigInt64Array = global2.BigInt64Array;
  BigUint64Array = global2.BigUint64Array;
}
;
if (uni.restoreGlobal) {
  uni.restoreGlobal(Vue, weex, plus, setTimeout, clearTimeout, setInterval, clearInterval);
}
(function(vue) {
  "use strict";
  function formatAppLog(type, filename, ...args) {
    if (uni.__log__) {
      uni.__log__(type, filename, ...args);
    } else {
      console[type].apply(console, [...args, filename]);
    }
  }
  const base_url = "http://113.45.142.234:8889";
  const timeout = 5e3;
  const request = (params) => {
    let url = params.url;
    let method = params.method || "get";
    let data = params.data || {};
    let header = {
      "Blade-Auth": uni.getStorageSync("token") || "",
      "Content-Type": "application/json;charset=UTF-8",
      "Authorization": "Basic c2FiZXI6c2FiZXJfc2VjcmV0",
      "Tenant-Id": uni.getStorageSync("tenantId") || "xxx",
      ...params.header
    };
    if (method == "post") {
      header = {
        "Content-Type": "application/json"
      };
    }
    return new Promise((resolve, reject) => {
      uni.request({
        url: base_url + url,
        method,
        header,
        data,
        timeout,
        success(response) {
          const res = response;
          if (res.statusCode == 200) {
            resolve(res.data);
          } else {
            switch (res.statusCode) {
              case 401:
                uni.showModal({
                  title: "提示",
                  content: "请登录",
                  showCancel: false
                  // 这里可以添加跳转到登录页面的逻辑  
                });
                break;
              case 404:
                uni.showToast({
                  title: "请求地址不存在...",
                  duration: 2e3
                });
                break;
              default:
                uni.showToast({
                  title: "请重试...",
                  duration: 2e3
                });
                break;
            }
            reject(res);
          }
        },
        fail(err) {
          formatAppLog("log", "at utils/request.js:59", "错误" + err);
          if (err.errMsg.indexOf("request:fail") !== -1) {
            uni.showToast({
              title: "网络异常",
              icon: "error",
              duration: 2e3
            });
          } else {
            uni.showToast({
              title: "未知异常",
              duration: 2e3
            });
          }
          reject(err);
        }
      });
    }).catch(() => {
    });
  };
  const getCarouselAPI = () => {
    return request({
      url: "/index/getCarousel",
      mtehod: "GET"
    });
  };
  const getNewsAPI = () => {
    return request({
      url: "/index/getNews",
      mtehod: "GET"
    });
  };
  const getCreativityAPI = () => {
    return request({
      url: "/index/getCreativity",
      mtehod: "GET"
    });
  };
  const getRecommendAPI = () => {
    return request({
      url: "/index/getRecommend",
      mtehod: "GET"
    });
  };
  var isVue2 = false;
  function set(target, key, val) {
    if (Array.isArray(target)) {
      target.length = Math.max(target.length, key);
      target.splice(key, 1, val);
      return val;
    }
    target[key] = val;
    return val;
  }
  function del(target, key) {
    if (Array.isArray(target)) {
      target.splice(key, 1);
      return;
    }
    delete target[key];
  }
  function getDevtoolsGlobalHook() {
    return getTarget().__VUE_DEVTOOLS_GLOBAL_HOOK__;
  }
  function getTarget() {
    return typeof navigator !== "undefined" && typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {};
  }
  const isProxyAvailable = typeof Proxy === "function";
  const HOOK_SETUP = "devtools-plugin:setup";
  const HOOK_PLUGIN_SETTINGS_SET = "plugin:settings:set";
  let supported;
  let perf;
  function isPerformanceSupported() {
    var _a;
    if (supported !== void 0) {
      return supported;
    }
    if (typeof window !== "undefined" && window.performance) {
      supported = true;
      perf = window.performance;
    } else if (typeof global !== "undefined" && ((_a = global.perf_hooks) === null || _a === void 0 ? void 0 : _a.performance)) {
      supported = true;
      perf = global.perf_hooks.performance;
    } else {
      supported = false;
    }
    return supported;
  }
  function now() {
    return isPerformanceSupported() ? perf.now() : Date.now();
  }
  class ApiProxy {
    constructor(plugin, hook) {
      this.target = null;
      this.targetQueue = [];
      this.onQueue = [];
      this.plugin = plugin;
      this.hook = hook;
      const defaultSettings = {};
      if (plugin.settings) {
        for (const id in plugin.settings) {
          const item = plugin.settings[id];
          defaultSettings[id] = item.defaultValue;
        }
      }
      const localSettingsSaveId = `__vue-devtools-plugin-settings__${plugin.id}`;
      let currentSettings = Object.assign({}, defaultSettings);
      try {
        const raw = localStorage.getItem(localSettingsSaveId);
        const data = JSON.parse(raw);
        Object.assign(currentSettings, data);
      } catch (e) {
      }
      this.fallbacks = {
        getSettings() {
          return currentSettings;
        },
        setSettings(value) {
          try {
            localStorage.setItem(localSettingsSaveId, JSON.stringify(value));
          } catch (e) {
          }
          currentSettings = value;
        },
        now() {
          return now();
        }
      };
      if (hook) {
        hook.on(HOOK_PLUGIN_SETTINGS_SET, (pluginId, value) => {
          if (pluginId === this.plugin.id) {
            this.fallbacks.setSettings(value);
          }
        });
      }
      this.proxiedOn = new Proxy({}, {
        get: (_target, prop) => {
          if (this.target) {
            return this.target.on[prop];
          } else {
            return (...args) => {
              this.onQueue.push({
                method: prop,
                args
              });
            };
          }
        }
      });
      this.proxiedTarget = new Proxy({}, {
        get: (_target, prop) => {
          if (this.target) {
            return this.target[prop];
          } else if (prop === "on") {
            return this.proxiedOn;
          } else if (Object.keys(this.fallbacks).includes(prop)) {
            return (...args) => {
              this.targetQueue.push({
                method: prop,
                args,
                resolve: () => {
                }
              });
              return this.fallbacks[prop](...args);
            };
          } else {
            return (...args) => {
              return new Promise((resolve) => {
                this.targetQueue.push({
                  method: prop,
                  args,
                  resolve
                });
              });
            };
          }
        }
      });
    }
    async setRealTarget(target) {
      this.target = target;
      for (const item of this.onQueue) {
        this.target.on[item.method](...item.args);
      }
      for (const item of this.targetQueue) {
        item.resolve(await this.target[item.method](...item.args));
      }
    }
  }
  function setupDevtoolsPlugin(pluginDescriptor, setupFn) {
    const descriptor = pluginDescriptor;
    const target = getTarget();
    const hook = getDevtoolsGlobalHook();
    const enableProxy = isProxyAvailable && descriptor.enableEarlyProxy;
    if (hook && (target.__VUE_DEVTOOLS_PLUGIN_API_AVAILABLE__ || !enableProxy)) {
      hook.emit(HOOK_SETUP, pluginDescriptor, setupFn);
    } else {
      const proxy = enableProxy ? new ApiProxy(descriptor, hook) : null;
      const list = target.__VUE_DEVTOOLS_PLUGINS__ = target.__VUE_DEVTOOLS_PLUGINS__ || [];
      list.push({
        pluginDescriptor: descriptor,
        setupFn,
        proxy
      });
      if (proxy)
        setupFn(proxy.proxiedTarget);
    }
  }
  /*!
   * pinia v2.1.7
   * (c) 2023 Eduardo San Martin Morote
   * @license MIT
   */
  let activePinia;
  const setActivePinia = (pinia) => activePinia = pinia;
  const getActivePinia = () => vue.hasInjectionContext() && vue.inject(piniaSymbol) || activePinia;
  const piniaSymbol = Symbol("pinia");
  function isPlainObject(o) {
    return o && typeof o === "object" && Object.prototype.toString.call(o) === "[object Object]" && typeof o.toJSON !== "function";
  }
  var MutationType;
  (function(MutationType2) {
    MutationType2["direct"] = "direct";
    MutationType2["patchObject"] = "patch object";
    MutationType2["patchFunction"] = "patch function";
  })(MutationType || (MutationType = {}));
  const IS_CLIENT = typeof window !== "undefined";
  const USE_DEVTOOLS = IS_CLIENT;
  const _global = /* @__PURE__ */ (() => typeof window === "object" && window.window === window ? window : typeof self === "object" && self.self === self ? self : typeof global === "object" && global.global === global ? global : typeof globalThis === "object" ? globalThis : { HTMLElement: null })();
  function bom(blob, { autoBom = false } = {}) {
    if (autoBom && /^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)) {
      return new Blob([String.fromCharCode(65279), blob], { type: blob.type });
    }
    return blob;
  }
  function download(url, name, opts) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.responseType = "blob";
    xhr.onload = function() {
      saveAs(xhr.response, name, opts);
    };
    xhr.onerror = function() {
      console.error("could not download file");
    };
    xhr.send();
  }
  function corsEnabled(url) {
    const xhr = new XMLHttpRequest();
    xhr.open("HEAD", url, false);
    try {
      xhr.send();
    } catch (e) {
    }
    return xhr.status >= 200 && xhr.status <= 299;
  }
  function click(node) {
    try {
      node.dispatchEvent(new MouseEvent("click"));
    } catch (e) {
      const evt = document.createEvent("MouseEvents");
      evt.initMouseEvent("click", true, true, window, 0, 0, 0, 80, 20, false, false, false, false, 0, null);
      node.dispatchEvent(evt);
    }
  }
  const _navigator = typeof navigator === "object" ? navigator : { userAgent: "" };
  const isMacOSWebView = /* @__PURE__ */ (() => /Macintosh/.test(_navigator.userAgent) && /AppleWebKit/.test(_navigator.userAgent) && !/Safari/.test(_navigator.userAgent))();
  const saveAs = !IS_CLIENT ? () => {
  } : (
    // Use download attribute first if possible (#193 Lumia mobile) unless this is a macOS WebView or mini program
    typeof HTMLAnchorElement !== "undefined" && "download" in HTMLAnchorElement.prototype && !isMacOSWebView ? downloadSaveAs : (
      // Use msSaveOrOpenBlob as a second approach
      "msSaveOrOpenBlob" in _navigator ? msSaveAs : (
        // Fallback to using FileReader and a popup
        fileSaverSaveAs
      )
    )
  );
  function downloadSaveAs(blob, name = "download", opts) {
    const a = document.createElement("a");
    a.download = name;
    a.rel = "noopener";
    if (typeof blob === "string") {
      a.href = blob;
      if (a.origin !== location.origin) {
        if (corsEnabled(a.href)) {
          download(blob, name, opts);
        } else {
          a.target = "_blank";
          click(a);
        }
      } else {
        click(a);
      }
    } else {
      a.href = URL.createObjectURL(blob);
      setTimeout(function() {
        URL.revokeObjectURL(a.href);
      }, 4e4);
      setTimeout(function() {
        click(a);
      }, 0);
    }
  }
  function msSaveAs(blob, name = "download", opts) {
    if (typeof blob === "string") {
      if (corsEnabled(blob)) {
        download(blob, name, opts);
      } else {
        const a = document.createElement("a");
        a.href = blob;
        a.target = "_blank";
        setTimeout(function() {
          click(a);
        });
      }
    } else {
      navigator.msSaveOrOpenBlob(bom(blob, opts), name);
    }
  }
  function fileSaverSaveAs(blob, name, opts, popup) {
    popup = popup || open("", "_blank");
    if (popup) {
      popup.document.title = popup.document.body.innerText = "downloading...";
    }
    if (typeof blob === "string")
      return download(blob, name, opts);
    const force = blob.type === "application/octet-stream";
    const isSafari = /constructor/i.test(String(_global.HTMLElement)) || "safari" in _global;
    const isChromeIOS = /CriOS\/[\d]+/.test(navigator.userAgent);
    if ((isChromeIOS || force && isSafari || isMacOSWebView) && typeof FileReader !== "undefined") {
      const reader = new FileReader();
      reader.onloadend = function() {
        let url = reader.result;
        if (typeof url !== "string") {
          popup = null;
          throw new Error("Wrong reader.result type");
        }
        url = isChromeIOS ? url : url.replace(/^data:[^;]*;/, "data:attachment/file;");
        if (popup) {
          popup.location.href = url;
        } else {
          location.assign(url);
        }
        popup = null;
      };
      reader.readAsDataURL(blob);
    } else {
      const url = URL.createObjectURL(blob);
      if (popup)
        popup.location.assign(url);
      else
        location.href = url;
      popup = null;
      setTimeout(function() {
        URL.revokeObjectURL(url);
      }, 4e4);
    }
  }
  function toastMessage(message, type) {
    const piniaMessage = "🍍 " + message;
    if (typeof __VUE_DEVTOOLS_TOAST__ === "function") {
      __VUE_DEVTOOLS_TOAST__(piniaMessage, type);
    } else if (type === "error") {
      console.error(piniaMessage);
    } else if (type === "warn") {
      console.warn(piniaMessage);
    } else {
      console.log(piniaMessage);
    }
  }
  function isPinia(o) {
    return "_a" in o && "install" in o;
  }
  function checkClipboardAccess() {
    if (!("clipboard" in navigator)) {
      toastMessage(`Your browser doesn't support the Clipboard API`, "error");
      return true;
    }
  }
  function checkNotFocusedError(error) {
    if (error instanceof Error && error.message.toLowerCase().includes("document is not focused")) {
      toastMessage('You need to activate the "Emulate a focused page" setting in the "Rendering" panel of devtools.', "warn");
      return true;
    }
    return false;
  }
  async function actionGlobalCopyState(pinia) {
    if (checkClipboardAccess())
      return;
    try {
      await navigator.clipboard.writeText(JSON.stringify(pinia.state.value));
      toastMessage("Global state copied to clipboard.");
    } catch (error) {
      if (checkNotFocusedError(error))
        return;
      toastMessage(`Failed to serialize the state. Check the console for more details.`, "error");
      console.error(error);
    }
  }
  async function actionGlobalPasteState(pinia) {
    if (checkClipboardAccess())
      return;
    try {
      loadStoresState(pinia, JSON.parse(await navigator.clipboard.readText()));
      toastMessage("Global state pasted from clipboard.");
    } catch (error) {
      if (checkNotFocusedError(error))
        return;
      toastMessage(`Failed to deserialize the state from clipboard. Check the console for more details.`, "error");
      console.error(error);
    }
  }
  async function actionGlobalSaveState(pinia) {
    try {
      saveAs(new Blob([JSON.stringify(pinia.state.value)], {
        type: "text/plain;charset=utf-8"
      }), "pinia-state.json");
    } catch (error) {
      toastMessage(`Failed to export the state as JSON. Check the console for more details.`, "error");
      console.error(error);
    }
  }
  let fileInput;
  function getFileOpener() {
    if (!fileInput) {
      fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = ".json";
    }
    function openFile() {
      return new Promise((resolve, reject) => {
        fileInput.onchange = async () => {
          const files = fileInput.files;
          if (!files)
            return resolve(null);
          const file = files.item(0);
          if (!file)
            return resolve(null);
          return resolve({ text: await file.text(), file });
        };
        fileInput.oncancel = () => resolve(null);
        fileInput.onerror = reject;
        fileInput.click();
      });
    }
    return openFile;
  }
  async function actionGlobalOpenStateFile(pinia) {
    try {
      const open2 = getFileOpener();
      const result = await open2();
      if (!result)
        return;
      const { text, file } = result;
      loadStoresState(pinia, JSON.parse(text));
      toastMessage(`Global state imported from "${file.name}".`);
    } catch (error) {
      toastMessage(`Failed to import the state from JSON. Check the console for more details.`, "error");
      console.error(error);
    }
  }
  function loadStoresState(pinia, state) {
    for (const key in state) {
      const storeState = pinia.state.value[key];
      if (storeState) {
        Object.assign(storeState, state[key]);
      } else {
        pinia.state.value[key] = state[key];
      }
    }
  }
  function formatDisplay(display) {
    return {
      _custom: {
        display
      }
    };
  }
  const PINIA_ROOT_LABEL = "🍍 Pinia (root)";
  const PINIA_ROOT_ID = "_root";
  function formatStoreForInspectorTree(store) {
    return isPinia(store) ? {
      id: PINIA_ROOT_ID,
      label: PINIA_ROOT_LABEL
    } : {
      id: store.$id,
      label: store.$id
    };
  }
  function formatStoreForInspectorState(store) {
    if (isPinia(store)) {
      const storeNames = Array.from(store._s.keys());
      const storeMap = store._s;
      const state2 = {
        state: storeNames.map((storeId) => ({
          editable: true,
          key: storeId,
          value: store.state.value[storeId]
        })),
        getters: storeNames.filter((id) => storeMap.get(id)._getters).map((id) => {
          const store2 = storeMap.get(id);
          return {
            editable: false,
            key: id,
            value: store2._getters.reduce((getters, key) => {
              getters[key] = store2[key];
              return getters;
            }, {})
          };
        })
      };
      return state2;
    }
    const state = {
      state: Object.keys(store.$state).map((key) => ({
        editable: true,
        key,
        value: store.$state[key]
      }))
    };
    if (store._getters && store._getters.length) {
      state.getters = store._getters.map((getterName) => ({
        editable: false,
        key: getterName,
        value: store[getterName]
      }));
    }
    if (store._customProperties.size) {
      state.customProperties = Array.from(store._customProperties).map((key) => ({
        editable: true,
        key,
        value: store[key]
      }));
    }
    return state;
  }
  function formatEventData(events) {
    if (!events)
      return {};
    if (Array.isArray(events)) {
      return events.reduce((data, event) => {
        data.keys.push(event.key);
        data.operations.push(event.type);
        data.oldValue[event.key] = event.oldValue;
        data.newValue[event.key] = event.newValue;
        return data;
      }, {
        oldValue: {},
        keys: [],
        operations: [],
        newValue: {}
      });
    } else {
      return {
        operation: formatDisplay(events.type),
        key: formatDisplay(events.key),
        oldValue: events.oldValue,
        newValue: events.newValue
      };
    }
  }
  function formatMutationType(type) {
    switch (type) {
      case MutationType.direct:
        return "mutation";
      case MutationType.patchFunction:
        return "$patch";
      case MutationType.patchObject:
        return "$patch";
      default:
        return "unknown";
    }
  }
  let isTimelineActive = true;
  const componentStateTypes = [];
  const MUTATIONS_LAYER_ID = "pinia:mutations";
  const INSPECTOR_ID = "pinia";
  const { assign: assign$1 } = Object;
  const getStoreType = (id) => "🍍 " + id;
  function registerPiniaDevtools(app, pinia) {
    setupDevtoolsPlugin({
      id: "dev.esm.pinia",
      label: "Pinia 🍍",
      logo: "https://pinia.vuejs.org/logo.svg",
      packageName: "pinia",
      homepage: "https://pinia.vuejs.org",
      componentStateTypes,
      app
    }, (api) => {
      if (typeof api.now !== "function") {
        toastMessage("You seem to be using an outdated version of Vue Devtools. Are you still using the Beta release instead of the stable one? You can find the links at https://devtools.vuejs.org/guide/installation.html.");
      }
      api.addTimelineLayer({
        id: MUTATIONS_LAYER_ID,
        label: `Pinia 🍍`,
        color: 15064968
      });
      api.addInspector({
        id: INSPECTOR_ID,
        label: "Pinia 🍍",
        icon: "storage",
        treeFilterPlaceholder: "Search stores",
        actions: [
          {
            icon: "content_copy",
            action: () => {
              actionGlobalCopyState(pinia);
            },
            tooltip: "Serialize and copy the state"
          },
          {
            icon: "content_paste",
            action: async () => {
              await actionGlobalPasteState(pinia);
              api.sendInspectorTree(INSPECTOR_ID);
              api.sendInspectorState(INSPECTOR_ID);
            },
            tooltip: "Replace the state with the content of your clipboard"
          },
          {
            icon: "save",
            action: () => {
              actionGlobalSaveState(pinia);
            },
            tooltip: "Save the state as a JSON file"
          },
          {
            icon: "folder_open",
            action: async () => {
              await actionGlobalOpenStateFile(pinia);
              api.sendInspectorTree(INSPECTOR_ID);
              api.sendInspectorState(INSPECTOR_ID);
            },
            tooltip: "Import the state from a JSON file"
          }
        ],
        nodeActions: [
          {
            icon: "restore",
            tooltip: 'Reset the state (with "$reset")',
            action: (nodeId) => {
              const store = pinia._s.get(nodeId);
              if (!store) {
                toastMessage(`Cannot reset "${nodeId}" store because it wasn't found.`, "warn");
              } else if (typeof store.$reset !== "function") {
                toastMessage(`Cannot reset "${nodeId}" store because it doesn't have a "$reset" method implemented.`, "warn");
              } else {
                store.$reset();
                toastMessage(`Store "${nodeId}" reset.`);
              }
            }
          }
        ]
      });
      api.on.inspectComponent((payload, ctx) => {
        const proxy = payload.componentInstance && payload.componentInstance.proxy;
        if (proxy && proxy._pStores) {
          const piniaStores = payload.componentInstance.proxy._pStores;
          Object.values(piniaStores).forEach((store) => {
            payload.instanceData.state.push({
              type: getStoreType(store.$id),
              key: "state",
              editable: true,
              value: store._isOptionsAPI ? {
                _custom: {
                  value: vue.toRaw(store.$state),
                  actions: [
                    {
                      icon: "restore",
                      tooltip: "Reset the state of this store",
                      action: () => store.$reset()
                    }
                  ]
                }
              } : (
                // NOTE: workaround to unwrap transferred refs
                Object.keys(store.$state).reduce((state, key) => {
                  state[key] = store.$state[key];
                  return state;
                }, {})
              )
            });
            if (store._getters && store._getters.length) {
              payload.instanceData.state.push({
                type: getStoreType(store.$id),
                key: "getters",
                editable: false,
                value: store._getters.reduce((getters, key) => {
                  try {
                    getters[key] = store[key];
                  } catch (error) {
                    getters[key] = error;
                  }
                  return getters;
                }, {})
              });
            }
          });
        }
      });
      api.on.getInspectorTree((payload) => {
        if (payload.app === app && payload.inspectorId === INSPECTOR_ID) {
          let stores = [pinia];
          stores = stores.concat(Array.from(pinia._s.values()));
          payload.rootNodes = (payload.filter ? stores.filter((store) => "$id" in store ? store.$id.toLowerCase().includes(payload.filter.toLowerCase()) : PINIA_ROOT_LABEL.toLowerCase().includes(payload.filter.toLowerCase())) : stores).map(formatStoreForInspectorTree);
        }
      });
      api.on.getInspectorState((payload) => {
        if (payload.app === app && payload.inspectorId === INSPECTOR_ID) {
          const inspectedStore = payload.nodeId === PINIA_ROOT_ID ? pinia : pinia._s.get(payload.nodeId);
          if (!inspectedStore) {
            return;
          }
          if (inspectedStore) {
            payload.state = formatStoreForInspectorState(inspectedStore);
          }
        }
      });
      api.on.editInspectorState((payload, ctx) => {
        if (payload.app === app && payload.inspectorId === INSPECTOR_ID) {
          const inspectedStore = payload.nodeId === PINIA_ROOT_ID ? pinia : pinia._s.get(payload.nodeId);
          if (!inspectedStore) {
            return toastMessage(`store "${payload.nodeId}" not found`, "error");
          }
          const { path } = payload;
          if (!isPinia(inspectedStore)) {
            if (path.length !== 1 || !inspectedStore._customProperties.has(path[0]) || path[0] in inspectedStore.$state) {
              path.unshift("$state");
            }
          } else {
            path.unshift("state");
          }
          isTimelineActive = false;
          payload.set(inspectedStore, path, payload.state.value);
          isTimelineActive = true;
        }
      });
      api.on.editComponentState((payload) => {
        if (payload.type.startsWith("🍍")) {
          const storeId = payload.type.replace(/^🍍\s*/, "");
          const store = pinia._s.get(storeId);
          if (!store) {
            return toastMessage(`store "${storeId}" not found`, "error");
          }
          const { path } = payload;
          if (path[0] !== "state") {
            return toastMessage(`Invalid path for store "${storeId}":
${path}
Only state can be modified.`);
          }
          path[0] = "$state";
          isTimelineActive = false;
          payload.set(store, path, payload.state.value);
          isTimelineActive = true;
        }
      });
    });
  }
  function addStoreToDevtools(app, store) {
    if (!componentStateTypes.includes(getStoreType(store.$id))) {
      componentStateTypes.push(getStoreType(store.$id));
    }
    setupDevtoolsPlugin({
      id: "dev.esm.pinia",
      label: "Pinia 🍍",
      logo: "https://pinia.vuejs.org/logo.svg",
      packageName: "pinia",
      homepage: "https://pinia.vuejs.org",
      componentStateTypes,
      app,
      settings: {
        logStoreChanges: {
          label: "Notify about new/deleted stores",
          type: "boolean",
          defaultValue: true
        }
        // useEmojis: {
        //   label: 'Use emojis in messages ⚡️',
        //   type: 'boolean',
        //   defaultValue: true,
        // },
      }
    }, (api) => {
      const now2 = typeof api.now === "function" ? api.now.bind(api) : Date.now;
      store.$onAction(({ after, onError, name, args }) => {
        const groupId = runningActionId++;
        api.addTimelineEvent({
          layerId: MUTATIONS_LAYER_ID,
          event: {
            time: now2(),
            title: "🛫 " + name,
            subtitle: "start",
            data: {
              store: formatDisplay(store.$id),
              action: formatDisplay(name),
              args
            },
            groupId
          }
        });
        after((result) => {
          activeAction = void 0;
          api.addTimelineEvent({
            layerId: MUTATIONS_LAYER_ID,
            event: {
              time: now2(),
              title: "🛬 " + name,
              subtitle: "end",
              data: {
                store: formatDisplay(store.$id),
                action: formatDisplay(name),
                args,
                result
              },
              groupId
            }
          });
        });
        onError((error) => {
          activeAction = void 0;
          api.addTimelineEvent({
            layerId: MUTATIONS_LAYER_ID,
            event: {
              time: now2(),
              logType: "error",
              title: "💥 " + name,
              subtitle: "end",
              data: {
                store: formatDisplay(store.$id),
                action: formatDisplay(name),
                args,
                error
              },
              groupId
            }
          });
        });
      }, true);
      store._customProperties.forEach((name) => {
        vue.watch(() => vue.unref(store[name]), (newValue, oldValue) => {
          api.notifyComponentUpdate();
          api.sendInspectorState(INSPECTOR_ID);
          if (isTimelineActive) {
            api.addTimelineEvent({
              layerId: MUTATIONS_LAYER_ID,
              event: {
                time: now2(),
                title: "Change",
                subtitle: name,
                data: {
                  newValue,
                  oldValue
                },
                groupId: activeAction
              }
            });
          }
        }, { deep: true });
      });
      store.$subscribe(({ events, type }, state) => {
        api.notifyComponentUpdate();
        api.sendInspectorState(INSPECTOR_ID);
        if (!isTimelineActive)
          return;
        const eventData = {
          time: now2(),
          title: formatMutationType(type),
          data: assign$1({ store: formatDisplay(store.$id) }, formatEventData(events)),
          groupId: activeAction
        };
        if (type === MutationType.patchFunction) {
          eventData.subtitle = "⤵️";
        } else if (type === MutationType.patchObject) {
          eventData.subtitle = "🧩";
        } else if (events && !Array.isArray(events)) {
          eventData.subtitle = events.type;
        }
        if (events) {
          eventData.data["rawEvent(s)"] = {
            _custom: {
              display: "DebuggerEvent",
              type: "object",
              tooltip: "raw DebuggerEvent[]",
              value: events
            }
          };
        }
        api.addTimelineEvent({
          layerId: MUTATIONS_LAYER_ID,
          event: eventData
        });
      }, { detached: true, flush: "sync" });
      const hotUpdate = store._hotUpdate;
      store._hotUpdate = vue.markRaw((newStore) => {
        hotUpdate(newStore);
        api.addTimelineEvent({
          layerId: MUTATIONS_LAYER_ID,
          event: {
            time: now2(),
            title: "🔥 " + store.$id,
            subtitle: "HMR update",
            data: {
              store: formatDisplay(store.$id),
              info: formatDisplay(`HMR update`)
            }
          }
        });
        api.notifyComponentUpdate();
        api.sendInspectorTree(INSPECTOR_ID);
        api.sendInspectorState(INSPECTOR_ID);
      });
      const { $dispose } = store;
      store.$dispose = () => {
        $dispose();
        api.notifyComponentUpdate();
        api.sendInspectorTree(INSPECTOR_ID);
        api.sendInspectorState(INSPECTOR_ID);
        api.getSettings().logStoreChanges && toastMessage(`Disposed "${store.$id}" store 🗑`);
      };
      api.notifyComponentUpdate();
      api.sendInspectorTree(INSPECTOR_ID);
      api.sendInspectorState(INSPECTOR_ID);
      api.getSettings().logStoreChanges && toastMessage(`"${store.$id}" store installed 🆕`);
    });
  }
  let runningActionId = 0;
  let activeAction;
  function patchActionForGrouping(store, actionNames, wrapWithProxy) {
    const actions = actionNames.reduce((storeActions, actionName) => {
      storeActions[actionName] = vue.toRaw(store)[actionName];
      return storeActions;
    }, {});
    for (const actionName in actions) {
      store[actionName] = function() {
        const _actionId = runningActionId;
        const trackedStore = wrapWithProxy ? new Proxy(store, {
          get(...args) {
            activeAction = _actionId;
            return Reflect.get(...args);
          },
          set(...args) {
            activeAction = _actionId;
            return Reflect.set(...args);
          }
        }) : store;
        activeAction = _actionId;
        const retValue = actions[actionName].apply(trackedStore, arguments);
        activeAction = void 0;
        return retValue;
      };
    }
  }
  function devtoolsPlugin({ app, store, options }) {
    if (store.$id.startsWith("__hot:")) {
      return;
    }
    store._isOptionsAPI = !!options.state;
    patchActionForGrouping(store, Object.keys(options.actions), store._isOptionsAPI);
    const originalHotUpdate = store._hotUpdate;
    vue.toRaw(store)._hotUpdate = function(newStore) {
      originalHotUpdate.apply(this, arguments);
      patchActionForGrouping(store, Object.keys(newStore._hmrPayload.actions), !!store._isOptionsAPI);
    };
    addStoreToDevtools(
      app,
      // FIXME: is there a way to allow the assignment from Store<Id, S, G, A> to StoreGeneric?
      store
    );
  }
  function createPinia() {
    const scope = vue.effectScope(true);
    const state = scope.run(() => vue.ref({}));
    let _p = [];
    let toBeInstalled = [];
    const pinia = vue.markRaw({
      install(app) {
        setActivePinia(pinia);
        {
          pinia._a = app;
          app.provide(piniaSymbol, pinia);
          app.config.globalProperties.$pinia = pinia;
          if (USE_DEVTOOLS) {
            registerPiniaDevtools(app, pinia);
          }
          toBeInstalled.forEach((plugin) => _p.push(plugin));
          toBeInstalled = [];
        }
      },
      use(plugin) {
        if (!this._a && !isVue2) {
          toBeInstalled.push(plugin);
        } else {
          _p.push(plugin);
        }
        return this;
      },
      _p,
      // it's actually undefined here
      // @ts-expect-error
      _a: null,
      _e: scope,
      _s: /* @__PURE__ */ new Map(),
      state
    });
    if (USE_DEVTOOLS && typeof Proxy !== "undefined") {
      pinia.use(devtoolsPlugin);
    }
    return pinia;
  }
  const isUseStore = (fn) => {
    return typeof fn === "function" && typeof fn.$id === "string";
  };
  function patchObject(newState, oldState) {
    for (const key in oldState) {
      const subPatch = oldState[key];
      if (!(key in newState)) {
        continue;
      }
      const targetValue = newState[key];
      if (isPlainObject(targetValue) && isPlainObject(subPatch) && !vue.isRef(subPatch) && !vue.isReactive(subPatch)) {
        newState[key] = patchObject(targetValue, subPatch);
      } else {
        {
          newState[key] = subPatch;
        }
      }
    }
    return newState;
  }
  function acceptHMRUpdate(initialUseStore, hot) {
    return (newModule) => {
      const pinia = hot.data.pinia || initialUseStore._pinia;
      if (!pinia) {
        return;
      }
      hot.data.pinia = pinia;
      for (const exportName in newModule) {
        const useStore = newModule[exportName];
        if (isUseStore(useStore) && pinia._s.has(useStore.$id)) {
          const id = useStore.$id;
          if (id !== initialUseStore.$id) {
            console.warn(`The id of the store changed from "${initialUseStore.$id}" to "${id}". Reloading.`);
            return hot.invalidate();
          }
          const existingStore = pinia._s.get(id);
          if (!existingStore) {
            console.log(`[Pinia]: skipping hmr because store doesn't exist yet`);
            return;
          }
          useStore(pinia, existingStore);
        }
      }
    };
  }
  const noop = () => {
  };
  function addSubscription(subscriptions, callback, detached, onCleanup = noop) {
    subscriptions.push(callback);
    const removeSubscription = () => {
      const idx = subscriptions.indexOf(callback);
      if (idx > -1) {
        subscriptions.splice(idx, 1);
        onCleanup();
      }
    };
    if (!detached && vue.getCurrentScope()) {
      vue.onScopeDispose(removeSubscription);
    }
    return removeSubscription;
  }
  function triggerSubscriptions(subscriptions, ...args) {
    subscriptions.slice().forEach((callback) => {
      callback(...args);
    });
  }
  const fallbackRunWithContext = (fn) => fn();
  function mergeReactiveObjects(target, patchToApply) {
    if (target instanceof Map && patchToApply instanceof Map) {
      patchToApply.forEach((value, key) => target.set(key, value));
    }
    if (target instanceof Set && patchToApply instanceof Set) {
      patchToApply.forEach(target.add, target);
    }
    for (const key in patchToApply) {
      if (!patchToApply.hasOwnProperty(key))
        continue;
      const subPatch = patchToApply[key];
      const targetValue = target[key];
      if (isPlainObject(targetValue) && isPlainObject(subPatch) && target.hasOwnProperty(key) && !vue.isRef(subPatch) && !vue.isReactive(subPatch)) {
        target[key] = mergeReactiveObjects(targetValue, subPatch);
      } else {
        target[key] = subPatch;
      }
    }
    return target;
  }
  const skipHydrateSymbol = Symbol("pinia:skipHydration");
  function skipHydrate(obj) {
    return Object.defineProperty(obj, skipHydrateSymbol, {});
  }
  function shouldHydrate(obj) {
    return !isPlainObject(obj) || !obj.hasOwnProperty(skipHydrateSymbol);
  }
  const { assign } = Object;
  function isComputed(o) {
    return !!(vue.isRef(o) && o.effect);
  }
  function createOptionsStore(id, options, pinia, hot) {
    const { state, actions, getters } = options;
    const initialState = pinia.state.value[id];
    let store;
    function setup() {
      if (!initialState && !hot) {
        {
          pinia.state.value[id] = state ? state() : {};
        }
      }
      const localState = hot ? (
        // use ref() to unwrap refs inside state TODO: check if this is still necessary
        vue.toRefs(vue.ref(state ? state() : {}).value)
      ) : vue.toRefs(pinia.state.value[id]);
      return assign(localState, actions, Object.keys(getters || {}).reduce((computedGetters, name) => {
        if (name in localState) {
          console.warn(`[🍍]: A getter cannot have the same name as another state property. Rename one of them. Found with "${name}" in store "${id}".`);
        }
        computedGetters[name] = vue.markRaw(vue.computed(() => {
          setActivePinia(pinia);
          const store2 = pinia._s.get(id);
          return getters[name].call(store2, store2);
        }));
        return computedGetters;
      }, {}));
    }
    store = createSetupStore(id, setup, options, pinia, hot, true);
    return store;
  }
  function createSetupStore($id, setup, options = {}, pinia, hot, isOptionsStore) {
    let scope;
    const optionsForPlugin = assign({ actions: {} }, options);
    if (!pinia._e.active) {
      throw new Error("Pinia destroyed");
    }
    const $subscribeOptions = {
      deep: true
      // flush: 'post',
    };
    {
      $subscribeOptions.onTrigger = (event) => {
        if (isListening) {
          debuggerEvents = event;
        } else if (isListening == false && !store._hotUpdating) {
          if (Array.isArray(debuggerEvents)) {
            debuggerEvents.push(event);
          } else {
            console.error("🍍 debuggerEvents should be an array. This is most likely an internal Pinia bug.");
          }
        }
      };
    }
    let isListening;
    let isSyncListening;
    let subscriptions = [];
    let actionSubscriptions = [];
    let debuggerEvents;
    const initialState = pinia.state.value[$id];
    if (!isOptionsStore && !initialState && !hot) {
      {
        pinia.state.value[$id] = {};
      }
    }
    const hotState = vue.ref({});
    let activeListener;
    function $patch(partialStateOrMutator) {
      let subscriptionMutation;
      isListening = isSyncListening = false;
      {
        debuggerEvents = [];
      }
      if (typeof partialStateOrMutator === "function") {
        partialStateOrMutator(pinia.state.value[$id]);
        subscriptionMutation = {
          type: MutationType.patchFunction,
          storeId: $id,
          events: debuggerEvents
        };
      } else {
        mergeReactiveObjects(pinia.state.value[$id], partialStateOrMutator);
        subscriptionMutation = {
          type: MutationType.patchObject,
          payload: partialStateOrMutator,
          storeId: $id,
          events: debuggerEvents
        };
      }
      const myListenerId = activeListener = Symbol();
      vue.nextTick().then(() => {
        if (activeListener === myListenerId) {
          isListening = true;
        }
      });
      isSyncListening = true;
      triggerSubscriptions(subscriptions, subscriptionMutation, pinia.state.value[$id]);
    }
    const $reset = isOptionsStore ? function $reset2() {
      const { state } = options;
      const newState = state ? state() : {};
      this.$patch(($state) => {
        assign($state, newState);
      });
    } : (
      /* istanbul ignore next */
      () => {
        throw new Error(`🍍: Store "${$id}" is built using the setup syntax and does not implement $reset().`);
      }
    );
    function $dispose() {
      scope.stop();
      subscriptions = [];
      actionSubscriptions = [];
      pinia._s.delete($id);
    }
    function wrapAction(name, action) {
      return function() {
        setActivePinia(pinia);
        const args = Array.from(arguments);
        const afterCallbackList = [];
        const onErrorCallbackList = [];
        function after(callback) {
          afterCallbackList.push(callback);
        }
        function onError(callback) {
          onErrorCallbackList.push(callback);
        }
        triggerSubscriptions(actionSubscriptions, {
          args,
          name,
          store,
          after,
          onError
        });
        let ret;
        try {
          ret = action.apply(this && this.$id === $id ? this : store, args);
        } catch (error) {
          triggerSubscriptions(onErrorCallbackList, error);
          throw error;
        }
        if (ret instanceof Promise) {
          return ret.then((value) => {
            triggerSubscriptions(afterCallbackList, value);
            return value;
          }).catch((error) => {
            triggerSubscriptions(onErrorCallbackList, error);
            return Promise.reject(error);
          });
        }
        triggerSubscriptions(afterCallbackList, ret);
        return ret;
      };
    }
    const _hmrPayload = /* @__PURE__ */ vue.markRaw({
      actions: {},
      getters: {},
      state: [],
      hotState
    });
    const partialStore = {
      _p: pinia,
      // _s: scope,
      $id,
      $onAction: addSubscription.bind(null, actionSubscriptions),
      $patch,
      $reset,
      $subscribe(callback, options2 = {}) {
        const removeSubscription = addSubscription(subscriptions, callback, options2.detached, () => stopWatcher());
        const stopWatcher = scope.run(() => vue.watch(() => pinia.state.value[$id], (state) => {
          if (options2.flush === "sync" ? isSyncListening : isListening) {
            callback({
              storeId: $id,
              type: MutationType.direct,
              events: debuggerEvents
            }, state);
          }
        }, assign({}, $subscribeOptions, options2)));
        return removeSubscription;
      },
      $dispose
    };
    const store = vue.reactive(assign(
      {
        _hmrPayload,
        _customProperties: vue.markRaw(/* @__PURE__ */ new Set())
        // devtools custom properties
      },
      partialStore
      // must be added later
      // setupStore
    ));
    pinia._s.set($id, store);
    const runWithContext = pinia._a && pinia._a.runWithContext || fallbackRunWithContext;
    const setupStore = runWithContext(() => pinia._e.run(() => (scope = vue.effectScope()).run(setup)));
    for (const key in setupStore) {
      const prop = setupStore[key];
      if (vue.isRef(prop) && !isComputed(prop) || vue.isReactive(prop)) {
        if (hot) {
          set(hotState.value, key, vue.toRef(setupStore, key));
        } else if (!isOptionsStore) {
          if (initialState && shouldHydrate(prop)) {
            if (vue.isRef(prop)) {
              prop.value = initialState[key];
            } else {
              mergeReactiveObjects(prop, initialState[key]);
            }
          }
          {
            pinia.state.value[$id][key] = prop;
          }
        }
        {
          _hmrPayload.state.push(key);
        }
      } else if (typeof prop === "function") {
        const actionValue = hot ? prop : wrapAction(key, prop);
        {
          setupStore[key] = actionValue;
        }
        {
          _hmrPayload.actions[key] = prop;
        }
        optionsForPlugin.actions[key] = prop;
      } else {
        if (isComputed(prop)) {
          _hmrPayload.getters[key] = isOptionsStore ? (
            // @ts-expect-error
            options.getters[key]
          ) : prop;
          if (IS_CLIENT) {
            const getters = setupStore._getters || // @ts-expect-error: same
            (setupStore._getters = vue.markRaw([]));
            getters.push(key);
          }
        }
      }
    }
    {
      assign(store, setupStore);
      assign(vue.toRaw(store), setupStore);
    }
    Object.defineProperty(store, "$state", {
      get: () => hot ? hotState.value : pinia.state.value[$id],
      set: (state) => {
        if (hot) {
          throw new Error("cannot set hotState");
        }
        $patch(($state) => {
          assign($state, state);
        });
      }
    });
    {
      store._hotUpdate = vue.markRaw((newStore) => {
        store._hotUpdating = true;
        newStore._hmrPayload.state.forEach((stateKey) => {
          if (stateKey in store.$state) {
            const newStateTarget = newStore.$state[stateKey];
            const oldStateSource = store.$state[stateKey];
            if (typeof newStateTarget === "object" && isPlainObject(newStateTarget) && isPlainObject(oldStateSource)) {
              patchObject(newStateTarget, oldStateSource);
            } else {
              newStore.$state[stateKey] = oldStateSource;
            }
          }
          set(store, stateKey, vue.toRef(newStore.$state, stateKey));
        });
        Object.keys(store.$state).forEach((stateKey) => {
          if (!(stateKey in newStore.$state)) {
            del(store, stateKey);
          }
        });
        isListening = false;
        isSyncListening = false;
        pinia.state.value[$id] = vue.toRef(newStore._hmrPayload, "hotState");
        isSyncListening = true;
        vue.nextTick().then(() => {
          isListening = true;
        });
        for (const actionName in newStore._hmrPayload.actions) {
          const action = newStore[actionName];
          set(store, actionName, wrapAction(actionName, action));
        }
        for (const getterName in newStore._hmrPayload.getters) {
          const getter = newStore._hmrPayload.getters[getterName];
          const getterValue = isOptionsStore ? (
            // special handling of options api
            vue.computed(() => {
              setActivePinia(pinia);
              return getter.call(store, store);
            })
          ) : getter;
          set(store, getterName, getterValue);
        }
        Object.keys(store._hmrPayload.getters).forEach((key) => {
          if (!(key in newStore._hmrPayload.getters)) {
            del(store, key);
          }
        });
        Object.keys(store._hmrPayload.actions).forEach((key) => {
          if (!(key in newStore._hmrPayload.actions)) {
            del(store, key);
          }
        });
        store._hmrPayload = newStore._hmrPayload;
        store._getters = newStore._getters;
        store._hotUpdating = false;
      });
    }
    if (USE_DEVTOOLS) {
      const nonEnumerable = {
        writable: true,
        configurable: true,
        // avoid warning on devtools trying to display this property
        enumerable: false
      };
      ["_p", "_hmrPayload", "_getters", "_customProperties"].forEach((p) => {
        Object.defineProperty(store, p, assign({ value: store[p] }, nonEnumerable));
      });
    }
    pinia._p.forEach((extender) => {
      if (USE_DEVTOOLS) {
        const extensions = scope.run(() => extender({
          store,
          app: pinia._a,
          pinia,
          options: optionsForPlugin
        }));
        Object.keys(extensions || {}).forEach((key) => store._customProperties.add(key));
        assign(store, extensions);
      } else {
        assign(store, scope.run(() => extender({
          store,
          app: pinia._a,
          pinia,
          options: optionsForPlugin
        })));
      }
    });
    if (store.$state && typeof store.$state === "object" && typeof store.$state.constructor === "function" && !store.$state.constructor.toString().includes("[native code]")) {
      console.warn(`[🍍]: The "state" must be a plain object. It cannot be
	state: () => new MyClass()
Found in store "${store.$id}".`);
    }
    if (initialState && isOptionsStore && options.hydrate) {
      options.hydrate(store.$state, initialState);
    }
    isListening = true;
    isSyncListening = true;
    return store;
  }
  function defineStore(idOrOptions, setup, setupOptions) {
    let id;
    let options;
    const isSetupStore = typeof setup === "function";
    if (typeof idOrOptions === "string") {
      id = idOrOptions;
      options = isSetupStore ? setupOptions : setup;
    } else {
      options = idOrOptions;
      id = idOrOptions.id;
      if (typeof id !== "string") {
        throw new Error(`[🍍]: "defineStore()" must be passed a store id as its first argument.`);
      }
    }
    function useStore(pinia, hot) {
      const hasContext = vue.hasInjectionContext();
      pinia = // in test mode, ignore the argument provided as we can always retrieve a
      // pinia instance with getActivePinia()
      pinia || (hasContext ? vue.inject(piniaSymbol, null) : null);
      if (pinia)
        setActivePinia(pinia);
      if (!activePinia) {
        throw new Error(`[🍍]: "getActivePinia()" was called but there was no active Pinia. Are you trying to use a store before calling "app.use(pinia)"?
See https://pinia.vuejs.org/core-concepts/outside-component-usage.html for help.
This will fail in production.`);
      }
      pinia = activePinia;
      if (!pinia._s.has(id)) {
        if (isSetupStore) {
          createSetupStore(id, setup, options, pinia);
        } else {
          createOptionsStore(id, options, pinia);
        }
        {
          useStore._pinia = pinia;
        }
      }
      const store = pinia._s.get(id);
      if (hot) {
        const hotId = "__hot:" + id;
        const newStore = isSetupStore ? createSetupStore(hotId, setup, options, pinia, true) : createOptionsStore(hotId, assign({}, options), pinia, true);
        hot._hotUpdate(newStore);
        delete pinia.state.value[hotId];
        pinia._s.delete(hotId);
      }
      if (IS_CLIENT) {
        const currentInstance = vue.getCurrentInstance();
        if (currentInstance && currentInstance.proxy && // avoid adding stores that are just built for hot module replacement
        !hot) {
          const vm = currentInstance.proxy;
          const cache = "_pStores" in vm ? vm._pStores : vm._pStores = {};
          cache[id] = store;
        }
      }
      return store;
    }
    useStore.$id = id;
    return useStore;
  }
  let mapStoreSuffix = "Store";
  function setMapStoreSuffix(suffix) {
    mapStoreSuffix = suffix;
  }
  function mapStores(...stores) {
    if (Array.isArray(stores[0])) {
      console.warn(`[🍍]: Directly pass all stores to "mapStores()" without putting them in an array:
Replace
	mapStores([useAuthStore, useCartStore])
with
	mapStores(useAuthStore, useCartStore)
This will fail in production if not fixed.`);
      stores = stores[0];
    }
    return stores.reduce((reduced, useStore) => {
      reduced[useStore.$id + mapStoreSuffix] = function() {
        return useStore(this.$pinia);
      };
      return reduced;
    }, {});
  }
  function mapState(useStore, keysOrMapper) {
    return Array.isArray(keysOrMapper) ? keysOrMapper.reduce((reduced, key) => {
      reduced[key] = function() {
        return useStore(this.$pinia)[key];
      };
      return reduced;
    }, {}) : Object.keys(keysOrMapper).reduce((reduced, key) => {
      reduced[key] = function() {
        const store = useStore(this.$pinia);
        const storeKey = keysOrMapper[key];
        return typeof storeKey === "function" ? storeKey.call(this, store) : store[storeKey];
      };
      return reduced;
    }, {});
  }
  const mapGetters = mapState;
  function mapActions(useStore, keysOrMapper) {
    return Array.isArray(keysOrMapper) ? keysOrMapper.reduce((reduced, key) => {
      reduced[key] = function(...args) {
        return useStore(this.$pinia)[key](...args);
      };
      return reduced;
    }, {}) : Object.keys(keysOrMapper).reduce((reduced, key) => {
      reduced[key] = function(...args) {
        return useStore(this.$pinia)[keysOrMapper[key]](...args);
      };
      return reduced;
    }, {});
  }
  function mapWritableState(useStore, keysOrMapper) {
    return Array.isArray(keysOrMapper) ? keysOrMapper.reduce((reduced, key) => {
      reduced[key] = {
        get() {
          return useStore(this.$pinia)[key];
        },
        set(value) {
          return useStore(this.$pinia)[key] = value;
        }
      };
      return reduced;
    }, {}) : Object.keys(keysOrMapper).reduce((reduced, key) => {
      reduced[key] = {
        get() {
          return useStore(this.$pinia)[keysOrMapper[key]];
        },
        set(value) {
          return useStore(this.$pinia)[keysOrMapper[key]] = value;
        }
      };
      return reduced;
    }, {});
  }
  function storeToRefs(store) {
    {
      store = vue.toRaw(store);
      const refs = {};
      for (const key in store) {
        const value = store[key];
        if (vue.isRef(value) || vue.isReactive(value)) {
          refs[key] = // ---
          vue.toRef(store, key);
        }
      }
      return refs;
    }
  }
  const PiniaVuePlugin = function(_Vue) {
    _Vue.mixin({
      beforeCreate() {
        const options = this.$options;
        if (options.pinia) {
          const pinia = options.pinia;
          if (!this._provided) {
            const provideCache = {};
            Object.defineProperty(this, "_provided", {
              get: () => provideCache,
              set: (v) => Object.assign(provideCache, v)
            });
          }
          this._provided[piniaSymbol] = pinia;
          if (!this.$pinia) {
            this.$pinia = pinia;
          }
          pinia._a = this;
          if (IS_CLIENT) {
            setActivePinia(pinia);
          }
          if (USE_DEVTOOLS) {
            registerPiniaDevtools(pinia._a, pinia);
          }
        } else if (!this.$pinia && options.parent && options.parent.$pinia) {
          this.$pinia = options.parent.$pinia;
        }
      },
      destroyed() {
        delete this._pStores;
      }
    });
  };
  const Pinia = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    get MutationType() {
      return MutationType;
    },
    PiniaVuePlugin,
    acceptHMRUpdate,
    createPinia,
    defineStore,
    getActivePinia,
    mapActions,
    mapGetters,
    mapState,
    mapStores,
    mapWritableState,
    setActivePinia,
    setMapStoreSuffix,
    skipHydrate,
    storeToRefs
  }, Symbol.toStringTag, { value: "Module" }));
  const useCounterStore = defineStore("switchTab", {
    state: () => {
      return {
        currentTab: 0
      };
    },
    actions: {
      // getPage() {
      // 	// 获取当前页面的路径
      // 	const pages = getCurrentPages(); // 获取页面栈
      // 	if (pages.length > 0) {
      // 		const currentPage = pages[pages.length - 1]; // 获取当前页面
      // 		const currentPath = currentPage.route; // 获取当前页面的路径
      // 		if (currentPath == 'pages/index/index' || currentPath == '/') {
      // 			this.currentTab = 0
      // 			__f__('log','at store/switchTab.js:21','0');
      // 		} else if (currentPath == 'pages/shop/shop') {
      // 			this.currentTab = 2
      // 			__f__('log','at store/switchTab.js:24','2');
      // 		}
      // 	} else {
      // 		__f__('warn','at store/switchTab.js:27','No pages found in stack.');
      // 	}
      // }
    }
  });
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _sfc_main$8 = {
    name: "tabbar",
    data() {
      return {
        tabInfo: [
          {
            id: 1,
            icon: "http://sitcqmrpv.hn-bkt.clouddn.com/tabbatIcon/home.svg",
            icon_active: "http://sitcqmrpv.hn-bkt.clouddn.com/tabbatIcon/home_active.svg",
            url: "/pages/index/index",
            name: "首页"
          },
          {
            id: 2,
            icon: "http://sitcqmrpv.hn-bkt.clouddn.com/tabbatIcon/community.svg",
            icon_active: "http://sitcqmrpv.hn-bkt.clouddn.com/tabbatIcon/community_active.svg",
            url: "/pages/community/community",
            name: "社区"
          },
          {
            id: 3,
            icon: "http://sitcqmrpv.hn-bkt.clouddn.com/tabbatIcon/prays.svg",
            icon_active: "http://sitcqmrpv.hn-bkt.clouddn.com/tabbatIcon/prays_active.svg",
            url: "/pages/prays/prays",
            name: "祈福"
          },
          {
            id: 4,
            icon: "http://sitcqmrpv.hn-bkt.clouddn.com/tabbatIcon/shop.svg",
            icon_active: "http://sitcqmrpv.hn-bkt.clouddn.com/tabbatIcon/shop_active.svg",
            url: "/pages/shop/shop",
            name: "商城"
          },
          {
            id: 5,
            icon: "http://sitcqmrpv.hn-bkt.clouddn.com/tabbatIcon/mine.svg",
            icon_active: "http://sitcqmrpv.hn-bkt.clouddn.com/tabbatIcon/mine_active.svg",
            url: "/pages/mine/mine",
            name: "我的"
          }
        ],
        isIos: false
      };
    },
    mounted() {
      if (uni.getSystemInfoSync().platform == "ios" || uni.getSystemInfoSync().platform == "devtools") {
        this.isIos = true;
      }
    },
    computed: {
      currentTab() {
        return useCounterStore().$state.currentTab;
      }
    },
    methods: {
      clickTab(item) {
        useCounterStore().$state.currentTab = item.id - 1;
        uni.switchTab({
          url: item.url
        });
      }
    }
  };
  function _sfc_render$7(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: vue.normalizeClass(["content", { isIos: $data.isIos }])
      },
      [
        vue.createElementVNode("view", { class: "tabItem" }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($data.tabInfo, (item) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                class: vue.normalizeClass(["item", { active: $options.currentTab === item.id - 1 }]),
                key: item.id,
                onClick: ($event) => $options.clickTab(item)
              }, [
                vue.createElementVNode("image", {
                  src: $options.currentTab === item.id - 1 ? item.icon_active : item.icon,
                  mode: ""
                }, null, 8, ["src"]),
                vue.createElementVNode(
                  "view",
                  null,
                  vue.toDisplayString(item.name),
                  1
                  /* TEXT */
                )
              ], 10, ["onClick"]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ])
      ],
      2
      /* CLASS */
    );
  }
  const tabBar = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["render", _sfc_render$7], ["__scopeId", "data-v-e9b92a61"], ["__file", "C:/Users/jiaxi/Documents/HBuilderProjects/mazu/components/tabbar/tabbar.vue"]]);
  const _sfc_main$7 = {
    name: "title",
    data() {
      return {};
    },
    props: ["titleInfo"]
  };
  function _sfc_render$6(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      vue.Fragment,
      null,
      [
        $props.titleInfo.titleShow ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "content"
        }, [
          vue.createElementVNode("image", {
            src: $props.titleInfo.imageUrl,
            mode: "",
            style: vue.normalizeStyle(`margin-top:${$props.titleInfo.height}rpx`)
          }, null, 12, ["src"]),
          vue.createElementVNode(
            "view",
            { class: "" },
            vue.toDisplayString($props.titleInfo.title),
            1
            /* TEXT */
          )
        ])) : vue.createCommentVNode("v-if", true),
        vue.withDirectives(vue.createElementVNode(
          "view",
          { class: "fiexdHeader" },
          [
            vue.createElementVNode(
              "view",
              { class: "" },
              vue.toDisplayString($props.titleInfo.title),
              1
              /* TEXT */
            )
          ],
          512
          /* NEED_PATCH */
        ), [
          [vue.vShow, $props.titleInfo.heightShow]
        ])
      ],
      64
      /* STABLE_FRAGMENT */
    );
  }
  const pageBack = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["render", _sfc_render$6], ["__scopeId", "data-v-6526118c"], ["__file", "C:/Users/jiaxi/Documents/HBuilderProjects/mazu/components/title/title.vue"]]);
  const _imports_0 = "/assets/mask.98c5e259.png";
  const _sfc_main$6 = {
    data() {
      return {
        isShow: false,
        time: 5
      };
    },
    mounted() {
      this.isShow = true;
      this.autoClose();
    },
    methods: {
      closeMask() {
        this.isShow = false;
        this.$emit("close", true);
      },
      autoClose() {
        this.timer = setInterval(() => {
          this.time--;
          if (this.time === 0) {
            clearInterval(this.timer);
            this.isShow = false;
            this.$emit("close", true);
          }
        }, 1e3);
      }
    },
    beforeDestroy() {
      clearInterval(this.timer);
    }
  };
  function _sfc_render$5(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createBlock(vue.Transition, { name: "mask-transition" }, {
      default: vue.withCtx(() => [
        $data.isShow ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "content"
        }, [
          vue.createElementVNode("view", { class: "container" }, [
            vue.createElementVNode("image", {
              src: _imports_0,
              mode: "aspectFill"
            }),
            vue.createElementVNode(
              "view",
              {
                class: "btn",
                onClick: _cache[0] || (_cache[0] = (...args) => $options.closeMask && $options.closeMask(...args))
              },
              " 跳过(" + vue.toDisplayString($data.time) + "s) ",
              1
              /* TEXT */
            )
          ])
        ])) : vue.createCommentVNode("v-if", true)
      ]),
      _: 1
      /* STABLE */
    });
  }
  const maskPage = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["render", _sfc_render$5], ["__scopeId", "data-v-10056c54"], ["__file", "C:/Users/jiaxi/Documents/HBuilderProjects/mazu/components/mask/mask.vue"]]);
  const _sfc_main$5 = {
    data() {
      return {
        // 轮播图数据
        swiperData: [],
        // grid宫格数据
        gridData: [
          {
            id: 1,
            imageUrl: "http://sitcqmrpv.hn-bkt.clouddn.com/index/icon/new.svg",
            text: "新闻中心",
            url: ""
          },
          {
            id: 2,
            imageUrl: "http://sitcqmrpv.hn-bkt.clouddn.com/index/icon/fu.svg",
            text: "福文化",
            url: ""
          },
          {
            id: 3,
            imageUrl: "http://sitcqmrpv.hn-bkt.clouddn.com/index/icon/xin.svg",
            text: "信俗活动",
            url: ""
          },
          {
            id: 4,
            imageUrl: "http://sitcqmrpv.hn-bkt.clouddn.com/index/icon/ma.svg",
            text: "妈祖文化",
            url: ""
          },
          {
            id: 5,
            imageUrl: "http://sitcqmrpv.hn-bkt.clouddn.com/index/icon/miao.svg",
            text: "天下宫庙",
            url: ""
          },
          {
            id: 6,
            imageUrl: "http://sitcqmrpv.hn-bkt.clouddn.com/index/icon/shu.svg",
            text: "数字出版",
            url: ""
          },
          {
            id: 7,
            imageUrl: "http://sitcqmrpv.hn-bkt.clouddn.com/index/icon/wen.svg",
            text: "妈祖文创",
            url: ""
          },
          {
            id: 8,
            imageUrl: "http://sitcqmrpv.hn-bkt.clouddn.com/index/icon/you.svg",
            text: "两岸旅游",
            url: ""
          }
        ],
        // 妈祖动态数据
        news: [],
        // 文创作品数据
        creativity: [],
        // 瀑布流数据
        list: [],
        titleInfo: {
          titleShow: true,
          title: "福泽海韵",
          heightShow: false
        },
        isMaskLoaded: false
      };
    },
    components: {
      pageBack,
      tabBar,
      maskPage
    },
    onLoad() {
      getCarouselAPI().then((res) => {
        this.swiperData = res.message;
      }), // 获取动态数据
      getNewsAPI().then((res) => {
        this.news = res.message;
      }), // 获取文创作品数据
      getCreativityAPI().then((res) => {
        this.creativity = res.message;
      });
      getRecommendAPI().then((res) => {
        this.list = res.message;
      });
    },
    methods: {
      close() {
        this.isMaskLoaded = true;
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
  function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_maskPage = vue.resolveComponent("maskPage");
    const _component_pageBack = vue.resolveComponent("pageBack");
    const _component_tabBar = vue.resolveComponent("tabBar");
    return vue.openBlock(), vue.createElementBlock(
      vue.Fragment,
      null,
      [
        !$data.isMaskLoaded ? (vue.openBlock(), vue.createBlock(_component_maskPage, {
          key: 0,
          onClose: $options.close
        }, null, 8, ["onClose"])) : vue.createCommentVNode("v-if", true),
        $data.isMaskLoaded ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 1,
          class: "page"
        }, [
          vue.createVNode(_component_pageBack, { titleInfo: $data.titleInfo }, null, 8, ["titleInfo"]),
          vue.createElementVNode("view", { class: "content" }, [
            vue.createElementVNode("view", { class: "carousel" }, [
              vue.createElementVNode("swiper", {
                class: "carouselSwiper",
                autoplay: true,
                interval: 5e3,
                duration: 1e3
              }, [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList($data.swiperData, (item) => {
                    return vue.openBlock(), vue.createElementBlock("swiper-item", {
                      key: item.id
                    }, [
                      vue.createElementVNode("view", { class: "swiper-item" }, [
                        vue.createElementVNode("image", {
                          src: item.imageUrl,
                          mode: ""
                        }, null, 8, ["src"]),
                        vue.createElementVNode("view", { class: "gradient-overlay" })
                      ])
                    ]);
                  }),
                  128
                  /* KEYED_FRAGMENT */
                ))
              ])
            ]),
            vue.createElementVNode("view", { class: "container" }, [
              vue.createElementVNode("view", { class: "show" }, [
                vue.createElementVNode("image", {
                  style: { "position": "absolute", "height": "100%" },
                  src: "http://sitcqmrpv.hn-bkt.clouddn.com/index/indexShowBack.gif",
                  mode: ""
                }),
                vue.createElementVNode("view", { class: "showInfo" }, [
                  vue.createElementVNode("view", { class: "title" }, " 湄洲妈祖祖庙 "),
                  vue.createElementVNode("view", { class: "info" }, " 三亿妈祖敬仰者的精神明灯 ")
                ]),
                vue.createElementVNode("image", {
                  class: "backImage",
                  src: "http://sitcqmrpv.hn-bkt.clouddn.com/index/indexShowRight.png",
                  mode: ""
                }),
                vue.createElementVNode("view", { class: "showBottom" }, [
                  vue.createElementVNode("view", { class: "showLeft" }, [
                    vue.createElementVNode("image", {
                      src: "http://sitcqmrpv.hn-bkt.clouddn.com/index/tianhoumiao.png",
                      mode: ""
                    }),
                    vue.createElementVNode("text", null, "天后庙")
                  ]),
                  vue.createElementVNode("view", { class: "showRight" }, [
                    vue.createElementVNode("image", {
                      src: "http://sitcqmrpv.hn-bkt.clouddn.com/index/tianhougong.png",
                      mode: ""
                    }),
                    vue.createElementVNode("view", { class: "text" }, [
                      vue.createElementVNode("view", null, [
                        vue.createElementVNode("text", null, "天后宫")
                      ])
                    ])
                  ])
                ])
              ]),
              vue.createElementVNode("view", { class: "tabGrid" }, [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList($data.gridData, (item) => {
                    return vue.openBlock(), vue.createElementBlock("view", {
                      class: "item",
                      key: item.id
                    }, [
                      vue.createElementVNode("view", { class: "itemIamge" }, [
                        vue.createElementVNode("image", {
                          src: item.imageUrl,
                          mode: ""
                        }, null, 8, ["src"])
                      ]),
                      vue.createElementVNode(
                        "view",
                        { class: "itemText" },
                        vue.toDisplayString(item.text),
                        1
                        /* TEXT */
                      )
                    ]);
                  }),
                  128
                  /* KEYED_FRAGMENT */
                ))
              ]),
              vue.createElementVNode("view", { class: "mazuDynamics" }, [
                vue.createElementVNode("view", { class: "moreContentTop" }, [
                  vue.createElementVNode("view", { class: "title" }, [
                    vue.createElementVNode("text", { class: "titleFirst" }, "妈祖动态"),
                    vue.createElementVNode("text", { class: "titleSecond" }, "Mazu News")
                  ]),
                  vue.createElementVNode("view", { class: "more" }, " 更多 ")
                ]),
                vue.createElementVNode("view", { class: "mazuDynamics-bottom" }, [
                  vue.createElementVNode("view", null, [
                    vue.createElementVNode(
                      "scroll-view",
                      {
                        class: "scroll-view_H",
                        "scroll-x": "true",
                        onScroll: _cache[0] || (_cache[0] = (...args) => _ctx.scroll && _ctx.scroll(...args)),
                        "scroll-with-animation": "false"
                      },
                      [
                        (vue.openBlock(true), vue.createElementBlock(
                          vue.Fragment,
                          null,
                          vue.renderList($data.news, (item, index) => {
                            return vue.openBlock(), vue.createElementBlock("view", { class: "scroll-view-item_H" }, [
                              vue.createElementVNode("image", {
                                src: item.imageUrl,
                                mode: ""
                              }, null, 8, ["src"]),
                              vue.createElementVNode(
                                "view",
                                { class: "itemInfoText" },
                                vue.toDisplayString(item.text),
                                1
                                /* TEXT */
                              )
                            ]);
                          }),
                          256
                          /* UNKEYED_FRAGMENT */
                        ))
                      ],
                      32
                      /* NEED_HYDRATION */
                    )
                  ])
                ])
              ]),
              vue.createElementVNode("view", { class: "mazuCulturalcreativity" }, [
                vue.createElementVNode("view", { class: "moreContentTop" }, [
                  vue.createElementVNode("view", { class: "title" }, [
                    vue.createElementVNode("text", { class: "titleFirst" }, "文创作品"),
                    vue.createElementVNode("text", { class: "titleSecond" }, "Mazu Creativity")
                  ]),
                  vue.createElementVNode("view", { class: "more" }, " 更多 ")
                ]),
                vue.createElementVNode("view", { class: "mazuCulturalcreativity-bottom" }, [
                  vue.createElementVNode("view", null, [
                    vue.createElementVNode(
                      "scroll-view",
                      {
                        class: "scroll-view_H",
                        "scroll-x": "true",
                        onScroll: _cache[1] || (_cache[1] = (...args) => _ctx.scroll && _ctx.scroll(...args)),
                        "scroll-with-animation": "false"
                      },
                      [
                        (vue.openBlock(true), vue.createElementBlock(
                          vue.Fragment,
                          null,
                          vue.renderList($data.creativity, (item, index) => {
                            return vue.openBlock(), vue.createElementBlock("view", { class: "scroll-view-item_H" }, [
                              vue.createElementVNode("image", {
                                src: item.imageUrl,
                                mode: ""
                              }, null, 8, ["src"]),
                              vue.createElementVNode("view", { class: "itemInfoText" }, [
                                vue.createElementVNode(
                                  "view",
                                  null,
                                  vue.toDisplayString(item.text),
                                  1
                                  /* TEXT */
                                ),
                                vue.createElementVNode(
                                  "view",
                                  null,
                                  vue.toDisplayString(item.award),
                                  1
                                  /* TEXT */
                                )
                              ])
                            ]);
                          }),
                          256
                          /* UNKEYED_FRAGMENT */
                        ))
                      ],
                      32
                      /* NEED_HYDRATION */
                    )
                  ])
                ])
              ]),
              vue.createCommentVNode(" ========================================= 精彩推荐 ========================================== "),
              vue.createElementVNode("view", { class: "mazuCulturalcreativity" }, [
                vue.createElementVNode("view", { class: "moreContentTop" }, [
                  vue.createElementVNode("view", { class: "title" }, [
                    vue.createElementVNode("text", { class: "titleFirst" }, "精彩推荐"),
                    vue.createElementVNode("text", { class: "titleSecond" }, "Recommendation")
                  ])
                ]),
                vue.createElementVNode("view", { class: "recommend" }, [
                  vue.createElementVNode("view", { class: "pubuBox" }, [
                    vue.createElementVNode("view", { class: "pubuItem" }, [
                      (vue.openBlock(true), vue.createElementBlock(
                        vue.Fragment,
                        null,
                        vue.renderList($data.list, (item, index) => {
                          return vue.openBlock(), vue.createElementBlock("view", {
                            class: "item-masonry",
                            key: index
                          }, [
                            vue.createElementVNode("image", {
                              src: item.imageUrl,
                              mode: "widthFix"
                            }, null, 8, ["src"]),
                            vue.createElementVNode("view", { class: "listtitle" }, [
                              vue.createCommentVNode(" 这是没有高度的父盒子（下半部分） "),
                              vue.createElementVNode(
                                "view",
                                { class: "listtitle2" },
                                vue.toDisplayString(item.text),
                                1
                                /* TEXT */
                              ),
                              vue.createElementVNode(
                                "view",
                                { class: "listtitle3" },
                                vue.toDisplayString(item.name),
                                1
                                /* TEXT */
                              )
                            ])
                          ]);
                        }),
                        128
                        /* KEYED_FRAGMENT */
                      ))
                    ])
                  ])
                ])
              ])
            ])
          ]),
          vue.createVNode(_component_tabBar)
        ])) : vue.createCommentVNode("v-if", true)
      ],
      64
      /* STABLE_FRAGMENT */
    );
  }
  const PagesIndexIndex = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["render", _sfc_render$4], ["__scopeId", "data-v-1cf27b2a"], ["__file", "C:/Users/jiaxi/Documents/HBuilderProjects/mazu/pages/index/index.vue"]]);
  const _sfc_main$4 = {
    data() {
      return {
        titleInfo: {
          titleShow: true,
          title: "祈福",
          imageUrl: "http://sitcqmrpv.hn-bkt.clouddn.com/pageBack/3.webp",
          heightShow: false
        }
      };
    },
    components: {
      // pageBack,
      tabBar
    },
    onShow() {
      this.friendShake();
    },
    methods: {
      friendShake() {
        uni.onAccelerometerChange(async (res) => {
          if (Math.abs(res.x) > 30 || Math.abs(res.y) > 30 || Math.abs(res.z) > 30) {
            uni.switchTab({
              url: "/pages/index/index"
            });
          }
        });
      }
    }
    // onPageScroll(e) {
    // 	if (e.scrollTop >= 80) {
    // 		this.titleInfo.heightShow = true
    // 	}
    // 	if (e.scrollTop < 80) {
    // 		this.titleInfo.heightShow = false
    // 	}
    // },
  };
  function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_tabBar = vue.resolveComponent("tabBar");
    return vue.openBlock(), vue.createElementBlock(
      vue.Fragment,
      null,
      [
        vue.createCommentVNode(' <pageBack :titleInfo="titleInfo"></pageBack> '),
        vue.createElementVNode("view", { class: "content" }, [
          vue.createElementVNode("view", { class: "container" }, [
            vue.createElementVNode("image", {
              class: "backImage",
              src: "/static/mazuback.jpg",
              mode: "aspectFill"
            }),
            vue.createElementVNode("view", { class: "zhangYiNa" }, [
              vue.createElementVNode("image", {
                class: "qian",
                src: "/static/qian.png",
                mode: "aspectFit"
              })
            ]),
            vue.createElementVNode("view", { class: "share" }, " 摇一摇 求好签 ")
          ])
        ]),
        vue.createVNode(_component_tabBar)
      ],
      64
      /* STABLE_FRAGMENT */
    );
  }
  const PagesPraysPrays = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$3], ["__scopeId", "data-v-78a6de5a"], ["__file", "C:/Users/jiaxi/Documents/HBuilderProjects/mazu/pages/prays/prays.vue"]]);
  const _sfc_main$3 = {
    data() {
      return {
        titleInfo: {
          titleShow: true,
          title: "商城",
          imageUrl: "http://sitcqmrpv.hn-bkt.clouddn.com/pageBack/1.webp",
          heightShow: false
        },
        list: [
          {
            imageUrl: "/static/shop/zhufu1.jpg",
            text: "妈祖，信仰届天花板！谁能拒绝妈祖的祝福啊",
            price: "39.00"
          },
          {
            imageUrl: "/static/shop/denglong1.jpg",
            text: "湄洲岛·妈祖·传统平安灯笼",
            price: "69.00"
          },
          {
            imageUrl: "/static/shop/guashi1.jpg",
            text: "神明保佑之挂饰",
            price: "49.00"
          },
          {
            imageUrl: "/static/shop/shoulian1.jpg",
            text: "神明保佑之手链",
            price: "49.00"
          },
          {
            imageUrl: "/static/shop/fu1.jpg",
            text: "‼️‼️来了来了，妈祖这次是真来了‼️‼️",
            price: "99.00"
          },
          {
            imageUrl: "/static/shop/xiangce1.jpg",
            text: "妈祖文创·祈福拜拜",
            price: "89.00"
          }
        ]
      };
    },
    components: {
      pageBack,
      tabBar
    },
    methods: {},
    onPageScroll(e) {
      if (e.scrollTop >= 80) {
        this.titleInfo.heightShow = true;
      }
      if (e.scrollTop < 80) {
        this.titleInfo.heightShow = false;
      }
    }
  };
  function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_pageBack = vue.resolveComponent("pageBack");
    const _component_tabBar = vue.resolveComponent("tabBar");
    return vue.openBlock(), vue.createElementBlock(
      vue.Fragment,
      null,
      [
        vue.createVNode(_component_pageBack, { titleInfo: $data.titleInfo }, null, 8, ["titleInfo"]),
        vue.createElementVNode("view", { class: "content" }, [
          vue.createElementVNode("view", { class: "container" }, [
            vue.createCommentVNode(" ceshi "),
            vue.createElementVNode("view", { class: "shopName" }, [
              vue.createElementVNode("view", { class: "shopTitle" }, " 妈祖周边文创 "),
              vue.createElementVNode("view", { class: "shopEngTitle" }, " Cultural around Mazu ")
            ]),
            vue.createElementVNode("view", { class: "input" }, [
              vue.createElementVNode("input", { type: "text" }),
              vue.createElementVNode("image", {
                src: "/static/shop/search.png",
                mode: ""
              })
            ]),
            vue.createElementVNode("view", { class: "recommend" }, [
              vue.createElementVNode("view", { class: "active" }, " 全部 "),
              vue.createElementVNode("view", { class: "" }, " 手链 "),
              vue.createElementVNode("view", { class: "" }, " 项链 "),
              vue.createElementVNode("view", { class: "" }, " 陶瓷 "),
              vue.createElementVNode("view", { class: "" }, " 鞋服 ")
            ]),
            vue.createElementVNode("swiper", {
              style: { "height": "370rpx", "margin-bottom": "40rpx" },
              autoplay: true,
              interval: 5e3,
              duration: 400
            }, [
              (vue.openBlock(), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList(2, (item) => {
                  return vue.createElementVNode("swiper-item", {
                    key: item.id
                  }, [
                    vue.createElementVNode("view", { class: "recommendItem" }, [
                      vue.createElementVNode("view", { class: "item" }, [
                        vue.createElementVNode("view", { class: "itemImage" }, [
                          vue.createElementVNode("image", {
                            src: "/static/1.png",
                            mode: ""
                          })
                        ]),
                        vue.createElementVNode("view", { class: "itemText" }, [
                          vue.createElementVNode("view", { class: "title" }, " 超级大宝贝 "),
                          vue.createElementVNode("view", { class: "info" }, " 超级大宝贝不需要介绍 爱买买不买拉倒 "),
                          vue.createElementVNode("view", { class: "price" }, [
                            vue.createElementVNode("view", { class: "left" }, [
                              vue.createElementVNode("text", null, "￥"),
                              vue.createTextVNode("4389.00 ")
                            ]),
                            vue.createElementVNode("view", { class: "right" }, " 购买 ")
                          ])
                        ])
                      ])
                    ])
                  ]);
                }),
                64
                /* STABLE_FRAGMENT */
              ))
            ]),
            vue.createCommentVNode(" ceshi "),
            vue.createElementVNode("view", { class: "shop" }, [
              vue.createElementVNode("view", { class: "pubuBox" }, [
                vue.createElementVNode("view", { class: "pubuItem" }, [
                  (vue.openBlock(true), vue.createElementBlock(
                    vue.Fragment,
                    null,
                    vue.renderList($data.list, (item, index) => {
                      return vue.openBlock(), vue.createElementBlock("view", {
                        class: "item-masonry",
                        key: index
                      }, [
                        vue.createElementVNode("image", {
                          src: item.imageUrl,
                          mode: "widthFix"
                        }, null, 8, ["src"]),
                        vue.createElementVNode("view", { class: "listtitle" }, [
                          vue.createCommentVNode(" 这是没有高度的父盒子（下半部分） "),
                          vue.createElementVNode(
                            "view",
                            { class: "listtitle2" },
                            vue.toDisplayString(item.text),
                            1
                            /* TEXT */
                          ),
                          vue.createElementVNode("view", { class: "listtitle3" }, [
                            vue.createElementVNode("text", null, "￥"),
                            vue.createTextVNode(
                              vue.toDisplayString(item.price),
                              1
                              /* TEXT */
                            )
                          ])
                        ])
                      ]);
                    }),
                    128
                    /* KEYED_FRAGMENT */
                  ))
                ])
              ])
            ])
          ])
        ]),
        vue.createVNode(_component_tabBar)
      ],
      64
      /* STABLE_FRAGMENT */
    );
  }
  const PagesShopShop = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$2], ["__scopeId", "data-v-2a6aaf81"], ["__file", "C:/Users/jiaxi/Documents/HBuilderProjects/mazu/pages/shop/shop.vue"]]);
  const _sfc_main$2 = {
    data() {
      return {
        titleInfo: {
          titleShow: true,
          title: "社区",
          imageUrl: "http://sitcqmrpv.hn-bkt.clouddn.com/pageBack/4.jpg",
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
        list: []
      };
    },
    onLoad() {
      getRecommendAPI().then((res) => {
        this.list = res.message;
      });
    },
    components: {
      pageBack,
      tabBar
    },
    methods: {},
    computed: {
      groupedRecommend() {
        const groups = [];
        for (let i = 0; i < this.recommend.length; i += 2) {
          groups.push([this.recommend[i], this.recommend[i + 1]]);
        }
        return groups;
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
  function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_pageBack = vue.resolveComponent("pageBack");
    const _component_tabBar = vue.resolveComponent("tabBar");
    return vue.openBlock(), vue.createElementBlock(
      vue.Fragment,
      null,
      [
        vue.createVNode(_component_pageBack, { titleInfo: $data.titleInfo }, null, 8, ["titleInfo"]),
        vue.createElementVNode("view", { class: "content" }, [
          vue.createElementVNode("view", { class: "inputBox" }, [
            vue.createElementVNode("view", { class: "input" }, [
              vue.createElementVNode("input", { type: "text" }),
              vue.createElementVNode("image", {
                src: "/static/shop/search.png",
                mode: ""
              })
            ]),
            vue.createElementVNode("view", { class: "add" }, " + ")
          ]),
          vue.createElementVNode("view", { class: "container" }, [
            vue.createElementVNode("swiper", {
              interval: 5e3,
              duration: 300
            }, [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($options.groupedRecommend, (item, index) => {
                  return vue.openBlock(), vue.createElementBlock("swiper-item", {
                    key: item.id
                  }, [
                    vue.createElementVNode("view", { class: "recommend" }, [
                      (vue.openBlock(true), vue.createElementBlock(
                        vue.Fragment,
                        null,
                        vue.renderList(item, (list) => {
                          return vue.openBlock(), vue.createElementBlock("view", null, [
                            list ? (vue.openBlock(), vue.createElementBlock("view", {
                              key: 0,
                              class: "item"
                            }, [
                              vue.createElementVNode("view", { class: "itemTop" }, [
                                vue.createElementVNode("view", { class: "itemHeader" }, [
                                  vue.createElementVNode("image", {
                                    src: list.imageUrl,
                                    mode: ""
                                  }, null, 8, ["src"])
                                ]),
                                vue.createElementVNode(
                                  "view",
                                  { class: "itemTitle" },
                                  vue.toDisplayString(list.title),
                                  1
                                  /* TEXT */
                                )
                              ]),
                              vue.createElementVNode("view", { class: "itemBottom" }, [
                                vue.createElementVNode(
                                  "view",
                                  { class: "textTitle" },
                                  ' "' + vue.toDisplayString(list.text) + '" ',
                                  1
                                  /* TEXT */
                                ),
                                vue.createElementVNode(
                                  "view",
                                  { class: "people" },
                                  vue.toDisplayString(list.people) + "人参与讨论 ",
                                  1
                                  /* TEXT */
                                )
                              ])
                            ])) : vue.createCommentVNode("v-if", true)
                          ]);
                        }),
                        256
                        /* UNKEYED_FRAGMENT */
                      ))
                    ])
                  ]);
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ]),
            vue.createElementVNode("view", { class: "communityContent" }, [
              vue.createElementVNode("view", { class: "hotTopic" }, [
                vue.createElementVNode("view", { class: "topicContent" }, [
                  vue.createElementVNode("view", { class: "topicTitle" }, [
                    vue.createCommentVNode(" 热门话题 "),
                    vue.createTextVNode(" 话题推荐 ")
                  ]),
                  vue.createElementVNode("view", { class: "topicContent" }, [
                    (vue.openBlock(), vue.createElementBlock(
                      vue.Fragment,
                      null,
                      vue.renderList(4, (item, index) => {
                        return vue.createElementVNode("view", { class: "topicItem" }, [
                          vue.createElementVNode("image", {
                            src: `../../static/community/序号${index + 1}.svg`,
                            mode: ""
                          }, null, 8, ["src"]),
                          vue.createElementVNode("view", { class: "text" }, [
                            vue.createElementVNode("view", { class: "textContent" }, [
                              vue.createElementVNode("view", null, " #什么是非遗 "),
                              vue.createElementVNode("view", { class: "info" }, " 38383人参与讨论·900条内容 ")
                            ]),
                            vue.createElementVNode("view", { class: "more" })
                          ])
                        ]);
                      }),
                      64
                      /* STABLE_FRAGMENT */
                    ))
                  ])
                ])
              ]),
              vue.createElementVNode("view", { class: "contentGrid" }, [
                vue.createElementVNode("view", { class: "refresh" }, [
                  vue.createElementVNode("view", null, " 看看大家的圈子吧~ "),
                  vue.createElementVNode("view", null, [
                    vue.createElementVNode("image", {
                      src: "/static/community/刷新.svg",
                      mode: ""
                    })
                  ])
                ]),
                vue.createElementVNode("view", { class: "" }, [
                  vue.createElementVNode("view", { class: "recommend" }, [
                    vue.createElementVNode("view", { class: "pubuBox" }, [
                      vue.createElementVNode("view", { class: "pubuItem" }, [
                        (vue.openBlock(true), vue.createElementBlock(
                          vue.Fragment,
                          null,
                          vue.renderList($data.list, (item, index) => {
                            return vue.openBlock(), vue.createElementBlock("view", {
                              class: "item-masonry",
                              key: index
                            }, [
                              vue.createElementVNode("image", {
                                src: item.imageUrl,
                                mode: "widthFix"
                              }, null, 8, ["src"]),
                              vue.createElementVNode("view", { class: "listtitle" }, [
                                vue.createCommentVNode(" 这是没有高度的父盒子（下半部分） "),
                                vue.createElementVNode(
                                  "view",
                                  { class: "listtitle2" },
                                  vue.toDisplayString(item.text),
                                  1
                                  /* TEXT */
                                ),
                                vue.createElementVNode(
                                  "view",
                                  { class: "listtitle3" },
                                  vue.toDisplayString(item.name),
                                  1
                                  /* TEXT */
                                )
                              ])
                            ]);
                          }),
                          128
                          /* KEYED_FRAGMENT */
                        ))
                      ])
                    ])
                  ])
                ])
              ])
            ])
          ])
        ]),
        vue.createVNode(_component_tabBar)
      ],
      64
      /* STABLE_FRAGMENT */
    );
  }
  const PagesCommunityCommunity = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$1], ["__scopeId", "data-v-a6ef5318"], ["__file", "C:/Users/jiaxi/Documents/HBuilderProjects/mazu/pages/community/community.vue"]]);
  const _sfc_main$1 = {
    data() {
      return {
        titleInfo: {
          titleShow: true,
          title: "我的",
          imageUrl: "http://sitcqmrpv.hn-bkt.clouddn.com/pageBack/2.webp",
          heightShow: false,
          height: 100
        }
      };
    },
    components: {
      pageBack,
      tabBar
    },
    methods: {},
    onPageScroll(e) {
      if (e.scrollTop >= 80) {
        this.titleInfo.heightShow = true;
      }
      if (e.scrollTop < 80) {
        this.titleInfo.heightShow = false;
      }
    }
  };
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_pageBack = vue.resolveComponent("pageBack");
    const _component_tabBar = vue.resolveComponent("tabBar");
    return vue.openBlock(), vue.createElementBlock(
      vue.Fragment,
      null,
      [
        vue.createVNode(_component_pageBack, { titleInfo: $data.titleInfo }, null, 8, ["titleInfo"]),
        vue.createElementVNode("view", { class: "content" }, [
          vue.createElementVNode("view", { class: "container" }, [
            vue.createElementVNode("view", { class: "userInfo" }, [
              vue.createElementVNode("view", { class: "userHeader" }, [
                vue.createElementVNode("view", { class: "headerLeft" }, [
                  vue.createElementVNode("image", {
                    src: "/static/shop/zhufu1.jpg",
                    mode: ""
                  }),
                  vue.createElementVNode("view", { class: "name" }, [
                    vue.createElementVNode("view", null, " 微信用户 "),
                    vue.createElementVNode("view", null, " 已连续签到1天 ")
                  ])
                ]),
                vue.createElementVNode("view", { class: "headerRight" }, " 立即签到 ")
              ])
            ]),
            vue.createElementVNode("view", { class: "set" }, [
              vue.createElementVNode("view", { class: "item" }, [
                vue.createElementVNode("view", { class: "itemLeft" }, [
                  vue.createElementVNode("image", {
                    src: "/static/mine/order.svg",
                    mode: ""
                  }),
                  vue.createTextVNode(" 我的订单 ")
                ]),
                vue.createElementVNode("view", { class: "itemRight" })
              ]),
              vue.createElementVNode("view", { class: "item" }, [
                vue.createElementVNode("view", { class: "itemLeft" }, [
                  vue.createElementVNode("image", {
                    src: "/static/mine/history.svg",
                    mode: ""
                  }),
                  vue.createTextVNode(" 游览历史 ")
                ]),
                vue.createElementVNode("view", { class: "itemRight" })
              ]),
              vue.createElementVNode("view", { class: "item" }, [
                vue.createElementVNode("view", { class: "itemLeft" }, [
                  vue.createElementVNode("image", {
                    src: "/static/mine/set.svg",
                    mode: ""
                  }),
                  vue.createTextVNode(" 账户设置 ")
                ]),
                vue.createElementVNode("view", { class: "itemRight" })
              ])
            ])
          ])
        ]),
        vue.createVNode(_component_tabBar)
      ],
      64
      /* STABLE_FRAGMENT */
    );
  }
  const PagesMineMine = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render], ["__scopeId", "data-v-7c2ebfa5"], ["__file", "C:/Users/jiaxi/Documents/HBuilderProjects/mazu/pages/mine/mine.vue"]]);
  __definePage("pages/index/index", PagesIndexIndex);
  __definePage("pages/prays/prays", PagesPraysPrays);
  __definePage("pages/shop/shop", PagesShopShop);
  __definePage("pages/community/community", PagesCommunityCommunity);
  __definePage("pages/mine/mine", PagesMineMine);
  const _sfc_main = {
    onLoad() {
      uni.hideTabBar();
    },
    onShow() {
      setTimeout(() => {
        uni.hideTabBar();
      }, 100);
    }
  };
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__file", "C:/Users/jiaxi/Documents/HBuilderProjects/mazu/App.vue"]]);
  function createApp() {
    const app = vue.createVueApp(App);
    app.use(createPinia());
    return {
      app,
      Pinia
    };
  }
  const { app: __app__, Vuex: __Vuex__, Pinia: __Pinia__ } = createApp();
  uni.Vuex = __Vuex__;
  uni.Pinia = __Pinia__;
  __app__.provide("__globalStyles", __uniConfig.styles);
  __app__._component.mpType = "app";
  __app__._component.render = () => {
  };
  __app__.mount("#app");
})(Vue);
