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
		<template #userAvatar="{ record }">
			<img
				:src="record.userAvatar"
				alt="userAvatar"
				style="width: 50px; height: 50px; border-radius: 50%"
			/>
		</template>

		<template #createTime="{ record }">
			{{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}
		</template>

		<template #updateTime="{ record }">
			{{ dayjs(record.updateTime).format('YYYY-MM-DD HH:mm:ss') }}
		</template>

		<template #optional="{ record }">
			<a-space>
				<a-button
					type="primary"
					status="danger"
					@click="deleteRecord(record)"
					>删除
				</a-button>
			</a-space>
		</template>
	</a-table>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import { deleteUserUsingPost, listUserByPageUsingPost } from '@/api/userController';
import { Message } from '@arco-design/web-vue';
import { dayjs } from '@arco-design/web-vue/es/_utils/date';

const columns = [
	{
		title: 'ID',
		dataIndex: 'id',
	},
	{
		title: '用户账号',
		dataIndex: 'userAccount',
	},

	{
		title: '用户昵称',
		dataIndex: 'userName',
	},
	{
		title: '用户头像',
		dataIndex: 'userAvatar',
		slotName: 'userAvatar',
	},
	{
		title: '用户简介',
		dataIndex: 'userProfile',
	},
	{
		title: '用户权限',
		dataIndex: 'userRole',
	},
	{
		title: 'WxUnionId',
		dataIndex: 'unionId',
	},
	{
		title: 'MpOpenId',
		dataIndex: 'mpOpenId',
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
		slotName: 'optional',
	},
];

const data = ref<API.User[]>([]);
const pageInfo = ref<{ current: number; pageSize: number }>({
	current: 1,
	pageSize: 10,
});
const total = ref(0);
const loadData = () => {
	Message.loading({
		duration: 10000,
		content: '加载中...',
	});
	listUserByPageUsingPost({
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
const deleteRecord = (record: API.User) => {
	deleteUserUsingPost({
		id: record.id,
	}).then(res => {
		if (res.data.code === 0) {
			loadData();
		} else {
			Message.error(res.data?.message || '删除失败');
		}
	});
};

onBeforeMount(loadData);
</script>
