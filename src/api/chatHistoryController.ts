// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** 删除聊天记录 删除单条聊天记录及其关联图片，管理员或记录所有者可操作 POST /api/chat-history/delete */
export async function deleteById(body: API.DeleteRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseBoolean>('/api/chat-history/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 删除会话 删除整个会话及其所有消息，管理员或会话所有者可操作 POST /api/chat-history/session/delete */
export async function deleteBySession(
  body: API.DeleteBySessionRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean>('/api/chat-history/session/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 查询会话详情 管理员或会话所有者可查看 POST /api/chat-history/session/detail */
export async function getSessionDetail(
  body: API.ChatHistoryDetailQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageChatHistoryDetailVO>('/api/chat-history/session/detail', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 管理员查询会话列表 仅管理员可用，查询所有用户的会话列表 POST /api/chat-history/session/list/admin */
export async function listSessionByAdmin(
  body: API.ChatHistorySessionQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageChatHistorySessionVO>('/api/chat-history/session/list/admin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 查询我的会话列表 用户查询自己的会话列表 POST /api/chat-history/session/list/my */
export async function listMySession(
  body: API.ChatHistorySessionQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageChatHistorySessionVO>('/api/chat-history/session/list/my', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
