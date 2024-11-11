<template>
	<a-form :model="questions" @submit="handleSubmit" :style="{ width:'50%', userSelect: 'none' }"
		label-align="left" auto-label-width>
		<a-form-item label="应用id">
			{{ appId }}
		</a-form-item>
		<a-form-item field="name" label="题目列表" :content-flex="false" :merge-props="false">
			<a-button @click="handleQuestionAdd">底部添加题目</a-button>
			<div class="questions-container">
				<div class="question" v-for="(question, index) in questions" :key="index"
				     :style="{ marginBottom: '40px' }">
					<a-space size="small" fill>
						<h3 style="float: left">题目 {{ index + 1 }}</h3>
						<a-button size="small" @click="handleQuestionAddAfter(index)">在该题后添加
						</a-button>
						<a-button status="danger" @click="handleQuestionDelete(index)"
							  size="small">删除题目
						</a-button>
					</a-space>
					<a-form-item :style="{marginBottom: '0px'}" :label="`题目 ${index + 1} 标题`">
						<a-input v-model="question.title" placeholder="请输入标题" />
					</a-form-item>
					<a-space size="large" fill>
						<h4>题目 {{ index + 1 }} 选项列表</h4>
						<a-button size="small" @click="handleOptionAdd(question)">底部添加选项
						</a-button>
					</a-space>
					<a-form-item :merge-props="false" :content-flex="false"
						     v-for="(option,optIndex) in question?.options || []"
						     :key="optIndex" :label="`选项 ${optIndex + 1}`">
						<a-form-item label="选项的 Key">
							<a-input v-model="option.key" placeholder="请输入选项内容" />
						</a-form-item>
						<a-form-item label="选项值">
							<a-input v-model="option.value" placeholder="请输入选项值" />
						</a-form-item>
						<a-form-item label="选项结果">
							<a-input v-model="option.result" placeholder="请输入选项内容" />
						</a-form-item>
						<a-form-item label="选项得分">
							<a-input-number  v-model="option.score" :default-value="0" placeholder="请输入选项值" />
						</a-form-item>
						<a-space fill>
							<a-button size="small"
								  @click="handleOptionAddAfter(question,optIndex)">
								在该选项后添加
							</a-button>
							<a-button size="small"
								  @click="handleOptionDelete(question, optIndex)"
								  status="danger">
								删除选项
							</a-button>
						</a-space>
					</a-form-item>
				</div>
			</div>
		</a-form-item>
		<a-form-item>
			<a-button type="primary" html-type="submit" :loading="!submitAvailable" size="large">提交
			</a-button>
		</a-form-item>
	</a-form>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import { addQuestionUsingPost, listQuestionVoByPageUsingPost, updateQuestionUsingPost } from '@/api/questionController';
import { Message } from '@arco-design/web-vue';
import { useRouter } from 'vue-router';

const props = defineProps<{
	appId: number
}>();


const submitAvailable = ref(true);
const loadQuestions = async () => {
	if (props.appId) {
		Message.loading({
			duration: 10000,
			content: '加载中'
		});
		submitAvailable.value = false;
		listQuestionVoByPageUsingPost({
			appId: props.appId,
			current: 1,
			pageSize: 1,
			sortField: 'createTime',
			sortOrder: 'descend'
		}).then(response => {
			Message.clear();
			if (response.data.code === 0 && response.data.data?.records) {
				const vo = response.data.data.records[0] as API.QuestionVO;
				questions.value = vo.questionContent as API.QuestionDto[];
				questionVoId.value = vo?.id || -1;
			} else {
				Message.error(`加载失败：${response.data?.message || '未知错误'}`);
			}
			submitAvailable.value = true;
		});
	} else {
		Message.error('appId 未知');
	}
};
const questions = ref<API.QuestionDto[]>([]);
const questionVoId = ref<number>(-1);
const router = useRouter();

const handleQuestionAdd = () => {
	questions.value.push({
		title: '',
		options: []
	});
};
const handleQuestionAddAfter = (index: number) => {
	questions.value.splice(index + 1, 0, {
		title: '',
		options: []
	});
};
const handleQuestionDelete = (index: number) => {
	questions.value.splice(index, 1);
};
const handleOptionAdd = (question: API.QuestionDto) => {
	question.options?.push({});
};
const handleOptionAddAfter = (question: API.QuestionDto, index: number) => {
	question.options?.splice(index + 1, 0, {});
};
const handleOptionDelete = (question: API.QuestionDto, index: number) => {
	question.options?.splice(index, 1);
};
const handleSubmit = ({ values, errors }) => {
	if (errors) {
		Message.error(`似乎还有东西没填哦(*/ω＼*)`);
		return;
	} else {
		Message.loading({
			duration: 10000,
			content: '正在创建应用，请稍等( ‵▽′)ψ'
		});
		if (questionVoId.value !== -1) {
			updateQuestionUsingPost({
				id: questionVoId.value,
				questionContent: questions.value
			}).then(response => {
				if (response.data.code === 0 && response.data.data) {
					Message.success('更新成功');
					router.push(`/application/detail/${props.appId}`);
				} else {
					Message.error(`更新失败！${response.data.message}`);
				}
			});
		} else {
			addQuestionUsingPost({
				appId: props.appId,
				questionContent: questions.value
			}).then(response => {
				if (response.data.code === 0) {
					// Message.success(`创建成功！应用ID为${response.data.data}`,);
					router.push(`/application/detail/${props.appId}`);
				} else {
					Message.error(`添加失败！${response.data.message}`);
				}
			});
		}
	}
};
onBeforeMount(loadQuestions);
</script>

<style scoped>
.questions-container {
	max-height: 640px;
	max-width: 80%;
	overflow-y: scroll;
	scroll-snap-align: start;
	scroll-snap-type: y mandatory;

	.question {
		scroll-snap-align: start;
		scroll-snap-stop: always;
	}

}
</style>