<template>
	<a-form
		:model="form"
		:style="{ width: '600px', margin: '0 auto' }"
		@submit="handleSubmit"
		label-align="left"
	>
		<a-form-item
			field="username"l
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
		<a-form-item
			field="password"
			label="Password"
		>
			<a-input-password
				v-model="form.checkPassword"
				placeholder=" reenter your password..."
			/>
		</a-form-item>
		<a-form-item field="isRead">
			<a-checkbox v-model="form.isRead"> I have read the manual</a-checkbox>
		</a-form-item>
		<a-form-item>
			<a-button
				html-type="submit"
				type="primary"
				>注册
			</a-button>
			<router-link to="login">老用户登录</router-link>
		</a-form-item>
	</a-form>
</template>
<script setup lang="ts">
import { reactive } from 'vue';
import { Message } from '@arco-design/web-vue';
import { userRegisterUsingPost } from '@/api/userController';
import { useRouter } from 'vue-router';

const router = useRouter();
const form = reactive({
	username: '',
	password: '',
	checkPassword: '',
	isRead: false,
});
const handleSubmit = async () => {
	if (form.isRead) {
		Message.loading({
			duration: 10000,
			content: '请稍等',
		});
		userRegisterUsingPost({
			userPassword: form.password,
			userAccount: form.username,
			checkPassword: form.checkPassword,
		}).then(res => {
			Message.clear();
			if (res.data.code === 0) {
				Message.success('注册成功');
				router.push('login');
			} else {
				Message.error(res.data.message);
			}
		});
	} else {
		Message.info('Please read the manual');
	}
};
</script>

<style scoped></style>
