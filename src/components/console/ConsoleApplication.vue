<template>
	<a-table
		:columns="columns"
		:data="data"
		:pagination="{
			current: pageInfo.current,
			pageSize: pageInfo.pageSize,
			total: total,
		}"
		@page-change="onPageChange"
	>
		<template #appIcon="{ record }">
			<img
				:src="record.appIcon"
				alt="appIcon"
				style="width: 50px; height: 50px; border-radius: 50%"
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
			{{ record.recordStatus === ApplicationReviewStatus.PENDING.valueOf() ? '待审核' : record.recordStatus === ApplicationReviewStatus.REJECTED ? '已拒绝' : '已通过' }}
		</template>

		<template #scoringStrategy="{ record }">
			{{ record.scoringStrategy === ApplicationScoringStrategy.AI.valueOf() ? 'AI' : '自定义' }}
		</template>
		<template #reviewTime="{record}">
			{{ record.reviewTime ? dayjs(record.reviewTime).format('YYYY-MM-DD HH:mm:ss') : '' }}
		</template>
		<template #action="{ record }">
			<a-space>
				<a-button
					v-if="record.reviewStatus === ApplicationReviewStatus.PENDING"
					type="primary"
					status="normal"
					@click="handleClick(record)"
				>
					审核
				</a-button>
				<a-button
					v-else-if="record.reviewStatus === ApplicationReviewStatus.REJECTED"
					disabled
					type="primary"
					status="normal"
				>
					已拒绝
				</a-button>
				<a-button
					v-else-if="record.reviewStatus === ApplicationReviewStatus.PASSED"
					disabled
					type="primary"
					status="normal"
				>
					已通过
				</a-button>

				<a-button
					type="primary"
					status="danger"
					@click="deleteRecord(record)"
					>删除
				</a-button>
			</a-space>
		</template>
	</a-table>

	<a-modal
		v-model:visible="visible"
		@ok="handleOk"
		ok-text="通过"
		cancel-text="拒绝"
		@cancel="handleCancel"
		draggable
	>
		<template #title> 审核</template>
		<div>
			<a-space direction="vertical">
				<a-input
					:style="{ width: '320px' }"
					placeholder="审核信息"
					allow-clear
					v-model="reviewMessage"
				/>
			</a-space>
		</div>
	</a-modal>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import { Message } from '@arco-design/web-vue';
import { dayjs } from '@arco-design/web-vue/es/_utils/date';
import { deleteAppUsingPost, listAppByPageUsingPost, reviewUsingPost } from '@/api/appController';
import { ApplicationType } from '@/enums/ApplicationType';
import { ApplicationScoringStrategy } from '@/enums/ApplicationScoringStrategy';
import { ApplicationReviewStatus } from '@/enums/ApplicationReviewStatus';

const columns = [
	{
		title: 'id',
		dataIndex: 'id',
	},
	{
		title: '应用名',
		dataIndex: 'appName',
	},
	{
		title: '应用描述',
		dataIndex: 'appDesc',
	},
	{
		title: '应用图标',
		dataIndex: 'appIcon',
		slotName: 'appIcon',
	},
	{
		title: '应用类型',
		dataIndex: 'appType',
		slotName: 'appType',
	},
	{
		title: '评分策略',
		dataIndex: 'scoringStrategy',
		slotName: 'scoringStrategy',
	},
	{
		title: '审核状态',
		dataIndex: 'reviewStatus',
		slotName: 'reviewStatus',
	},
	{
		title: '审核信息',
		dataIndex: 'reviewMessage',
	},
	{
		title: '审核人 id',
		dataIndex: 'reviewerId',
	},
	{
		title: '审核时间',
		dataIndex: 'reviewTime',
		slotName: 'reviewTime',
	},
	{
		title: '创建用户 id',
		dataIndex: 'userId',
	},
	{
		title: '创建时间',
		dataIndex: 'createTime',
		slotName: 'createTime',
	},
	{
		title: '更新时间',
		dataIndex: 'updateTime',
		slotName: 'updateTime',
	},
	{
		title: '操作',
		dataIndex: 'action',
		slotName: 'action',
	},
];

const data = ref<API.App[]>([]);
const pageInfo = ref({
	current: 1,
	pageSize: 10,
});
const total = ref(0);
const reviewMessage = ref('');
const visible = ref(false);

const loadData = () => {
	Message.loading({
		duration: 10000,
		content: '加载中...',
	});
	listAppByPageUsingPost({
		pageSize: pageInfo.value.pageSize,
		current: pageInfo.value.current,
	}).then(res => {
		Message.clear();
		if (res.data.code === 0) {
			data.value = res.data.data?.records || [];
			total.value = res.data.data?.total || 0;
			pageInfo.value.current = res.data.data?.current || 1;
		} else {
			Message.error(res.data?.message || '加载失败');
		}
	});
};
const onPageChange = (current:number)=>{
	pageInfo.value.current = current;
	loadData();
};
const deleteRecord = (record: API.App) => {
	Message.loading({
		duration: 10000,
		content: '删除中...',
	});
	deleteAppUsingPost({
		id: record.id,
	}).then(res => {
		Message.clear();
		if (res.data.code === 0) {
			Message.success('删除成功');
			loadData();
		} else {
			Message.error(res.data?.message || '删除失败');
		}
	});
};
const reviewApplication = (record: API.App, message: string, reviewStatus: ApplicationReviewStatus) => {
	Message.loading({
		duration: 10000,
		content: '操作中...',
	});
	reviewUsingPost({
		appId: record.id,
		reviewMessage: message,
		reviewStatus: reviewStatus,
	}).then(res => {
		Message.clear();
		if (res.data.code === 0) {
			Message.info('操作成功');
			loadData();
		} else {
			Message.error(`操作失败: ${res.data?.message || '未知错误'}`);
		}
	});
};
const currentRecord = ref<API.App>();
const handleClick = (record: API.App) => {
	visible.value = true;
	currentRecord.value = record;
};
const handleOk = () => {
	visible.value = false;
	if (currentRecord.value) {
		reviewApplication(currentRecord.value, reviewMessage.value, ApplicationReviewStatus.PASSED);
	}
};
const handleCancel = () => {
	visible.value = false;
	if (currentRecord.value) {
		reviewApplication(currentRecord.value, reviewMessage.value, ApplicationReviewStatus.REJECTED);
	}
};

onBeforeMount(loadData);
</script>
