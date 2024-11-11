<template>
	<a-form
		ref="formRef"
		:size="form.size"
		:model="form"
		:style="{ width: '600px',userSelect: 'none' }"
		@submit="handleSubmit"
	>
		<a-form-item
			field="size"
			label="Form Size"
		>
			<a-radio-group
				v-model="form.size"
				type="button"
			>
				<a-radio value="mini">Mini</a-radio>
				<a-radio value="small">Small</a-radio>
				<a-radio value="medium">Medium</a-radio>
				<a-radio value="large">Large</a-radio>
			</a-radio-group>
		</a-form-item>
		<a-form-item
			field="name"
			label="应用名称"
			:rules="[
				{ required: true, message: 'name is required' },
				{ minLength: 5, message: 'must be greater than 5 characters' },
			]"
			:validate-trigger="['change', 'input']"
		>
			<a-input
				v-model="form.name"
				placeholder="应用名称"
			/>
		</a-form-item>

		<a-form-item
			field="description"
			label="应用描述"
			:rules="[{ required: true, message: '不能为空哦ᓚᘏᗢ' }]"
		>
			<a-input
				v-model="form.description"
				placeholder="应用描述哦（。＾▽＾）"
			/>
		</a-form-item>
		<a-form-item
			field="cover"
			label="应用图标"
			:rules="[
				{ required: true, message: 'name is required' },
				{ minLength: 5, message: 'must be greater than 5 characters' },
				{ match: /^https?:\/\/.+/i, message: '请输入正确的URL' },
			]"
			:validate-trigger="['change', 'input']"
		>
			<a-input
				v-model="form.cover"
				placeholder="URL"
			/>
		</a-form-item>
		<a-form-item
			field="type"
			label="应用类型"
		>
			<a-select
				v-model="form.type"
				placeholder="Please select ..."
				allow-clear
			>
				<a-option
					v-for="(value, index) of Object.values(applicationTypes)"
					:key="value"
					:value="index"
				>
					{{ value }}
				</a-option>
			</a-select>
		</a-form-item>

		<a-form-item
			field="scoring"
			label="评分策略"
		>
			<a-select
				v-model="form.scoring"
				placeholder="Please select ..."
				allow-clear
			>
				<a-option
					v-for="(value, index) of Object.values(scoringStrategies)"
					:key="value"
					:value="index"
				>
					{{ value }}
				</a-option>
			</a-select>
		</a-form-item>

		<a-form-item
			field="options"
			label="Options"
			:rules="[{ type: 'array', minLength: 2, message: 'must select greater than two options' }]"
		>
			<a-checkbox-group v-model="form.options">
				<a-checkbox value="option one">Section One</a-checkbox>
				<a-checkbox value="option two">Option Two</a-checkbox>
				<a-checkbox value="option three">Option Three</a-checkbox>
				<a-checkbox value="option four">Option Four</a-checkbox>
			</a-checkbox-group>
		</a-form-item>

		<a-form-item
			field="radio"
			label="Radio"
			:rules="[{ match: /one/, message: 'must select one' }]"
		>
			<a-radio-group v-model="form.radio">
				<a-radio value="radio one">Radio One</a-radio>
				<a-radio value="radio two">Radio Two</a-radio>
			</a-radio-group>
		</a-form-item>
		<a-form-item
			field="switch"
			label="Switch"
			:rules="[{ type: 'boolean', true: true, message: 'must be true' }]"
		>
		</a-form-item>
		<a-form-item>
			<a-space>
				<a-button
					html-type="submit"
					type="primary"
					>创建
				</a-button>
				<a-button @click="formRef.resetFields()">Reset</a-button>
			</a-space>
		</a-form-item>
	</a-form>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { ApplicationScoringStrategy } from '@/enums/ApplicationScoringStrategy';
import type { ApplicationType } from '@/enums/ApplicationType';
import { addAppUsingPost } from '@/api/appController';
import { Message } from '@arco-design/web-vue';
import { useRouter } from 'vue-router';

type EnumKeys<T> = Exclude<keyof T, number | symbol>;
type EnumValues<T> = T[EnumKeys<T>];

const scoringStrategies: EnumValues<typeof ApplicationScoringStrategy>[] = ['CUSTOM', 'AI'];
const applicationTypes: EnumValues<typeof ApplicationType>[] = ['SCORING', 'EVALUATION'];

const router = useRouter();
const formRef = ref();
const handleSubmit = ({ values, errors }) => {
	if (errors) {
		Message.error(`似乎还有东西没填哦(*/ω＼*)`);
		return;
	} else {
		Message.loading({
			duration: 10000,
			content: '正在创建应用，请稍等( ‵▽′)ψ',
		});
		addAppUsingPost({
			appDesc: values.description,
			appName: values.name,
			appType: values.type,
			scoringStrategy: values.scoring,
			appIcon: values.cover,
		}).then(response => {
			if (response.data.code === 0) {
				// Message.success(`创建成功！应用ID为${response.data.data}`,);
				router.push(`/application/detail/${response.data.data}`);
			} else {
				Message.error(`创建失败！${response.data.message}`);
			}
		});
	}
};

const form = reactive({
	size: 'medium',
	name: '',
	description: '',
	cover: '',
	type: 0,
	scoring: 0,
	options: [],
	radio: 'radio one',
});
</script>
