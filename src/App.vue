<template>
	<basic-layout>
		<template #header>
			<global-header />
		</template>

		<template #content>
			<RouterView />
		</template>
		<template #footer> footer</template>
	</basic-layout>
</template>
<script setup lang="ts">
import { RouterView, useRouter } from 'vue-router';
import BasicLayout from '@/layouts/BasicLayout.vue';
import { ref } from 'vue';
import GlobalHeader from '@/components/GlobalHeader.vue';

const router = useRouter();
const selectedKey = ref([router.currentRoute.value.path]);
router.isReady().then(() => {
	selectedKey.value[0] = router.currentRoute.value.path;
});
</script>
<style scoped></style>
