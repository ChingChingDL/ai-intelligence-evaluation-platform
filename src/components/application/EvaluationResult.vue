<template>
	<a-card>
		<a-row style="margin-bottom: 16px">
			<a-col flex="auto">
				<h2>
					{{ data.resultName || '' }}
				</h2>
				<p>结果描述：{{ data.resultDesc }}</p>
				<p>我的答案：{{ data.choices }}</p>
				<p>结果得分：{{ data?.resultScore || '' }}</p>
				<p :style="{ display: 'flex', alignItems: 'center', color: '#1D2129' }">
					答题人：
					<a-avatar
						:size="24"
						:image-url="data?.user?.userAvatar || ''"
						:style="{ marginRight: '8px' }"
					></a-avatar>
					<a-typography-text>{{ data?.user?.userName || '' }} </a-typography-text>
				</p>
				<p>答题时间：{{ data ? dayjs(data.createTime).format('YYYY-MM-DD HH:mm:ss') : '' }}</p>
				<a-space>
					<a-button> 分享结果</a-button>
				</a-space>
			</a-col>
			<a-col flex="320px">
				<a-image
					width="100%"
					:style="{ width: '100%', borderRadius: '8px' }"
					:src="data?.resultPicture || ''"
				/>
			</a-col>
		</a-row>
	</a-card>
</template>
<script setup lang="ts">

import { getUserAnswerVoByIdUsingGet } from '@/api/userAnswerController';
import { onBeforeMount, ref } from 'vue';
import { dayjs } from '@arco-design/web-vue/es/_utils/date';
import { Message } from '@arco-design/web-vue';

const props = defineProps<{answerId: number }>();
const data = ref<API.UserAnswerVO>({});

const loadData = ()=>{
	Message.loading({
		duration:10000,
		content: '加载中...',
	});
	getUserAnswerVoByIdUsingGet({id: props.answerId}).then((res) => {
		Message.clear();
		if(res.data.code ===0){
			data.value = res.data?.data || {};
		}else{
			return Promise.reject(res.data?.message || '未知错误');
		}
	}).catch(reason=>Message.error(`请求失败:${reason}`));
}

onBeforeMount(loadData);
</script>

<style scoped>


</style>