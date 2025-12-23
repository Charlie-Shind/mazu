// store/userInfo.js
import {
	defineStore
} from 'pinia';

export const useUserInfoStore = defineStore('userInfo', {
	state: () => {
		return {
			userInfo: {}
		};
	},
	actions: {
		
	},
	// uniapp方式持久化
	persist: {
		storage: {
			getItem: uni.getStorageSync,
			setItem: uni.setStorageSync
		}
	}
})