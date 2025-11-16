declare namespace API {
  type BaseResponseBoolean = {
    code?: number
    data?: boolean
    message?: string
  }

  type BaseResponseLoginUserVO = {
    code?: number
    data?: LoginUserVO
    message?: string
  }

  type BaseResponseLong = {
    code?: number
    data?: number
    message?: string
  }

  type BaseResponsePageUserVO = {
    code?: number
    data?: PageUserVO
    message?: string
  }

  type BaseResponseString = {
    code?: number
    data?: string
    message?: string
  }

  type BaseResponseUser = {
    code?: number
    data?: User
    message?: string
  }

  type BaseResponseUserVO = {
    code?: number
    data?: UserVO
    message?: string
  }

  type DeleteRequest = {
    id?: number
  }

  type getUserByIdParams = {
    id: number
  }

  type getUserVOByIdParams = {
    id: number
  }

  type LoginUserVO = {
    id?: number
    userAccount?: string
    userName?: string
    userAvatar?: string
    userProfile?: string
    userRole?: string
    editTime?: string
    createTime?: string
    updateTime?: string
    vipExpireTime?: string
    vipNumber?: number
    inviteUser?: number
    phoneNumber?: number
    email?: string
    phoneCountryCode?: string
  }

  type OrderItem = {
    column?: string
    asc?: boolean
  }

  type PageUserVO = {
    records?: UserVO[]
    total?: number
    size?: number
    current?: number
    orders?: OrderItem[]
    optimizeCountSql?: PageUserVO
    searchCount?: PageUserVO
    optimizeJoinOfCountSql?: boolean
    maxLimit?: number
    countId?: string
    pages?: number
  }

  type User = {
    /** 用户 id */
    id?: number
    /** 用户账号 */
    userAccount: string
    /** 用户密码 */
    userPassword: string
    /** 用户昵称 */
    userName?: string
    /** 用户头像 */
    userAvatar?: string
    /** 用户简介 */
    userProfile?: string
    /** 用户角色 */
    userRole?: string
    /** 编辑时间 */
    editTime?: string
    /** 创建时间 */
    createTime?: string
    /** 更新时间 */
    updateTime?: string
    isDelete?: number
    /** 会员过期时间 */
    vipExpireTime?: string
    /** 会员兑换码 */
    vipCode?: string
    /** 会员编号 */
    vipNumber?: number
    /** 分享码 */
    shareCode?: string
    /** 邀请用户 id */
    inviteUser?: number
    /** 手机号 */
    phoneNumber?: number
    /** 邮箱 */
    email?: string
    /** 国家代码 */
    phoneCountryCode?: string
    /** 会员等级 */
    vipLevel?: string
  }

  type UserAddRequest = {
    /** 用户昵称 */
    userName: string
    /** 账号 */
    userAccount: string
    /** 用户头像 URL */
    userAvatar?: string
    /** 用户简介 */
    userProfile?: string
    /** 用户角色 */
    userRole?: 'user' | 'admin' | 'vip'
    /** VIP 编号 */
    vipNumber?: number
    vipLevel?: string
    /** 手机号 */
    phoneNumber?: number
    /** 邮箱 */
    email?: string
    /** 手机国家码 */
    phoneCountryCode?: string
  }

  type UserLoginRequest = {
    /** 用户账号 */
    userAccount?: string
    /** 用户密码 */
    userPassword?: string
  }

  type UserQueryRequest = {
    current?: number
    pageSize?: number
    sortField?: string
    sortOrder?: string
    /** 用户id */
    id?: number
    /** 用户昵称 */
    userName?: string
    /** 用户账号 */
    userAccount?: string
    /** 用户简介 */
    userProfile?: string
    /** 用户角色 */
    userRole?: string
    /** 用户vip编号 */
    vipNumber?: number
    /** 用户vip等级 */
    vipLevel?: string
    /** 会员过期时间 */
    vipExpireTime?: string
    /** 邀请人id */
    inviteUser?: number
    /** 分享码 */
    shareCode?: string
    /** 手机号 */
    phoneNumber?: number
    /** 会员兑换码 */
    vipCode?: string
    /** 邮箱 */
    email?: string
    /** 手机国家代码 */
    phoneCountryCode?: string
    /** 编辑时间 */
    editTime?: string
    /** 创建时间 */
    createTime?: string
    /** 更新时间 */
    updateTime?: string
  }

  type UserRegisterRequest = {
    userAccount?: string
    userPassword?: string
    checkPassword?: string
  }

  type UserUpdateRequest = {
    id?: number
    userName?: string
    /** 用户头像 */
    userAvatar?: string
    /** 用户简介 */
    userProfile?: string
    /** 用户角色 */
    userRole?: string
    /** 用户vip编号 */
    vipNumber?: number
    /** 用户手机号 */
    phoneNumber?: number
    /** 用户邮箱 */
    email?: string
    /** 用户vip等级 */
    vipLevel?: string
    /** 用户手机号国家代码 */
    phoneCountryCode?: string
    /** 会员过期时间 */
    vipExpireTime?: string
  }

  type UserVO = {
    /** 用户id */
    id?: number
    /** 用户昵称 */
    userName?: string
    /** 用户账号 */
    userAccount?: string
    /** 用户头像 */
    userAvatar?: string
    /** 会员兑换码 */
    vipCode?: string
    /** 用户简介 */
    userProfile?: string
    /** 用户角色 */
    userRole?: string
    /** 用户vip编号 */
    vipNumber?: number
    /** 用户vip等级 */
    vipLevel?: string
    /** 会员过期时间 */
    vipExpireTime?: string
    /** 邀请人id */
    inviteUser?: number
    /** 分享码 */
    shareCode?: string
    /** 手机号 */
    phoneNumber?: number
    /** 邮箱 */
    email?: string
    /** 手机国家代码 */
    phoneCountryCode?: string
    /** 编辑时间 */
    editTime?: string
    /** 创建时间 */
    createTime?: string
    /** 更新时间 */
    updateTime?: string
  }
}
