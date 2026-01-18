// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** 创建用户 管理员创建新用户（默认密码：12345678） POST /user/add */
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

/** 删除用户 管理员删除用户 POST /user/delete */
export async function deleteUser(body: API.DeleteRequest, options?: { [key: string]: any }) {
  return request<any>('/user/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 邮箱验证码登录 使用邮箱和验证码进行登录 POST /user/email/login */
export async function emailLogin(body: API.EmailLoginRequest, options?: { [key: string]: any }) {
  return request<any>('/user/email/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 邮箱验证码重置密码 使用邮箱验证码重置密码 POST /user/email/resetPassword */
export async function emailResetPassword(
  body: API.EmailResetPasswordRequest,
  options?: { [key: string]: any }
) {
  return request<any>('/user/email/resetPassword', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 发送邮箱验证码 发送邮箱验证码用于登录或重置密码 POST /user/email/sendCode */
export async function sendEmailCode(
  body: API.EmailSendCodeRequest,
  options?: { [key: string]: any }
) {
  return request<any>('/user/email/sendCode', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 根据 id 获取用户（仅管理员） 管理员根据 id 获取用户详情 GET /user/get */
export async function getUserById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getUserByIdParams,
  options?: { [key: string]: any }
) {
  return request<any>('/user/get', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/** 获取当前登录用户 获取当前会话中的登录用户信息 GET /user/get/login */
export async function getLoginUser(options?: { [key: string]: any }) {
  return request<any>('/user/get/login', {
    method: 'GET',
    ...(options || {}),
  })
}

/** 根据 id 获取用户包装类 普通用户根据 id 获取包装类（内部复用管理员接口） GET /user/get/vo */
export async function getUserVoById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getUserVOByIdParams,
  options?: { [key: string]: any }
) {
  return request<any>('/user/get/vo', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/** 分页获取用户（VO） 分页查询用户并返回 UserVO 列表 POST /user/list/page/vo */
export async function listUserPageVoByPage(
  body: API.UserQueryRequest,
  options?: { [key: string]: any }
) {
  return request<any>('/user/list/page/vo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 用户登录 传入用户账号与密码进行登录 POST /user/login */
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

/** 用户退出 退出当前登录会话 GET /user/logout */
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

/** 更新用户 管理员更新用户 POST /user/update */
export async function updateUser(body: API.UserUpdateRequest, options?: { [key: string]: any }) {
  return request<any>('/user/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 用户编辑自己的信息 管理员更新用户 POST /user/update/themself */
export async function updateUserByThemself(
  body: API.UserUpdateByThemSelfRequest,
  options?: { [key: string]: any }
) {
  return request<any>('/user/update/themself', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 用户修改自己的密码 用户通过旧密码修改新密码 POST /user/update/themself/password */
export async function updateUserPassword(
  body: API.UserUpdatePasswordRequest,
  options?: { [key: string]: any }
) {
  return request<any>('/user/update/themself/password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
