<template>
	<div class="arco-menu">
		<a-row
			align="center"
			class="grid-demo"
			:wrap="false"
		>
			<a-col flex="auto">
				<a-menu
					mode="horizontal"
					:default-selected-keys="['/']"
				>
					<a-menu-item
						key="0"
						:style="{ padding: 0, marginRight: '38px' }"
						disabled
					>
						<div class="title-bar">
							<img
								src="/public/logo.png"
								alt="Logo"
							/>
							<div class="title">Snow Crystal</div>
						</div>
					</a-menu-item>
					<router-link
						:to="item.path"
						v-for="item in routes.filter(item => item.meta?.hideInMenu!== true)"
						:key="item.path"
					>
						<a-menu-item :key="item.path">
							{{ item.meta?.text || '' }}
						</a-menu-item>
					</router-link>
				</a-menu>
			</a-col>
			<a-col flex="100px">
				<div>
					<a-button
						type="primary"
						size="large"
						>登录
					</a-button>
				</div>
			</a-col>
		</a-row>
	</div>
</template>
<style scoped>
.arco-menu {
	user-select: none;
}

.title-bar img {
	width: 40px;
	height: 40px;
}

.title-bar {
	display: flex;
	align-items: center;

	.title {
		color: black;
		margin-left: 10px;
		font-size: 20px;
		font-weight: 600;
	}
}
</style>
<script setup lang="ts">
import { routes } from '@/router/routes';
</script>
