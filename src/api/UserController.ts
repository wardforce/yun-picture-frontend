// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** 创建用户 POST /user/add */
export async function addUser(body: API.UserAddRequest, options?: { [key: string]: any }) {
  return request<any>('/user/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 管理员删除用户 POST /user/delete */
export async function deleteUser(body: API.DeleteRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseBoolean>('/user/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 管理员根据 id 获取用户 GET /user/get */
export async function getUserById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getUserByIdParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseUser>('/user/get', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/** 获取当前登录用户 GET /user/get/login */
export async function getLoginUser(options?: { [key: string]: any }) {
  return request<any>('/user/get/login', {
    method: 'GET',
    ...(options || {}),
  })
}

/** 普通用户根据 id 获取包装类 GET /user/get/vo */
export async function getUserVoById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getUserVOByIdParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseUserVO>('/user/get/vo', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/** 分页查询用户 POST /user/list/page/vo */
export async function listUserPageVoByPage(
  body: API.UserQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageUserVO>('/user/list/page/vo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 用户登录 传入用户请求 POST /user/login */
export async function userLogin(body: API.UserLoginRequest, options?: { [key: string]: any }) {
  return request<any>('/user/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 用户退出 GET /user/logout */
export async function userLogout(options?: { [key: string]: any }) {
  return request<any>('/user/logout', {
    method: 'GET',
    ...(options || {}),
  })
}

/** 用户注册 用户注册 POST /user/register */
export async function userRegister(
  body: API.UserRegisterRequest,
  options?: { [key: string]: any }
) {
  return request<any>('/user/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 管理员更新用户 POST /user/update */
export async function updateUser(body: API.UserUpdateRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseBoolean>('/user/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
