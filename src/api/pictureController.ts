// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** 删除图片 仅本人或管理员可删除指定图片 DELETE /picture/delete */
export async function deletePicture(body: API.DeleteRequest, options?: { [key: string]: any }) {
  return request<any>('/picture/delete', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 编辑图片 仅本人或管理员可以编辑图片 POST /picture/edit */
export async function editPicture(body: API.PictureEditRequest, options?: { [key: string]: any }) {
  return request<any>('/picture/edit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 批量编辑图片 批量编辑图片 POST /picture/edit/batch */
export async function editPictureByBatch(
  body: API.PictureEditByBatchRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean>('/picture/edit/batch', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 根据 id 获取图片（仅管理员） GET /picture/get */
export async function getPictureById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getPictureByIdParams,
  options?: { [key: string]: any }
) {
  return request<any>('/picture/get', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/** 根据 id 获取图片（VO） GET /picture/get/vo */
export async function getPictureVoById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getPictureVOByIdParams,
  options?: { [key: string]: any }
) {
  return request<any>('/picture/get/vo', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/** 分页获取图片列表（仅管理员） POST /picture/list/page */
export async function listPictureByPage(
  body: API.PictureQueryRequest,
  options?: { [key: string]: any }
) {
  return request<any>('/picture/list/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 分页获取图片列表（VO） 限制单页大小不超过20 POST /picture/list/page/vo */
export async function listPictureVoByPage(
  body: API.PictureQueryRequest,
  options?: { [key: string]: any }
) {
  return request<any>('/picture/list/page/vo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 分页获取图片列表（VO） 限制单页大小不超过20 POST /picture/list/page/vo/cache */
export async function listPictureVoByPageCache(
  body: API.PictureQueryRequest,
  options?: { [key: string]: any }
) {
  return request<any>('/picture/list/page/vo/cache', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 扩图 扩图 POST /picture/out_painting/create_task */
export async function createOutPaintingTask(
  body: API.CreatePictureOutPaintingTaskRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseCreateOutPaintingTaskResponse>(
    '/picture/out_painting/create_task',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: body,
      ...(options || {}),
    }
  )
}

/** 此处后端没有提供注释 GET /picture/out_painting/get_task */
export async function getOutPaintingTask(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getOutPaintingTaskParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseGetOutPaintingTaskResponse>('/picture/out_painting/get_task', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/** 审核图片 审核图片 POST /picture/review */
export async function doPictureReview(
  body: API.PictureUpdataRequest,
  options?: { [key: string]: any }
) {
  return request<any>('/picture/review', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 根据颜色搜索图片 根据颜色搜索图片 POST /picture/search/color */
export async function searchPictureByColor(
  body: API.SearchPictureByColorRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseListPictureVO>('/picture/search/color', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 以图搜图 以图搜图 POST /picture/search/picture */
export async function searchPictureByPictureIsSo(
  body: API.SearchPictureByPictureRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseListSoImageSearchResult>('/picture/search/picture', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 获取图片标签与分类枚举 返回前端可用的标签和分类列表 GET /picture/tag_category */
export async function listPictureTagCategory(options?: { [key: string]: any }) {
  return request<any>('/picture/tag_category', {
    method: 'GET',
    ...(options || {}),
  })
}

/** 更新图片（仅管理员） 管理员更新图片的名称、描述、标签等信息 POST /picture/update */
export async function updatePicture(
  body: API.PictureUpdataRequest,
  options?: { [key: string]: any }
) {
  return request<any>('/picture/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 上传图片（可重新上传） 已存在同名时覆盖更新 POST /picture/upload */
export async function uploadPicture(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.uploadPictureParams,
  body: {
    pictureUploadRequest?: API.PictureUploadRequest
  },
  file?: File,
  options?: { [key: string]: any }
) {
  const formData = new FormData()

  if (file) {
    formData.append('file', file)
  }

  Object.keys(body).forEach((ele) => {
    const item = (body as any)[ele]

    if (item !== undefined && item !== null) {
      if (typeof item === 'object' && !(item instanceof File)) {
        if (item instanceof Array) {
          item.forEach((f) => formData.append(ele, f || ''))
        } else {
          formData.append(ele, new Blob([JSON.stringify(item)], { type: 'application/json' }))
        }
      } else {
        formData.append(ele, item)
      }
    }
  })

  return request<any>('/picture/upload', {
    method: 'POST',
    params: {
      ...params,
    },
    data: formData,
    requestType: 'form',
    ...(options || {}),
  })
}

/** 批量上传图片,仅仅管理员可用 批量上传图片 POST /picture/upload/batch */
export async function uploadPictureByBatch(
  body: API.PictureUploadByBatchRequest,
  options?: { [key: string]: any }
) {
  return request<any>('/picture/upload/batch', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 通过url上传图片（可重新上传） 已存在同名时覆盖更新 POST /picture/upload/url */
export async function uploadPictureByUrl(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.uploadPictureByUrlParams,
  body: API.PictureUploadRequest,
  options?: { [key: string]: any }
) {
  return request<any>('/picture/upload/url', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    params: {
      ...params,
    },
    data: body,
    ...(options || {}),
  })
}
