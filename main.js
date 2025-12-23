import App from './App'

// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
	...App
})
app.$mount()
// #endif

// #ifdef VUE3
import {
	createSSRApp,
} from 'vue'
import * as Pinia from 'pinia';
import "@/utils/interceptor.js"
// import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

export function createApp() {
	const app = createSSRApp(App)
	// 使用pinia
	const pinia = Pinia.createPinia()
	// pinia.use(piniaPluginPersistedstate);
	app.use(pinia);
	return {
		app,
		Pinia
	}
}
// #endif