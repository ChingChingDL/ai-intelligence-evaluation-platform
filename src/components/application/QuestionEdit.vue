<template>
	<a-modal
		v-model:visible="modalVisible"
		@ok="modalVisible = false"
		ok-text="关闭"
		:ok-button-props="{ type: 'outline' }"
		mask-closable
		draggable
		esc-to-close
		hide-cancel
		simple
	>
		<a-form
			ref="modalFormRef"
			size="large"
			:model="modalForm"
			@submit="handleModalSubmit"
		>
			<a-form-item
				field="questions"
				label="题目数"
				:rules="[
					{ required: true, message: '必须要填哦' },
					{ min: 4, message: '至少要 4 道题哦' },
				]"
				:validate-trigger="['change', 'input']"
			>
				<a-input-number
					v-model="modalForm.questions"
					placeholder="生成的题目数量"
				/>
			</a-form-item>

			<a-form-item
				field="options"
				label="选项数"
				:rules="[
					{ required: true, message: '不能为空哦ᓚᘏᗢ' },
					{ min: 2, message: '至少要 2 个选项哦' },
				]"
			>
				<a-input-number
					v-model="modalForm.options"
					placeholder="每道题的选项数（。＾▽＾）"
				/>
			</a-form-item>

			<a-form-item>
				<a-space>
					<a-button
						:loading="waitingForAIResponse"
						html-type="submit"
						type="primary"
						>生成
					</a-button>
					<a-button @click="modalFormRef.resetFields()">Reset</a-button>
				</a-space>
			</a-form-item>
		</a-form>
	</a-modal>
	<a-form
		:model="questions"
		@submit="handleSubmit"
		:style="{ width: '50%', userSelect: 'none' }"
		label-align="left"
		auto-label-width
	>
		<a-form-item label="应用id">
			{{ appId }}
		</a-form-item>
		<a-form-item
			field="name"
			label="题目列表"
			:content-flex="false"
			:merge-props="false"
		>
			<a-space>
				<a-button @click="handleQuestionAdd">底部添加题目</a-button>
				<a-button
					type="outline"
					@click="modalVisible = true"
					>AI 生成题目
				</a-button>
			</a-space>
			<div class="questions-container" ref="questionsContainerRef">
				<div
					class="question"
					v-for="(question, index) in questions"
					:key="index"
					:style="{ marginBottom: '40px' }"
				>
					<a-space
						size="small"
						fill
					>
						<h3 style="float: left">题目 {{ index + 1 }}</h3>
						<a-button
							size="small"
							@click="handleQuestionAddAfter(index)"
							>在该题后添加
						</a-button>
						<a-button
							status="danger"
							@click="handleQuestionDelete(index)"
							size="small"
							>删除题目
						</a-button>
					</a-space>
					<a-form-item
						:style="{ marginBottom: '0px' }"
						:label="`题目 ${index + 1} 标题`"
					>
						<a-input
							v-model="question.title"
							placeholder="请输入标题"
						/>
					</a-form-item>
					<a-space
						size="large"
						fill
					>
						<h4>题目 {{ index + 1 }} 选项列表</h4>
						<a-button
							size="small"
							@click="handleOptionAdd(question)"
							>底部添加选项
						</a-button>
					</a-space>
					<a-form-item
						:merge-props="false"
						:content-flex="false"
						v-for="(option, optIndex) in question?.options || []"
						:key="optIndex"
						:label="`选项 ${optIndex + 1}`"
					>
						<a-form-item label="选项的 Key">
							<a-input
								v-model="option.key"
								placeholder="请输入选项内容"
							/>
						</a-form-item>
						<a-form-item label="选项值">
							<a-input
								v-model="option.value"
								placeholder="请输入选项值"
							/>
						</a-form-item>
						<a-form-item label="选项结果">
							<a-input
								v-model="option.result"
								placeholder="请输入选项内容"
							/>
						</a-form-item>
						<a-form-item label="选项得分">
							<a-input-number
								v-model="option.score"
								:default-value="0"
								placeholder="请输入选项值"
							/>
						</a-form-item>
						<a-space fill>
							<a-button
								size="small"
								@click="handleOptionAddAfter(question, optIndex)"
							>
								在该选项后添加
							</a-button>
							<a-button
								size="small"
								@click="handleOptionDelete(question, optIndex)"
								status="danger"
							>
								删除选项
							</a-button>
						</a-space>
					</a-form-item>
				</div>
			</div>
		</a-form-item>
		<a-form-item>
			<a-button
				type="primary"
				html-type="submit"
				:loading="!submitAvailable"
				size="large"
				>提交
			</a-button>
		</a-form-item>
	</a-form>
</template>

<script setup lang="ts">
import { onBeforeMount, onMounted, onUnmounted, ref } from 'vue';
import { addQuestionUsingPost, listQuestionVoByPageUsingPost, updateQuestionUsingPost } from '@/api/questionController';
import { Message } from '@arco-design/web-vue';
import { useRouter } from 'vue-router';
// import { generateQuestionUsingPost } from '@/api/aiController';

const props = defineProps<{
	appId: number;
}>();

const questionsContainerRef = ref();
const submitAvailable = ref(true);
const loadQuestions = async () => {
	if (props.appId) {
		Message.loading({
			duration: 10000,
			content: '加载中',
		});
		submitAvailable.value = false;
		listQuestionVoByPageUsingPost({
			appId: props.appId,
			current: 1,
			pageSize: 1,
			sortField: 'createTime',
			sortOrder: 'descend',
		}).then(response => {
			Message.clear();
			if (response.data.code === 0 && response.data.data?.records) {
				const vo = (response.data.data?.records[0] as API.QuestionVO) || {};
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
const modalVisible = ref(false);
const modalForm = ref<{
	questions: number;
	options: number;
}>({ questions: 0, options: 0 });
const modalFormRef = ref();
const waitingForAIResponse = ref(false);
const handleModalSubmit = () => {
	waitingForAIResponse.value = false;
	modalVisible.value = false;
	Message.loading({
		duration: 0,
		content: '正在生成中...',
	});
	const eventSource = new EventSource(`http://localhost:8101/api/ai/post/stream?appId=${props.appId}&questionNumber=${modalForm.value.questions}&optionNumber=${modalForm.value.options}`);
	// eventSource.onopen = function () {
	// 	Message.loading({
	// 		duration: 0,
	// 		content: '正在生成中...',
	// 	});
	// };
	eventSource.onmessage = function (event: MessageEvent) {
		const question = JSON.parse(event.data) as API.QuestionDto;
		questions.value.push(question);
		scrollToBottom();
		console.log(question);
	};
	eventSource.onerror = function (event: MessageEvent) {
		Message.clear();
		if (event.eventPhase === EventSource.CLOSED) {
			Message.success(`生成完毕`);
		} else {
			Message.error('出错了');
		}
		eventSource.close();
	};

	// generateQuestionUsingPost({
	// 	appId: props.appId,
	// 	questionNumber: modalForm.value.questions,
	// 	optionNumber: modalForm.value.options,
	// })
	// 	.then(response => {
	// 		if (response.data.code === 0) {
	// 			questions.value = response.data.data as API.QuestionDto[];
	// 		} else {
	// 			return Promise.reject(response.data?.message || '未知错误');
	// 		}
	// 		waitingForAIResponse.value = true;
	// 		modalVisible.value = false;
	// 	})
	// 	.catch(reason => Message.error(`操作失败：${reason}`));
};

const  scrollToBottom = ()=> {

	if (questionsContainerRef.value) {
		questionsContainerRef.value.scrollTop = questionsContainerRef.value.scrollHeight;
	}
};

const handleQuestionAdd = () => {
	questions.value.push({
		title: '',
		options: [],
	});
};
const handleQuestionAddAfter = (index: number) => {
	questions.value.splice(index + 1, 0, {
		title: '',
		options: [],
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
	} else if (!values) {
		Message.error(`先填点东西吧(*/ω＼*)`);
		return;
	} else {
		Message.loading({
			duration: 10000,
			content: '正在创建应用，请稍等( ‵▽′)ψ',
		});
		if (questionVoId.value !== -1) {
			updateQuestionUsingPost({
				id: questionVoId.value,
				questionContent: questions.value,
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
				questionContent: questions.value,
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

onMounted(()=>{
	window.addEventListener('resize', scrollToBottom);
});
onUnmounted(()=>{
	window.removeEventListener('resize', scrollToBottom);
});

</script>

<style scoped>
.questions-container {
	max-height: 640px;
	max-width: 80%;
	overflow-y: scroll;
	scroll-snap-align: start;
	scroll-snap-type: y mandatory;
	transition: all 0.5s ease-in-out;
	.question {
		scroll-snap-align: start;
		scroll-snap-stop: always;
	}
}
</style>
