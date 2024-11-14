<template>
	<a-modal
		v-model:visible="visible"
		ok-text="关闭"
		@cancel="visible = false"
		mask-closable
		draggable
		esc-to-close
		hide-cancel
		simple
		:width="720"
	>
		<template #title> 编辑</template>
		<a-form
			ref="formRef"
			:size="formSize"
			:model="form"
			:style="{ width: '600px', userSelect: 'none' }"
			@submit="handleSubmit"
		>
			{{ form }}
			<a-form-item label="Form Size">
				<a-radio-group
					v-model="formSize"
					type="button"
				>
					<a-radio value="mini">Mini</a-radio>
					<a-radio value="small">Small</a-radio>
					<a-radio value="medium">Medium</a-radio>
					<a-radio value="large">Large</a-radio>
				</a-radio-group>
			</a-form-item>
			<a-form-item
				field="resultName"
				label="结果名称"
				:rules="[
					{ required: true, message: 'name is required' },
					{ minLength: 1, message: 'must be greater than 1 characters' },
				]"
				:validate-trigger="['change', 'input']"
			>
				<a-input
					v-model="form.resultName"
					placeholder="结果名称"
				/>
			</a-form-item>

			<a-form-item
				field="resultDesc"
				label="结果描述"
				:rules="[{ required: true, message: '不能为空哦ᓚᘏᗢ' }]"
			>
				<a-input
					v-model="form.resultDesc"
					placeholder="结果描述（。＾▽＾）"
				/>
			</a-form-item>
			<a-form-item
				field="resultPicture"
				label="结果图标"
				:rules="[
					{ required: true, message: 'a image is required' },
					{ match: /^https?:\/\/.+/i, message: '请输入正确的URL' },
				]"
				:validate-trigger="['change', 'input']"
			>
				<a-input
					v-model="form.resultPicture"
					placeholder="URL"
				/>
			</a-form-item>

			<a-form-item
				field="resultProp"
				label="结果集"
			>
				<a-input-tag
					:default-value="['test']"
					v-model="form.resultProp"
					:style="{ width: '320px' }"
					placeholder="请输入结果集"
					allow-clear
				/>
			</a-form-item>

			<a-form-item
				field="resultScoreRange"
				label="结果得分范围"
			>
				<a-input-number v-model="form.resultScoreRange"></a-input-number>
			</a-form-item>
			<a-form-item>
				<a-space>
					<a-button
						html-type="submit"
						type="primary"
						>{{ formSubmitButtonText }}
					</a-button>
					<a-button @click="formRef.resetFields()">Reset</a-button>
				</a-space>
			</a-form-item>
		</a-form>
	</a-modal>

	<a-space style="margin-bottom: 16px">
		<a-button
			status="normal"
			type="primary"
			style="float: right"
			@click="handleCreate"
		>
			<icon-folder-add type="plus" />
			创建新结果
		</a-button>
	</a-space>
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
		<template #resulPicture="{ record }">
			<img
				:src="record.resultPicture"
				alt="resulPicture"
				style="width: 160px; height: 90px"
			/>
		</template>

		<template #createTime="{ record }">
			{{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}
		</template>

		<template #updateTime="{ record }">
			{{ dayjs(record.updateTime).format('YYYY-MM-DD HH:mm:ss') }}
		</template>

		<template #action="{ record }">
			<a-space>
				<a-button
					type="primary"
					status="normal"
					@click="handleEdit(record)"
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
import { h, onBeforeMount, ref } from 'vue';
import { Message } from '@arco-design/web-vue';
import { addScoringResultUsingPost, editScoringResultUsingPost, listScoringResultVoByPageUsingPost } from '@/api/scoringResultController';
import { dayjs } from '@arco-design/web-vue/es/_utils/date';
import { IconFolderAdd, IconSearch } from '@arco-design/web-vue/es/icon';

const props = defineProps<{
	appId: number;
}>();
const columns = [
	{
		title: '结果名称',
		dataIndex: 'resultName',
		filterable: {
			filter: (value, record) => record.name.includes(value),
			slotName: 'name-filter',
			icon: () => h(IconSearch),
		},
		width: 180,
	},
	{
		title: '描述',
		dataIndex: 'resultDesc',
		width: 180,
	},
	{
		title: '图片',
		dataIndex: 'resulPicture',
		slotName: 'resulPicture',
	},
	{
		title: '结果集',
		dataIndex: 'resultProp',
		slotName: 'resultProp',
	},
	{
		title: '评分范围',
		dataIndex: 'resultScoreRange',
		slotName: 'resultScoreRange',
	},
	{
		title: '创建时间',
		dataIndex: 'createTime',
		slotName: 'createTime',
		width: 180,
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
const pageInfo = ref<{ current: number; pageSize: number; total: number }>({
	current: 1,
	pageSize: 10,
	total: 0,
});

const data = ref<API.ScoringResultVO[]>([]);
const formSize = ref('large');
const formRef = ref();
const form = ref<API.ScoringResultVO>({
	resultDesc: '',
	resultName: '',
	resultPicture: '',
	resultProp: [],
	resultScoreRange: 0,
});
const formSubmitButtonText = ref<string>('');

const visible = ref<boolean>(false);
const loadData = () => {
	if (props.appId) {
		listScoringResultVoByPageUsingPost({
			appId: props.appId,
			current: pageInfo.value.current,
			pageSize: pageInfo.value.pageSize,
			sortField: 'createTime',
			sortOrder: 'descend',
		}).then(response => {
			if (response.data.code === 0) {
				data.value = response.data.data.records;
				pageInfo.value.total = response.data.data.total;
			} else {
				Message.error(`加载失败：${response.data?.message || '未知错误'}`);
			}
		});
	} else {
		Message.error(`页面错误 未知应用：${props.appId}`);
	}
};
const submitForm = async () => {
	if (form.value?.id) {
		editScoringResultUsingPost({
			...form.value,
		}).then(response => {
			Message.clear();
			if (response.data.code === 0 && response.data.data) {
				Message.success('修改成功');
				return Promise.resolve(form.value?.id);
			} else {
				return Promise.reject(response.data.data?.message || '未知错误');
			}
		});
	} else {
		// 创建
		addScoringResultUsingPost({
			...form.value,
			appId: props.appId,
		}).then(response => {
			Message.clear();
			if (response.data.code === 0) {
				Message.success('提交成功');
				return Promise.resolve(response.data.data);
			} else {
				return Promise.reject(response.data.data?.message || '未知错误');
			}
		});
	}
};
const handleSubmit = ({ errors }) => {
	if (errors) {
		Message.error(`似乎还有东西没填哦(*/ω＼*)`);
		return;
	} else {
		Message.loading({
			duration: 10000,
			content: '请稍等( ‵▽′)ψ',
		});
		submitForm()
			.then(setTimeout(loadData, 200))
			.then((visible.value = false))
			.catch(reason => {
				Message.error(`操作失败:${reason}`);
			});
	}
};
const handlePageChange = (current: number) => {
	pageInfo.value.current = current;
	loadData();
};
const handleEdit = (record: API.ScoringResultVO) => {
	form.value = { ...record };
	formSubmitButtonText.value = '更新';
	visible.value = true;
};
const handleCreate = () => {
	form.value = {};
	formSubmitButtonText.value = '创建';
	visible.value = true;
};

onBeforeMount(loadData);
</script>
