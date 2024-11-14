<template>
	<div>
		<a-card>
			<h1>{{ app?.appName || '☆*: .｡. o(≧▽≦)o .｡.:*☆' }}</h1>
			<p>
				{{ app.appDesc }}
			</p>
			<h2 style="margin-bottom: 32px">{{ questions.at(currentQuestionNumber - 1)?.title }}</h2>
			<div>
				<a-radio-group
					direction="vertical"
					v-model="currentAnswer"
					:options="currentQuestionOptions"
				/>
			</div>
			<div style="margin-top: 32px">
				<a-space>
					<a-button
						type="primary"
						@click="prevQuestion"
						:disabled="currentQuestionNumber === 1"
						>上一题
					</a-button>
					<a-button
						type="primary"
						@click="handleSubmit"
						v-if="currentQuestionNumber === questions.length"
						>提交
					</a-button>
					<a-button
						type="primary"
						@click="nextQuestion"
						v-else
						:disabled="!currentAnswer"
						>下一题
					</a-button>
				</a-space>
			</div>
		</a-card>
	</div>
</template>
<script setup lang="ts">
import { computed, onBeforeMount, ref } from 'vue';
import { getAppVoByIdUsingGet } from '@/api/appController';
import { listQuestionVoByPageUsingPost } from '@/api/questionController';
import { Message } from '@arco-design/web-vue';
import { addUserAnswerUsingPost } from '@/api/userAnswerController';
import {useRouter} from 'vue-router';
import { getIdentifierUsingGet } from '@/api/identifierController';

interface Option {
	label: string;
	value: string;
	disabled: boolean;
}

const props = defineProps<{ appId: number }>();
const answers = ref<string[]>([]);

// starts from 1
const currentQuestionNumber = ref(1);
const currentAnswer = ref<string>('');
const app = ref<API.AppVO>({});
const identifier = ref<number>();
const questions = ref<API.QuestionDto[]>([]);
const currentQuestionOptions: Option[] = computed(() => {
	return questions.value.at(currentQuestionNumber.value - 1)?.options?.map(option => ({
		label: `${option.key}、 ${option.value}`,
		value: option.value,
	}));
});

const loadData = async () => {
	if (props.appId) {
		getAppVoByIdUsingGet({
			id: props.appId,
		})
			.then(res => {
				if (res.data.code === 0) {
					app.value = res.data?.data || {};
				} else {
					return Promise.reject(`应用加载失败-${res.data?.message || '未知错误'}`);
				}
			})
			.then(() =>
				listQuestionVoByPageUsingPost({
					current: 1,
					pageSize: 1,
					appId: props.appId,
				}),
			)
			.then(res => {
				if (res.data.code === 0) {
					questions.value = res.data.data?.records?.at(0)?.questionContent || [];
				} else {
					return Promise.reject(`题目加载失败-${res.data?.message || '未知错误'}`);
				}
			})
		.then(()=>getIdentifierUsingGet())
		.then(res=>{
			if(res.data.code === 0 ){
				identifier.value = res.data.data as number;
			}else{
				return Promise.reject(`标识符加载失败-${res.data?.message || '未知错误'}`);
			}
		})
			.catch(reason => {
				Message.error(`加载出错了(≧∀≦)ゞ:${reason}`);
			});
	} else {
		Message.error(`加载出错了(≧∀≦)ゞ:appId不能为空`);
	}
};

const nextQuestion = () => {
	if (currentQuestionNumber.value < questions.value.length) {
		answers.value[currentQuestionNumber.value - 1] = currentAnswer.value;
		currentQuestionNumber.value++;
		currentAnswer.value = answers.value[currentQuestionNumber.value - 1];
	}
};

const prevQuestion = () => {
	if (currentQuestionNumber.value > 1) {
		currentQuestionNumber.value--;
		currentAnswer.value = answers.value[currentQuestionNumber.value - 1];
	}
};
const router =useRouter();

const handleSubmit = () => {
	console.log(answers.value);
	answers.value[currentQuestionNumber.value - 1] = currentAnswer.value;
	Message.loading({
		duration: 10000,
		content: '提交中...',
	});
	addUserAnswerUsingPost({
		appId: props.appId,
		id:identifier.value,
		choices: answers.value,
	})
		.then(res => {
			Message.clear();
			if (res.data.code === 0) {
				Message.success(`提交成功(✿◠‿◠)`);
				router.push(`/application/evaluation/${props.appId}/result/${res.data.data}`);
			} else {
				return Promise.reject(`提交失败-${res.data?.message || '未知错误'}`);
			}
		})
		.catch(reason => {
			Message.error(`提交出错了(≧∀≦)ゞ:${reason}`);
		});
};
onBeforeMount(loadData);
</script>

<style scoped></style>
