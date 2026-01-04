declare namespace API {
  type BaseResponseBoolean = {
    code?: number
    data?: boolean
    message?: string
  }

  type BaseResponseCreateOutPaintingTaskResponse = {
    code?: number
    data?: CreateOutPaintingTaskResponse
    message?: string
  }

  type BaseResponseGetOutPaintingTaskResponse = {
    code?: number
    data?: GetOutPaintingTaskResponse
    message?: string
  }

  type BaseResponseInteger = {
    code?: number
    data?: number
    message?: string
  }

  type BaseResponseListPictureVO = {
    code?: number
    data?: PictureVO[]
    message?: string
  }

  type BaseResponseListSoImageSearchResult = {
    code?: number
    data?: SoImageSearchResult[]
    message?: string
  }

  type BaseResponseListSpaceLevel = {
    code?: number
    data?: SpaceLevel[]
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

  type BaseResponsePagePicture = {
    code?: number
    data?: PagePicture
    message?: string
  }

  type BaseResponsePagePictureVO = {
    code?: number
    data?: PagePictureVO
    message?: string
  }

  type BaseResponsePageSpace = {
    code?: number
    data?: PageSpace
    message?: string
  }

  type BaseResponsePageSpaceVO = {
    code?: number
    data?: PageSpaceVO
    message?: string
  }

  type BaseResponsePageUserVO = {
    code?: number
    data?: PageUserVO
    message?: string
  }

  type BaseResponsePicture = {
    code?: number
    data?: Picture
    message?: string
  }

  type BaseResponsePictureTagCategory = {
    code?: number
    data?: PictureTagCategory
    message?: string
  }

  type BaseResponsePictureVO = {
    code?: number
    data?: PictureVO
    message?: string
  }

  type BaseResponseSpace = {
    code?: number
    data?: Space
    message?: string
  }

  type BaseResponseSpaceVO = {
    code?: number
    data?: SpaceVO
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

  type CreateOutPaintingTaskResponse = {
    output?: Output
    code?: string
    message?: string
    requestId?: string
  }

  type CreatePictureOutPaintingTaskRequest = {
    pictureId?: number
    parameters?: Parameters
  }

  type DeleteRequest = {
    id?: number
  }

  type getOutPaintingTaskParams = {
    taskId: string
  }

  type GetOutPaintingTaskResponse = {
    requestId?: string
    output?: Output
  }

  type getPictureByIdParams = {
    /** 图片ID */
    id: number
  }

  type getPictureVOByIdParams = {
    /** 图片ID */
    id: number
  }

  type getSpaceByIdParams = {
    /** 空间ID */
    id: number
  }

  type getSpaceVOByIdParams = {
    /** 空间ID */
    id: number
  }

  type getUserByIdParams = {
    /** 用户ID */
    id: number
  }

  type getUserVOByIdParams = {
    /** 用户ID */
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
    /** 会员编号 */
    vipNumber?: number
    /** 会员等级 */
    vipLevel?: string
    inviteUser?: number
    phoneNumber?: number
    email?: string
    phoneCountryCode?: string
  }

  type OrderItem = {
    column?: string
    asc?: boolean
  }

  type Output = {
    [x: string]: string
    taskId?: string
    taskStatus?: string
  }

  type PagePicture = {
    records?: Picture[]
    total?: number
    size?: number
    current?: number
    orders?: OrderItem[]
    optimizeCountSql?: PagePicture
    searchCount?: PagePicture
    optimizeJoinOfCountSql?: boolean
    maxLimit?: number
    countId?: string
    pages?: number
  }

  type PagePictureVO = {
    records?: PictureVO[]
    total?: number
    size?: number
    current?: number
    orders?: OrderItem[]
    optimizeCountSql?: PagePictureVO
    searchCount?: PagePictureVO
    optimizeJoinOfCountSql?: boolean
    maxLimit?: number
    countId?: string
    pages?: number
  }

  type PageSpace = {
    records?: Space[]
    total?: number
    size?: number
    current?: number
    orders?: OrderItem[]
    optimizeCountSql?: PageSpace
    searchCount?: PageSpace
    optimizeJoinOfCountSql?: boolean
    maxLimit?: number
    countId?: string
    pages?: number
  }

  type PageSpaceVO = {
    records?: SpaceVO[]
    total?: number
    size?: number
    current?: number
    orders?: OrderItem[]
    optimizeCountSql?: PageSpaceVO
    searchCount?: PageSpaceVO
    optimizeJoinOfCountSql?: boolean
    maxLimit?: number
    countId?: string
    pages?: number
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

  type Parameters = {
    angle?: number
    outputRatio?: string
    topOffset?: number
    bottomOffset?: number
    leftOffset?: number
    rightOffset?: number
    bestQuality?: boolean
    limitImageSize?: boolean
    addWatermark?: boolean
    xscale?: number
    yscale?: number
    xScale?: number
    yScale?: number
  }

  type Picture = {
    /** 图片 id */
    id?: number
    /** 图片 url */
    url?: string
    /** 缩略图url */
    thumbnailUrl?: string
    /** 图片名称 */
    name?: string
    /** 图片简介 */
    introduction?: string
    /** 图片分类 */
    category?: string
    /** 图片标签(JSON 数组) */
    tags?: string
    /** 图片体积(字节) */
    picSize?: number
    /** 图片宽度(像素) */
    picWidth?: number
    /** 图片高度(像素) */
    picHeight?: number
    /** 图片宽高比例 */
    picScale?: number
    /** 图片格式 */
    picFormat?: string
    /** 创建用户 id */
    userId?: number
    /** 创建时间 */
    createTime?: string
    /** 编辑时间 */
    editTime?: string
    /** 更新时间 */
    updateTime?: string
    /** 是否删除(0-未删除, 1-已删除) */
    isDelete?: number
    /** 审核状态(0-待审核,1-通过,2-拒绝) */
    reviewStatus?: number
    /** 审核信息 */
    reviewMessage?: string
    /** 审核人 id */
    reviewerId?: number
    /** 审核时间 */
    reviewTime?: string
    /** 空间 id */
    spaceId?: number
    /** 图片主色调 */
    picColor?: string
  }

  type PictureEditByBatchRequest = {
    pictureIdList?: number[]
    spaceId?: number
    category?: string
    tags?: string[]
    /** 图片命名规则，支持变量：{index}、{category}、{tags}、{time}、{random}，例如：{index}_{category}_{tags}_{time}_{random} */
    nameRule?: string
  }

  type PictureEditRequest = {
    /** 图片id */
    id: number
    /** 图片名称 */
    name?: string
    /** 图片简介/描述 */
    introduction?: string
    /** 图片分类 */
    category?: string
    /** 图片标签列表 */
    tags?: string[]
    /** 图片主色调 */
    picColor?: string
  }

  type PictureQueryRequest = {
    current?: number
    pageSize?: number
    sortField?: string
    sortOrder?: string
    /** 图片 id */
    id: number
    /** 图片名称 */
    name?: string
    /** 图片描述 */
    introduction?: string
    /** 图片分类 */
    category?: string
    /** 图片标签列表 */
    tags?: string[]
    /** 图片文件体积 */
    picSize?: number
    /** 图片宽度 */
    picWidth?: number
    /** 图片高度 */
    picHeight?: number
    /** 图片比例 */
    picScale?: number
    /** 图片格式 */
    picFormat?: string
    /** 搜索词（同时搜名称、简介等） */
    searchText?: string
    userId?: number
    reviewStatus?: number
    reviewMessage?: string
    reviewerId?: number
    reviewTime?: string
    /** 空间id */
    spaceId?: number
    /** 空间id是否为空 */
    nullSpaceId?: boolean
    startEditTime?: string
    endEditTime?: string
    /** 图片主色调 */
    picColor?: string
  }

  type PictureTagCategory = {
    /** 图片标签列表 */
    tagList?: string[]
    /** 图片分类 */
    categoryList?: string
  }

  type PictureUpdataRequest = {
    /** 图片唯一标识符 */
    id: number
    /** 图片名称 */
    name?: string
    /** 图片描述 */
    introduction?: string
    /** 图片分类 */
    category?: string
    /** 图片标签列表 */
    tags?: string[]
    /** 图片主色调 */
    picColor?: string
  }

  type PictureUploadByBatchRequest = {
    /** 搜索文本 */
    searchText?: string
    /** 图片数量 */
    count?: number
    /** 图片名称前缀 */
    namePrefix?: string
  }

  type PictureUploadRequest = {
    /** 图片 id */
    id?: number
    /** 图片url */
    fileUrl?: string
    /** 图片名称 */
    picName?: string
    /** 空间 id */
    spaceId?: number
  }

  type PictureVO = {
    id?: number
    url?: string
    /** 缩略图url */
    thumbnailUrl?: string
    name?: string
    introduction?: string
    tags?: string[]
    category?: string
    picSize?: number
    picWidth?: number
    picHeight?: number
    picScale?: number
    picFormat?: string
    userId?: number
    createTime?: string
    editTime?: string
    updateTime?: string
    user?: UserVO
    /** 空间 id */
    spaceId?: number
    picColor?: string
  }

  type SearchPictureByColorRequest = {
    picColor?: string
    spaceId?: number
  }

  type SearchPictureByPictureRequest = {
    pictureId?: number
  }

  type SoImageSearchResult = {
    imgUrl?: string
    title?: string
    imgkey?: string
    http?: string
    https?: string
  }

  type Space = {
    /** 空间 id */
    id?: number
    /** 空间名称 */
    spaceName?: string
    /** 空间级别(0-普通版,1-专业版,2-旗舰版) */
    spaceLevel?: number
    /** 空间图片的最大总大小(字节) */
    maxSize?: number
    /** 空间图片的最大数量 */
    maxCount?: number
    /** 当前空间下图片的总大小(字节) */
    totalSize?: number
    /** 当前空间下的图片数量 */
    totalCount?: number
    /** 创建用户 id */
    userId?: number
    /** 创建时间 */
    createTime?: string
    /** 编辑时间 */
    editTime?: string
    /** 更新时间 */
    updateTime?: string
    /** 是否删除(0-未删除,1-已删除) */
    isDelete?: number
  }

  type SpaceAddRequest = {
    spaceName?: string
    spaceLevel?: number
  }

  type SpaceEditRequest = {
    id?: number
    spaceName?: string
  }

  type SpaceLevel = {
    value?: number
    text?: string
    maxCount?: number
    maxSize?: number
  }

  type SpaceQueryRequest = {
    current?: number
    pageSize?: number
    sortField?: string
    sortOrder?: string
    id?: number
    userId?: number
    spaceName?: string
    spaceLevel?: number
  }

  type SpaceUpdateRequest = {
    id?: number
    spaceName?: string
    spaceLevel?: number
    maxSize?: number
    maxCount?: number
  }

  type SpaceVO = {
    id?: number
    spaceName?: string
    spaceLevel?: number
    maxSize?: number
    maxCount?: number
    totalSize?: number
    totalCount?: number
    userId?: number
    createTime?: string
    editTime?: string
    updateTime?: string
    user?: UserVO
  }

  type testDownloadFileParams = {
    filepath: string
  }

  type uploadPictureByUrlParams = {
    /** 图片上传请求体中的元信息，如名称/标签/分类等 */
    pictureUploadRequest?: any
  }

  type uploadPictureParams = {
    /** 图片文件 */
    file?: any
    /** 图片上传请求体中的元信息，如名称/标签/分类等 */
    pictureUploadRequest?: any
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
    phoneNumber?: string
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
    /** 用户等级 */
    vipLevel?: 'standard' | 'pro' | 'max'
    /** 会员过期时间 */
    vipExpireTime?: string
    /** 手机号 */
    phoneNumber?: string
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
    phoneNumber?: string
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

  type UserUpdateByThemSelfRequest = {
    /** 用户id */
    id: number
    /** 用户昵称 */
    userName?: string
    /** 用户简介 */
    userProfile?: string
    /** 邮箱 */
    email?: string
  }

  type UserUpdatePasswordRequest = {
    userOldPassword?: string
    userNewPassword?: string
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
    phoneNumber?: string
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
