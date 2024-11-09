import { createRouter, createWebHistory } from 'vue-router';
import { userLoginUserStore } from '@/stores/loginUser';
import { routes } from '@/router/routes';
import {checkAuthorization} from '@/utils/Authorization';
import { UserRoleEnum } from '@/enums/UserRoleEnum';

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes,
});

router.beforeEach(async (to, from, next) => {
	// 获取当前登录用户
	const loginUserStore = userLoginUserStore();
	let loginUser = loginUserStore.loginUser;
	if (!loginUser || !loginUser.userRole) {
		await loginUserStore.login();
	}
	loginUser = loginUserStore.loginUser;

	// 获取当前页面需要的访问权限
	const access = to.meta?.roleNeed ?? UserRoleEnum.ANONYMOUS;
	// 判断该用户是否需要登录
	if (access !== UserRoleEnum.ANONYMOUS) {
		// 判断该用户是否登录
		if (loginUser && loginUser.userRole) {
			if (!checkAuthorization(loginUser, access)) {
				next(`/no-authority`);
			}
		} else {
			next(`/login?redirect=${to.fullPath}`);
			return;
		}
	}
	next();
});

export default router;
