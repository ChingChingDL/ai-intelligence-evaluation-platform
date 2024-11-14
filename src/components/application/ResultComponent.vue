<template>
	<h2>最近答题记录</h2>
	<a-list
		bordered
		hoverable
		title="答题记录"
		:pagination-props="pagination"
		:data="items"
		:loading="loading"
		:virtualListProps="{
			height: 560,
		}"
		@page-change="handlePageChange"
	>
		<template #item="{ item }">
			<a-list-item :key="item.id">
				<a-card>
					<a-row style="margin-bottom: 16px">
						<a-col flex="auto">
							<h2>
								{{ item.resultName || '' }}
							</h2>
							<p>结果描述：{{ item.resultDesc }}</p>
							<p>我的答案：{{ item.choices }}</p>
							<p>结果得分：{{ item?.resultScore || '' }}</p>
							<p :style="{ display: 'flex', alignItems: 'center', color: '#1D2129' }">
								答题人：
								<a-avatar
									:size="24"
									:image-url="item?.user?.userAvatar || ''"
									:style="{ marginRight: '8px' }"
								></a-avatar>
								<a-typography-text>{{ item?.user?.userName || '' }} </a-typography-text>
							</p>
							<p>答题时间：{{ item ? dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss') : '' }}</p>
							<a-space>
								<a-button> 分享结果</a-button>
							</a-space>
						</a-col>
						<a-col flex="320px">
							<a-image
								width="100%"
								:style="{ width: '100%', borderRadius: '8px' }"
								:src="item?.resultPicture || ''"
							/>
						</a-col>
					</a-row>
				</a-card>
			</a-list-item>
		</template>
	</a-list>
</template>
<script setup lang="ts">
import { dayjs } from '@arco-design/web-vue/es/_utils/date';
import { listMyUserAnswerVoByPageUsingPost } from '@/api/userAnswerController';
import { onBeforeMount, ref } from 'vue';
import { Message } from '@arco-design/web-vue';

const props = defineProps<{ appId: number }>();
const pagination = ref({ current: 1, pageSize: 10, total: 0 });
const items = ref<API.UserAnswerVO[]>([]);
const loading = ref(true);
const loadAnswers = () => {
	if (props.appId) {
		listMyUserAnswerVoByPageUsingPost({
			sortField: 'updateTime',
			sortOrder: 'descend',
			appId: props.appId,
			current: pagination.value.current,
			pageSize: pagination.value.pageSize,
		})
			.then(res => {
				if (res.data.code === 0) {
					const records = res.data.data?.records as API.UserAnswerVO[] || [];
					items.value = records.filter(item => item.resultName);
					pagination.value.total = res.data.data?.total || 0;
				} else {
					Message.error(`加载失败:${res.data.message}`);
				}
				loading.value = false;
			})
			.catch(error => {
				Message.error(`加载失败:${error}`);
				loading.value = false;
			});
	}
};
const handlePageChange = (page: number) => {
	pagination.value.current = page;
	loadAnswers();
};

onBeforeMount(loadAnswers);
</script>

<style scoped>
.result-card {
	margin: 16px;
}
</style>
