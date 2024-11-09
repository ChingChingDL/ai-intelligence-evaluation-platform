import HomeView from '@/views/HomeView.vue';
import AboutView from '@/views/AboutView.vue';
import type { RouteRecordRaw } from 'vue-router';
import { UserRoleEnum } from '@/enums/UserRoleEnum';

export const routes: Array<RouteRecordRaw> = [
	{
		path: '/',
		name: 'home',
		component: HomeView,
	},
	{
		path: '/about',
		name: 'about',
		component: AboutView,
	},
	{
		path: '/console',
		name: 'console',
		meta: {
			hide: true,
			text: '控制台',
			roleNeed: UserRoleEnum.ADMIN,
		},
		children: [
			{
				path: '',
				name: 'console.home',
				meta: {
					text: '首页'
				},
				components:{
					default: () => import('@/components/ConsoleHome.vue'),
				}

			},
			{
				path: 'user',
				name: 'console.user',
				meta: {
					text: '用户管理',
				},
				components:{
					default: () => import('@/components/ConsoleUser.vue'),
				}
			},
			{
				path: 'role',
				name: 'console.role',
				meta: {
					text: '权限管理',
				},
				components:{
					default: () => import('@/components/ConsoleRole.vue'),
				}
			},
		],
		component: () => import('@/views/ConsoleView.vue'),
	},
	{
		path: '/login',
		name: 'login',
		meta: {
			hideInMenu: true,
		},
		component: () => import('@/views/LoginView.vue'),
	},
	{
		path: '/register',
		name: 'register',
		meta: {
			hideInMenu: true,
		},
		component: () => import('@/views/RegisterView.vue'),
	},
];
