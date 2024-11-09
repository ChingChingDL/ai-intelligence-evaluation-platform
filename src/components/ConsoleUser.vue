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

		<template #optional="{ record }">
			<a-space>
				<a-button
					type="dangerous"
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

const columns = [
	{
		title: 'ID',
		dataIndex: 'id',
	},
	{
		title: 'Account',
		dataIndex: 'userAccount',
	},
	{
		title: 'WeChat Open Platform ID',
		dataIndex: 'unionId',
	},
	{
		title: 'Public Account OpenID',
		dataIndex: 'mpOpenId',
	},
	{
		title: 'User Nickname',
		dataIndex: 'userName',
	},
	{
		title: 'User Avatar',
		dataIndex: 'userAvatar',
		slotName: 'userAvatar',
	},
	{
		title: 'User Profile',
		dataIndex: 'userProfile',
	},
	{
		title: 'User Role',
		dataIndex: 'userRole',
	},
	{
		title: 'Creation Time',
		dataIndex: 'createTime',
	},
	{
		title: 'Update Time',
		dataIndex: 'updateTime',
	},
	{
		title: 'Action',
		dataIndex: 'action',
		slotName: 'optional',
	},
];

const data = ref([]);
const pageInfo = ref({
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
			data.value = res.data.data.records;
			total.value = res.data.data.total;
			pageInfo.value.pageSize = res.data.data.pageSize;
			pageInfo.value.current = res.data.data.current;
		} else {
			Message.error(res.data.message);
		}
	});
};
const onPageChange = loadData;
const deleteRecord = (record: API.User) => {
	deleteUserUsingPost({
		id: record.id,
	}).then(res => {
		if (res.data.code === 0) {
			loadData();
		} else {
			Message.error(res.data.message);
		}
	});
};

onBeforeMount(loadData);
</script>
