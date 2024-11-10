import { ref } from 'vue';
import { defineStore } from 'pinia';
import type { API } from '@/api/typings.d.ts';
import { getLoginUserUsingGet, userLoginUsingPost, userLogoutUsingPost } from '@/api/userController';

export const userLoginUserStore = defineStore('counter', () => {
	const loginUser = ref<API.LoginUserVO>({
		userName: 'no login',
	});
	let isLogin :boolean= false;

	async function login(account: string, password: string) {
		if (!(account && password)) {
			return Promise.reject('账号或密码不能为空');
		}
		return userLoginUsingPost({ userAccount: account, userPassword: password }).then(response => {
			if (response.data.code === 0) {
				loginUser.value = response.data.data;
				isLogin = true;
				return true;
			} else {
				return Promise.reject(response.data.message);
			}
		});
	}

	async function logout() {
		userLogoutUsingPost().then(response => {
			if (response.data.code === 0 && response.data.data) {
				loginUser.value = {
					userName: 'no login',
				};
				isLogin = false;
			}
		});
	}

	async function loginWithToken() {
		getLoginUserUsingGet().then(response => {
			if (response.data.code === 0) {
				loginUser.value = response.data.data;
				isLogin = true;
			}
		});
	}

	function checkLogin() {
		return isLogin;
	}

	return { loginUser, login, checkLogin,loginWithToken, logout };
});
