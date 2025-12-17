import { createApp } from "vue";
// 引入elementplus
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import App from "./App.vue";
import { router } from "./router";
import store from "./store";
// 引入elementplus的icon
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
// 引入 echarts
import * as echarts from 'echarts'

const app = createApp(App);
app.use(store);
app.use(router);
app.use(ElementPlus);
app.config.globalProperties.$echarts = echarts

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
import "virtual:windi.css";

import "./permission";

import "nprogress/nprogress.css";

app.mount("#app");
