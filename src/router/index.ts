import { createRouter, createWebHistory } from 'vue-router';
import { userLoginUserStore } from '@/stores/loginUser';
import { routes } from '@/router/routes';
import { UserRoleEnum } from '@/enums/UserRoleEnum';
import { checkAuthorization } from '@/utils/Authorization';

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes,
});

router.beforeEach(async (to, from, next) => {
	// 获取当前登录用户
	const loginUserStore = userLoginUserStore();
	if (!loginUserStore.checkLogin()) {
		await loginUserStore.loginWithToken();
	}
	// 获取当前页面需要的访问权限
	const access = (to.meta?.roleNeed as UserRoleEnum) || UserRoleEnum.ANONYMOUS;
	const needAuth = to.meta.needAuth ?? false;
	// // 判断该用户是否需要登录
	if (needAuth) {
		// 判断该用户是否登录
		if (loginUserStore.checkLogin()) {
			if (!checkAuthorization(loginUserStore.loginUser, access)) {
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
