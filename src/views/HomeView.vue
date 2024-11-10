<template>
	<div class="search-container">
		<a-input-search
			:style="{ width: '320px' }"
			placeholder="快速发现应用"
			search-button
			size="large"
			:model-value="searchText"
		>
			<template #button-icon>
				<icon-search />
			</template>
			<template #button-default> 搜索</template>
		</a-input-search>
	</div>

	<div class="list-container">
		<a-list
			class="list-demo-action-layout"
			:grid-props="{ gutter: [20, 20], sm: 24, md: 12, lg: 8, xl: 6 }"
			hoverable
			:bordered="false"
			:data="dataSource"
			:pagination-props="paginationProps"
			@page-change="onPageChange"
		>
			<template #item="{ item }">
				<application-card
					:app="item"
				></application-card>
			</template>
		</a-list>
	</div>
</template>

<script setup lang="ts">
import { IconSearch } from '@arco-design/web-vue/es/icon';
import {onBeforeMount, ref} from 'vue';
import ApplicationCard from '@/components/application/ApplicationCard.vue';
import { listAppVoByPageUsingPost} from '@/api/appController';
import { Message } from '@arco-design/web-vue';
import {ApplicationReviewStatus} from "@/enums/ApplicationReviewStatus";

const searchText = ref<string>('');
const dataSource = ref<API.AppVO[]>([]);

const paginationProps = ref({
	defaultPageSize: 12,
	current: 1,
	pageSizeOptions: ['12', '24', '36'],
	pageSize: 12,
	total: dataSource.value.length,
});

const loadData = () => {
	Message.loading({
		duration: 10000,
		content: 'Loading...',
	});
	listAppVoByPageUsingPost({
		pageSize: paginationProps.value.pageSize,
		current: paginationProps.value.current,
		reviewStatus:ApplicationReviewStatus.PASSED
	}).then(response => {
		Message.clear();
		if (response.data.code == 0) {
			dataSource.value = response.data.data?.records || [];
			paginationProps.value.total = Number.parseInt(response.data.data.total);
		}else{
			Message.error(`加载失败:${response.data?.message || '未知原因'}`);
                }
	});


};
const onPageChange = (current:number)=>{
	paginationProps.value.current = current;
	loadData();
}

onBeforeMount(loadData);

</script>

<style scoped>
.list-container {
	min-height: 60vh;
	max-width: 1200px;
	margin: 0 auto 28px;
}

.list-demo-action-layout .image-area {
	width: 183px;
	height: 119px;
	border-radius: 2px;
	overflow: hidden;
}

.list-demo-action-layout .list-demo-item {
	padding: 20px 0;
	border-bottom: 1px solid var(--color-fill-3);
}

.list-demo-action-layout .image-area img {
	width: 100%;
}

.list-demo-action-layout .arco-list-item-action .arco-icon {
	margin: 0 4px;
}

.search-container {
	display: flex;
	place-content: center;
	margin-bottom: 20px;
}
</style>
