// stores/switchTab.js
import {
	defineStore
} from 'pinia';

export const useCounterStore = defineStore('switchTab', {
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
		// 			console.log('0');
		// 		} else if (currentPath == 'pages/shop/shop') {
		// 			this.currentTab = 2
		// 			console.log('2');
		// 		}
		// 	} else {
		// 		console.warn('No pages found in stack.');
		// 	}
		// }
	},
});