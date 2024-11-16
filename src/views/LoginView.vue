<template>
	<a-form
		:model="form"
		:style="{ width: '600px', margin: '0 auto' }"
		@submit="handleSubmit"
		label-align="left"
	>
		<a-form-item
			field="username"
			tooltip="Please enter username"
			label="Username"
		>
			<a-input
				v-model="form.username"
				placeholder="please enter your username..."
			/>
		</a-form-item>
		<a-form-item
			field="password"
			label="Password"
		>
			<a-input-password
				v-model="form.password"
				placeholder="please enter your password..."
			/>
		</a-form-item>
		<a-form-item field="isRead">
			<a-checkbox v-model="form.isRead"> I have read the manual</a-checkbox>
		</a-form-item>
		<a-form-item>
			<a-button
				html-type="submit"
				type="primary"
				>登录
			</a-button>
			<router-link to="register">新用户注册</router-link>
		</a-form-item>
	</a-form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { userLoginUserStore } from '@/stores/loginUser';
import { Message } from '@arco-design/web-vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const store = userLoginUserStore();
const form = ref({
	username: '',
	password: '',
	isRead: false,
});
const handleSubmit = () => {
	if (form.value.isRead) {
		Message.loading({
			duration: 10000,
			content: 'Login in...',
		});
		store.login(form.value.username, form.value.password)
			.then(() => {
				Message.clear();
				Message.success('Login successful');
				const red = router.currentRoute.value.query?.redirect?[0] : '/';
				router.push({ path: red as string });
			})
			.catch(reason => {
				Message.clear();
				Message.error(`操作失败: ${reason?reason:'未知错误'}`);
			});
	} else {
		Message.info('Please read the manual');
	}
};
</script>
