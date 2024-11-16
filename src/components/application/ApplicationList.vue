<template>
	<a-table
		:columns="columns"
		:data="data"
		:pagination="{
			current: pageInfo.current,
			pageSize: pageInfo.pageSize,
			total: pageInfo.total,
		}"
		@page-change="handlePageChange"
	>
		<template #appIcon="{ record }">
			<img
				:src="record.appIcon"
				alt="appIcon"
				style="width: 160px; height: 90px"
			/>
		</template>

		<template #createTime="{ record }">
			{{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}
		</template>

		<template #updateTime="{ record }">
			{{ dayjs(record.updateTime).format('YYYY-MM-DD HH:mm:ss') }}
		</template>

		<template #appType="{ record }">
			{{ record.appType === ApplicationType.SCORING.valueOf() ? '评分类' : '测评类' }}
		</template>
		<template #reviewStatus="{ record }">
			<a-tag
				color="gray"
				v-if="record.reviewStatus === ApplicationReviewStatus.PENDING.valueOf()"
			>
				正在审核
			</a-tag>
			<a-tag
				color="red"
				v-else-if="record.reviewStatus === ApplicationReviewStatus.REJECTED.valueOf()"
			>
				已拒绝
			</a-tag>
			<a-tag
				color="green"
				v-else-if="record.reviewStatus === ApplicationReviewStatus.PASSED.valueOf()"
			>
				已通过
			</a-tag>
		</template>

		<template #scoringStrategy="{ record }">
			<a-tag
				size="large"
				color="blue"
				v-if="record.scoringStrategy === ApplicationScoringStrategy.AI.valueOf()"
			>
				<template #icon>
					<icon-robot />
				</template>
				AI
			</a-tag>

			<a-tag
				size="large"
				color="purple"
				v-if="record.scoringStrategy === ApplicationScoringStrategy.CUSTOM.valueOf()"
			>
				<template #icon>
					<icon-user />
				</template>
				自定义
			</a-tag>
		</template>
		<template #reviewTime="{ record }">
			{{ record.reviewTime ? dayjs(record.reviewTime).format('YYYY-MM-DD HH:mm:ss') : '' }}
		</template>
		<template #action="{ record }">
			<a-space>
				<a-button
					type="primary"
					status="normal"
					@click="router.push(`/application/detail/${record.id}`)"
					:disabled="record.reviewStatus !== ApplicationReviewStatus.PASSED"
					>编辑
				</a-button>

				<a-button
					type="primary"
					status="danger"
					@click="handleDelete(record)"
					>删除
				</a-button>
			</a-space>
		</template>
	</a-table>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import { IconRobot, IconUser } from '@arco-design/web-vue/es/icon';
import { listMyAppVoByPageUsingPost } from '@/api/appController';
import { ApplicationReviewStatus } from '@/enums/ApplicationReviewStatus';
import { dayjs } from '@arco-design/web-vue/es/_utils/date';
import { ApplicationType } from '@/enums/ApplicationType';
import { ApplicationScoringStrategy } from '@/enums/ApplicationScoringStrategy';
import { Message, type TableColumnData } from '@arco-design/web-vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const columns: TableColumnData[] = [
	{
		title: '应用名称',
		dataIndex: 'appName',
		// filterable: {
		// 	filter: (value, record) => record.name.includes(value),
		// 	slotName: 'name-filter',
		// 	icon: () => h(IconSearch),
		// },
		width: 180,
	},
	{
		title: '描述',
		dataIndex: 'appDesc',
		width: 100,
	},
	{
		title: '封面',
		dataIndex: 'appIcon',
		slotName: 'appIcon',
	},
	{
		title: '应用类型',
		dataIndex: 'appType',
		slotName: 'appType',
		width: 100,
	},

	{
		title: '审核信息',
		dataIndex: 'reviewMessage',
		width: 100,
	},
	{
		title: '审核状态',
		dataIndex: 'reviewStatus',
		slotName: 'reviewStatus',
		width: 100,
	},
	{
		title: '评分策略',
		dataIndex: 'scoringStrategy',
		slotName: 'scoringStrategy',
	},
	{
		title: '创建时间',
		dataIndex: 'createTime',
		slotName: 'createTime',
		width: 180,
	},
	{
		title: '审核时间',
		dataIndex: 'reviewTime',
		slotName: 'reviewTime',
		width: 180,
	},
	{
		title: 'Reviewer ID',
		dataIndex: 'reviewerId',
	},

	{
		title: '更新时间',
		dataIndex: 'updateTime',
		slotName: 'updateTime',
		width: 180,
	},
	{
		title: 'Actions',
		dataIndex: 'action',
		slotName: 'action',
		fixed: 'right',
		width: 200,
	},
];
const data = ref<API.AppVO[]>([]);
const pageInfo = ref<{ current: number; pageSize: number; total: number }>({
	current: 1,
	pageSize: 10,
	total: 0,
});

const loadData = () => {
	listMyAppVoByPageUsingPost({
		...pageInfo.value,
	}).then(response => {
		if (response.data.code === 0) {
			data.value = response.data?.data?.records || [];
			pageInfo.value.total = response.data.data?.total || 0;
		} else {
			Message.error(`加载失败: ${response.data?.message || '未知错误'}`);
		}
	});
};
const handlePageChange = (current: number) => {
	pageInfo.value.current = current;
	loadData();
};
const handleDelete = (id: number) => {
	console.log(id);
};

onBeforeMount(loadData);
</script>

<style></style>
