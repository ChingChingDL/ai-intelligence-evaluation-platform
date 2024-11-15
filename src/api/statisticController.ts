// @ts-ignore
/* eslint-disable */
import request from '@/utils/httpInstance';

/** getAnswerCount GET /api/statistic/answer-count */
export async function getAnswerCountUsingGet(options?: { [key: string]: any }) {
  return request<API.BaseResponseListAppAnswerCount_>('/api/statistic/answer-count', {
    method: 'GET',
    ...(options || {}),
  });
}

/** getAnswerResultDistribution GET /api/statistic/answer-result-distribution/${param0} */
export async function getAnswerResultDistributionUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getAnswerResultDistributionUsingGETParams,
  options?: { [key: string]: any }
) {
  const { appId: param0, ...queryParams } = params;
  return request<API.BaseResponseListResultAnswerCount_>(`/api/statistic/answer-result-distribution/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}
