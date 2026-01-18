// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** AI生成图片 第二阶段：调用AI生成图片 POST /ai_picture_generator/generate_ai_image */
export async function generateAiImage(
  body: API.CreateChatRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseAiGenerateResponse>('/ai_picture_generator/generate_ai_image', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 生成图片(测试) 根据文字或文字+图片生成新图片（一次性完成） POST /ai_picture_generator/generate_picture */
export async function generatePicture(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.generatePictureParams,
  body: {},
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

  return request<API.BaseResponseImageResponse>('/ai_picture_generator/generate_picture', {
    method: 'POST',
    params: {
      ...params,
    },
    data: formData,
    requestType: 'form',
    ...(options || {}),
  })
}
