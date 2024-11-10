<template>
	<a-card>
		<a-row style="margin-bottom: 16px">
			<a-col flex="auto">
				<h2>
					{{ application?.appName || '' }}
				</h2>
				<p>
					{{ application?.appDesc || '' }}
				</p>
				<p>应用类型：{{ application?.appType || '' }}</p>
				<p :style="{ display: 'flex', alignItems: 'center', color: '#1D2129' }">
					作者：
					<a-avatar
						:size="24"
						:image-url="application?.user?.userAvatar || ''"
						:style="{ marginRight: '8px' }"
					></a-avatar>
					<a-typography-text>{{ application?.user?.userName || '' }}</a-typography-text>
				</p>
				<p>创建时间：{{ application ? dayjs(application.createTime).format('YYYY-MM-DD HH:mm:ss') : '' }}</p>
				<a-space>
					<a-button type="primary">开始答题</a-button>
					<a-button> 分享应用</a-button>
					<a-button v-if="iAmOwner"> 编辑应用</a-button>
					<a-button v-if="iAmOwner"> 删除应用</a-button>
				</a-space>
			</a-col>
			<a-col flex="320px">
				<a-image
					width="100%"
					:style="{ width: '100%', borderRadius: '8px' }"
					:src="application?.appIcon || ''"
				/>
			</a-col>
		</a-row>
	</a-card>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, ref } from 'vue';
import { getAppVoByIdUsingGet } from '@/api/appController';
import { Message } from '@arco-design/web-vue';
import { dayjs } from '@arco-design/web-vue/es/_utils/date';
import { userLoginUserStore } from '@/stores/loginUser';

const props = withDefaults(defineProps<{ id: number }>(), {
	id: 0,
});
const loginStore = userLoginUserStore();
const application = ref<API.AppVO>();
const iAmOwner: boolean = computed(()=>{
	return loginStore.checkLogin() && loginStore.loginUser.id === application.value?.userId;
});

const loadData = () => {
	Message.loading({
		duration: 10000,
		content: '加载中...',
	});
	getAppVoByIdUsingGet({ id: props.id }).then(response => {
		Message.clear();
		if (response.data.code === 0) {
			application.value = response.data.data;
		} else {
			Message.error(`加载失败:${response.data?.message || '未知错误'}`);
		}
	});
};
onBeforeMount(loadData);
</script>

<style scoped>
.grid-demo .arco-col {
	height: 48px;
	line-height: 48px;
	color: var(--color-white);
	text-align: center;
}

.grid-demo .arco-col:nth-child(2n + 1) {
	background-color: var(--color-primary-light-4);
}

.grid-demo .arco-col:nth-child(2n) {
	background-color: rgba(var(--arcoblue-6), 0.9);
}
</style>
