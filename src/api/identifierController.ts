// @ts-ignore
/* eslint-disable */
import request from '@/utils/httpInstance';

/** getIdentifier GET /api/identifier/snowflake */
export async function getIdentifierUsingGet(options?: { [key: string]: any }) {
  return request<API.BaseResponseLong_>('/api/identifier/snowflake', {
    method: 'GET',
    ...(options || {}),
  });
}
