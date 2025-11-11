// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** 健康检查 检查系统是否运行正常 GET /health */
export async function health(options?: { [key: string]: any }) {
  return request<any>('/health', {
    method: 'GET',
    ...(options || {}),
  })
}
