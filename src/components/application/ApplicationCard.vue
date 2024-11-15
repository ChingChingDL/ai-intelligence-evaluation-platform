<template>
	<a-card hoverable>
		<template #actions>
			<span class="icon-hover"> <IconThumbUp /> </span>
			<span class="icon-hover" @click="handleShare"> <IconShareInternal /> </span>
			<span class="icon-hover"> <IconMore /> </span>
		</template>
		<template #cover>
			<div
				@click="router.push(`/application/detail/${props.app.id}`)"
				:style="{
					height: '204px',
					overflow: 'hidden',
					cursor: 'pointer',
				}"
			>
				<img
					:style="{ width: '100%' ,height:'100%',transform: 'translateY(-20px)',objectFit: 'fill', objectPosition: 'center'}"
					alt="cover"
					:src="app.appIcon"
				/>
			</div>
		</template>
		<a-card-meta
			:title="app.appName"
			:description="app.appDesc"
		>
			<template #avatar>
				<div :style="{ display: 'flex', alignItems: 'center', color: '#1D2129' }">
					<a-avatar
						:size="24"
						:image-url="app.user?.userAvatar"
						:style="{ marginRight: '8px' }"
					>
						A
					</a-avatar>
					<a-typography-text>{{ app?.user?.userName || '' }}</a-typography-text>
				</div>
			</template>
		</a-card-meta>
	</a-card>
	<share-modal title="应用分享" :link="shareLink"  ref="shareModalRef" :cover="app.appIcon"/>
</template>

<script setup lang="ts">
import { IconMore, IconShareInternal, IconThumbUp } from '@arco-design/web-vue/es/icon';
import { useRouter } from 'vue-router';
import ShareModal from '@/components/ShareModal.vue';
import { ref } from 'vue';
interface Props {
	app: API.AppVO;
}

const props = withDefaults(defineProps<Props>(), {
	app: () =>
		({
			id: 1,
			title: 'App Title',
			cover: 'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/piao241025.8f3c4a4c.png~tplv-uwbnlip3yd-webp.webp',
		}) as API.AppVO,
});
const router = useRouter();
const shareModalRef = ref();
const shareLink = `${window.location.origin}/application/detail/${props.app.id}`;
const handleShare = ()=>{
	if(shareModalRef.value){
		shareModalRef.value.showModal();
	}
}




</script>
<style scoped>
.icon-hover {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 24px;
	height: 24px;
	border-radius: 50%;
	transition: all 0.1s;
}

.icon-hover:hover {
	background-color: rgb(var(--gray-2));
}
</style>
