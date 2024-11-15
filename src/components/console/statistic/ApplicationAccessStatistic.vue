<template>
	<div>
		<a-card>

			<h2>应用访问 TOP 10</h2>
			<v-chart
				:option="option"
				:style="{ height: '300px' }"
			/>
		</a-card>

		<a-card>
			<h2>应用结果分布</h2>
			<a-input-search
				v-model="searchAppId"
				@search="handleSearch"
				:loading="searching"
				:style="{width:'300px',marginBottom:'10px'}"
				placeholder="请输入应用ID"
				allow-clear
				search-button
			/>
			<v-chart
				:option="pieOption"
				:style="{ height: '600px' }"
			/>
		</a-card>
	</div>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, ref } from 'vue';
import 'echarts';
import VChart from 'vue-echarts';
import { getAnswerCountUsingGet, getAnswerResultDistributionUsingGet } from '@/api/statisticController';
import { Message } from '@arco-design/web-vue';

const accessStatisticData = ref<API.AppAnswerCount[]>([]);
const resultDistributionData = ref<API.ResultAnswerCount[]>([]);
const option = computed(() => {
	return {
		xAxis: {
			type: 'category',
			data: accessStatisticData.value?.map(item => item.appId) || [],
			name: '应用 ID',
		},
		yAxis: {
			type: 'value',
			name: '访问用户数',
		},
		tooltip: {
			trigger: 'item'
		},
		series: [
			{
				data: accessStatisticData.value?.map(item => item.userCount) || [],
				type: 'bar',
			},
		],
	};
});
const pieOption = computed(() => {
	return {
		legend: {
			top: 'bottom',
		},
		toolbox: {
			show: true,
			feature: {
				mark: { show: true },
				dataView: { show: true, readOnly: false },
				restore: { show: true },
				saveAsImage: { show: true },
			},
		},
		tooltip: {
			trigger: 'item'
		},
		series: [
			{
				name: '应用结果分布',
				type: 'pie',
				radius: [50, 250],
				center: ['50%', '50%'],
				roseType: 'area',
				itemStyle: {
					borderRadius: 8,
				},
				data: resultDistributionData.value.map(item => {
					return { value: item.answerCount, name: item.resultName };
				}),
			},
		],
	};
});

const searchAppId = ref<number>();
const searching = ref<boolean>(false);
const handleSearch = () => {
	if(!searchAppId.value) {
		Message.info('应用 ID 不能为空');
		return ;
	}
	searching.value = true;
	getAnswerResultDistributionUsingGet({ appId: searchAppId.value })
		.then(response => {
			searching.value = false;
			if (response.data.code === 0) {
				resultDistributionData.value = (response.data?.data as API.ResultAnswerCount[]) || [];
			} else {
				return Promise.reject(response.data?.message || '未知错误');
			}
		})
		.catch(err => {
			Message.error(`操作失败：${err}`);
		});
};

const loadAccessStatisticData = () => {
	getAnswerCountUsingGet()
		.then(res => {
			if (res.data.code === 0) {
				accessStatisticData.value = (res.data?.data as API.AppAnswerCount[]) || [];
			} else {
				return Promise.reject(res.data?.message || '未知错误');
			}
		})
		.catch(err => {
			Message.error(`操作失败：${err}`);
		});
};

onBeforeMount(loadAccessStatisticData);
</script>

<style scoped></style>