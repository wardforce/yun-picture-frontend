// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** 添加空间 添加空间接口 POST /space/add */
export async function addSpace(body: API.SpaceAddRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseLong>('/space/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 删除空间 仅本人或管理员可删除指定空间 DELETE /space/delete */
export async function deleteSpace(body: API.DeleteRequest, options?: { [key: string]: any }) {
  return request<any>('/space/delete', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 编辑空间 仅本人或管理员可以编辑空间 POST /space/edit */
export async function editSpace(body: API.SpaceEditRequest, options?: { [key: string]: any }) {
  return request<any>('/space/edit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 根据 id 获取空间（仅管理员） GET /space/get */
export async function getSpaceById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getSpaceByIdParams,
  options?: { [key: string]: any }
) {
  return request<any>('/space/get', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/** 根据 id 获取空间（VO） GET /space/get/vo */
export async function getSpaceVoById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getSpaceVOByIdParams,
  options?: { [key: string]: any }
) {
  return request<any>('/space/get/vo', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/** 获取空间等级配置 获取空间等级配置接口 GET /space/list/level */
export async function listSpaceLevel(options?: { [key: string]: any }) {
  return request<API.BaseResponseListSpaceLevel>('/space/list/level', {
    method: 'GET',
    ...(options || {}),
  })
}

/** 分页获取空间列表（仅管理员） POST /space/list/page */
export async function listSpaceByPage(
  body: API.SpaceQueryRequest,
  options?: { [key: string]: any }
) {
  return request<any>('/space/list/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 分页获取空间列表（VO） 限制单页大小不超过20 POST /space/list/page/vo */
export async function listSpaceVoByPage(
  body: API.SpaceQueryRequest,
  options?: { [key: string]: any }
) {
  return request<any>('/space/list/page/vo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 更新空间（仅管理员） 管理员更新空间的名称、描述、标签等信息 POST /space/update */
export async function updateSpace(body: API.SpaceUpdateRequest, options?: { [key: string]: any }) {
  return request<any>('/space/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
