// @ts-ignore
/* eslint-disable */
import request from '@/utils/httpInstance';

/** generateQuestion POST /api/ai/post */
export async function generateQuestionUsingPost(body: API.AiGenerationQuestionCommand, options?: { [key: string]: any }) {
  return request<API.BaseResponseListQuestionDto_>('/api/ai/post', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** generateQuestionStream GET /api/ai/post/stream */
export async function generateQuestionStreamUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.generateQuestionStreamUsingGETParams,
  options?: { [key: string]: any }
) {
  return request<API.SseEmitter>('/api/ai/post/stream', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
