import { ref } from 'vue';
import { defineStore } from 'pinia';
import type { API } from '@/api/typings.d.ts';
import { getLoginUserUsingGet } from '@/api/userController';
import { UserRoleEnum } from '@/enums/UserRoleEnum';

export const userLoginUserStore = defineStore('counter', () => {
	const loginUser = ref<API.LoginUserVO>({
		userName: 'no login',
	});

	async function asyncLogin() {
		const loginUserUsingGet = getLoginUserUsingGet();
		return loginUserUsingGet
			.then(response => {
				loginUser.value = response.data;
				return Promise.resolve(true);
			})
			.catch(() => {
				loginUser.value = { userRole: UserRoleEnum.ANONYMOUS };
				return Promise.reject(false);
			});
	}


	function setLoginUser(user: API.LoginUserVO) {
		loginUser.value = user;
	}

	async function login() {
		try {
			const { data } = await getLoginUserUsingGet();
			loginUser.value = data;
		} catch (e) {
			loginUser.value = { userRole: UserRoleEnum.ANONYMOUS };
		}
	}

	return { loginUser, setLoginUser,asyncLogin, login };
});
