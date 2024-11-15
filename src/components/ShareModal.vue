<template>
	<a-modal
		v-model:visible="visible"
		:title="props.title"
		draggable
		mask-closable
		hide-cancel
		:footer="false"
	>
		<h4 style="margin-top: 0">复制分享链接</h4>
		<a-typography-paragraph copyable>{{ link }}</a-typography-paragraph>
		<h4>手机扫码查看</h4>
		<vue-qr
			:text="link"
			:size="200"
			:logo-src="cover"
		/>
	</a-modal>
</template>
<script setup lang="ts">
import { ref } from 'vue';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import vueQr from 'vue-qr/src/packages/vue-qr.vue';

interface Props {
	link: string;
	title: string;
	cover?: string;
}

const props = defineProps<Props>();
const visible = ref(false);
const showModal = () => {
	visible.value = true;
};
defineExpose({
	showModal,
});
</script>

<style scoped></style>