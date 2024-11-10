<template>
	<a-layout class="layout-demo">
		<a-layout-sider
			style="min-height: 500px"
			:width="240"
			breakpoint="xl"
		>
			<div class="logo" />
			<a-menu
				:default-open-keys="['console.home']"
				:default-selected-keys="['console.home']"
				:style="{ width: '100%' }"
				@menu-item-click="onClickMenuItem"
			>
				<a-menu-item
					v-for="route in applicationRoutes"
					:key="route.name"
				>
					<IconCalendar></IconCalendar>
					{{ route.meta?.text || route.name }}
				</a-menu-item>

				<a-sub-menu key="4">
					<template #title>
						<IconCalendar></IconCalendar>
						Navigation 4
					</template>
					<a-menu-item key="4_1">Menu 1</a-menu-item>
					<a-menu-item key="4_2">Menu 2</a-menu-item>
					<a-menu-item key="4_3">Menu 3</a-menu-item>
				</a-sub-menu>
			</a-menu>
			<!-- trigger -->
			<template #trigger="{ collapsed }">
				<IconCaretRight v-if="collapsed"></IconCaretRight>
				<IconCaretLeft v-else></IconCaretLeft>
			</template>
		</a-layout-sider>
		<a-layout>
			<a-layout style="padding: 0 24px">
				<a-layout-header style="padding-left: 20px"> Header</a-layout-header>
				<a-layout-content style="padding: 20px">
					<router-view></router-view>
				</a-layout-content>
			</a-layout>
		</a-layout>
	</a-layout>
</template>

<script setup lang="ts">
import { Message } from '@arco-design/web-vue';
import { IconCalendar, IconCaretLeft, IconCaretRight } from '@arco-design/web-vue/es/icon';
import { type RouteRecordRaw, useRouter } from 'vue-router';
import { ref } from 'vue';
import { routes } from '@/router/routes';

const router = useRouter();

const applicationRoutes = ref<RouteRecordRaw[]>(routes.find(item => item.name === 'application')?.children || []);

function onClickMenuItem(key: string) {
	Message.info({ content: `You select ${key}`, showIcon: true });
	router.replace({
		name: key,
	});
}
</script>

<style scoped>
.layout-demo {
	min-height: 80vh;
	background: var(--color-fill-2);
	border: 1px solid var(--color-border);
}

.layout-demo :deep(.arco-layout-sider) .logo {
	height: 32px;
	margin: 12px 8px;
	background: rgba(255, 255, 255, 0.2);
}

.layout-demo :deep(.arco-layout-sider-light) .logo {
	background: var(--color-fill-2);
}

.layout-demo :deep(.arco-layout-header) {
	height: 64px;
	line-height: 64px;
	background: var(--color-bg-3);
}

.layout-demo :deep(.arco-layout-footer) {
	height: 48px;

	font-weight: 400;
	font-size: 14px;
	line-height: 48px;
}

.layout-demo :deep(.arco-layout-content) {
	color: var(--color-text-2);
	font-weight: 400;
	font-size: 14px;
	background: var(--color-bg-3);
}

.layout-demo :deep(.arco-layout-footer),
.layout-demo :deep(.arco-layout-content) {
	display: flex;
	flex-direction: column;
	justify-content: center;
	font-size: 16px;
	font-stretch: condensed;
	text-align: center;
}
</style>
