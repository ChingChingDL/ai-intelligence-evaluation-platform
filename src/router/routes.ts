import HomeView from '@/views/HomeView.vue';
import AboutView from '@/views/AboutView.vue';
import type { RouteRecordRaw } from 'vue-router';
import { UserRoleEnum } from '@/enums/UserRoleEnum';

export const routes: Array<RouteRecordRaw> = [
	{
		path: '/',
		name: 'home',
		component: HomeView,
		meta: {
			text: '主页',
		},
	},
	{
		path: '/about',
		name: 'about',
		component: AboutView,
		meta: {
			text: '关于',
		},
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

	{
		path: '/application/detail/:id',
		name: 'application.detail',
		props: true,
		meta: {
			hideInMenu: true,
		},
		component: () => import('@/views/ApplicationDetailView.vue'),
	},
	{
		path: '/application',
		name: 'application',
		meta: {
			text: '应用',
			needAuth: true,
			hideInMenu: false,
		},
		children: [
			{
				path: 'edit',
				name: 'application.edit',
				props: true,
				meta: {
					text: '编辑应用',
				},
				component: () => import('@/components/application/ApplicationEdit.vue'),
			},
			{
				path: 'create',
				name: 'application.create',
				meta: {
					text: '创建应用',
				},
				component: () => import('@/components/application/ApplicationCreate.vue'),
			},
		],
		component: () => import('@/views/ApplicationView.vue'),
	},

	{
		path: '/console',
		name: 'console',
		meta: {
			hide: true,
			text: '控制台',
			needAuth: true,
			roleNeed: UserRoleEnum.ADMIN,
		},
		children: [
			{
				path: '',
				name: 'console.home',
				meta: {
					text: '首页',
				},
				components: {
					default: () => import('@/components/console/ConsoleHome.vue'),
				},
			},
			{
				path: 'application',
				name: 'console.application',
				meta: {
					text: '应用管理',
				},
				component: () => import('@/components/console/ConsoleApplication.vue'),
			},
			{
				path: 'user',
				name: 'console.user',
				meta: {
					text: '用户管理',
				},
				components: {
					default: () => import('@/components/console/ConsoleUser.vue'),
				},
			},
			{
				path: 'role',
				name: 'console.role',
				meta: {
					text: '权限管理',
				},
				components: {
					default: () => import('@/components/console/ConsoleRole.vue'),
				},
			},
		],
		component: () => import('@/views/ConsoleView.vue'),
	},
];
