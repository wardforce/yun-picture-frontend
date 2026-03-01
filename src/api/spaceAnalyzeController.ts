// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** 获取空间分类统计 按图片分类统计空间使用情况，返回各分类的图片数量和占用容量 POST /space/analyze/category */
export async function getSpaceCategoryAnalyze(
  body: API.SpaceCategoryAnalyzeRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseListSpaceCategoryAnalyzeResponse>('/space/analyze/category', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 空间排行分析 获取空间排行分析结果，仅管理员可访问，返回排名前 N 的空间列表 POST /space/analyze/rank */
export async function getSpaceRankAnalyze(
  body: API.SpaceRankAnalyzeRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseListSpace>('/space/analyze/rank', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 用户上传图片大小分析 POST /space/analyze/size */
export async function getSpaceSizeAnalyze(
  body: API.SpaceSizeAnalyzeRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseListSpaceSizeAnalyzeResponse>('/space/analyze/size', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 获取空间标签分析 统计空间内图片标签的使用频率，返回各标签的使用次数 POST /space/analyze/tag */
export async function getSpaceTagAnalyze(
  body: API.SpaceTagAnalyzeRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseListSpaceTagAnalyzeResponse>('/space/analyze/tag', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 获取空间使用状态 查询指定空间的使用情况，包括已用容量、剩余容量、使用百分比等信息 POST /space/analyze/usage */
export async function getSpaceUsageAnalyze(
  body: API.SpaceUsageAnalyzeRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseSpaceUsageAnalyzeResponse>('/space/analyze/usage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 空间用户分析 统计空间内用户的活跃度，返回各用户的上传图片数量和最后一次上传时间 POST /space/analyze/user */
export async function getSpaceUserAnalyze(
  body: API.SpaceUserAnalyzeRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseListSpaceUserAnalyzeResponse>('/space/analyze/user', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
