<template>
	<a-card :style="{ maxWidth: '1200px', margin: '0 auto' }">
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
					<a-button
						type="primary"
						@click="router.push(`/application/evaluation/${application?.id}`)"
					>
						开始答题
					</a-button>
					<a-button @click="handleShare"> 分享应用</a-button>
					<a-button v-if="iAmOwner"> 编辑应用</a-button>
					<a-button
						v-if="iAmOwner"
						@click="router.push(`/application/question/${application?.id}`)"
						>设置题目
					</a-button>
					<a-button
						v-if="iAmOwner"
						@click="router.push(`/application/result/${application?.id}`)"
						>设置评测结果
					</a-button>
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
	<result-component :app-id="props.id" />
	<share-modal
		ref="sharingModalRef"
		:title="application?.appName || '分享应用'"
		:link="sharingUrl"
		:cover="application?.appIcon"
	/>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, ref } from 'vue';
import { getAppVoByIdUsingGet } from '@/api/appController';
import { Message } from '@arco-design/web-vue';
import { dayjs } from '@arco-design/web-vue/es/_utils/date';
import { userLoginUserStore } from '@/stores/loginUser';
import { useRouter } from 'vue-router';
import ResultComponent from '@/components/application/ResultComponent.vue';
import ShareModal from '@/components/ShareModal.vue';

const props = withDefaults(defineProps<{ id: number }>(), {
	id: 0,
});
const loginStore = userLoginUserStore();
const application = ref<API.AppVO>();
const iAmOwner = computed(() => {
	return loginStore.checkLogin() && loginStore.loginUser.id === application.value?.userId;
});
const sharingUrl = `${window.location.origin}${window.location.pathname}`;
const router = useRouter();
const sharingModalRef = ref();
const handleShare = () => {
	if (sharingModalRef.value) {
		sharingModalRef.value.showModal();
	}
};
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

<style scoped></style>
