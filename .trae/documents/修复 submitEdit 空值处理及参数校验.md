## 问题概述
- 现有 `cleanParams4submitEdit` 逻辑反向：对「非空」值设置为 `null`，导致后端收到非法参数并抛出 `BusinessException`。
- 业务约定：
  - 文本类字段：空字符串 `''` 表示“置空”，应当原样传给后端。
  - 数字类字段：空字符串/空值表示“不更新该字段”，应当不传该键。
  - `id` 必须存在。

## 目标
- 保证提交时：保留需要置空的文本字段（值为 `''`），过滤 `undefined/null`，数字字段仅在为有效数字时传递。
- 消除后端“请求参数错误”。

## 具体改动
1. 新增并替换清洗函数：
```ts
const cleanParams4submitEdit = (params: Record<string, any>) => {
  const out: Record<string, any> = {}
  const textKeys = ['userName','userAvatar','userProfile','userRole','vipLevel','phoneCountryCode','email']
  const numberKeys = ['vipNumber','phoneNumber']
  // 必传 id
  out.id = params.id
  // 文本字段：保留 ''，过滤 undefined/null，其他值原样保留
  textKeys.forEach((k) => {
    const v = params[k]
    if (v === '' || (v !== undefined && v !== null)) out[k] = v
  })
  // 数字字段：''/undefined/null → 不传；其余转 number，合法才保留
  numberKeys.forEach((k) => {
    const v = params[k]
    if (v === '' || v === undefined || v === null) return
    const n = typeof v === 'string' ? Number(v) : v
    if (Number.isFinite(n)) out[k] = n
  })
  return out
}
```
2. 在 `submitEdit` 中改用该函数：
```ts
const payload = cleanParams4submitEdit({
  id: editForm.id,
  userName: editForm.userName,
  userAvatar: editForm.userAvatar,
  userProfile: editForm.userProfile,
  userRole: editForm.userRole,
  vipLevel: editForm.vipLevel,
  vipNumber: editForm.vipNumber,
  phoneCountryCode: editForm.phoneCountryCode,
  phoneNumber: editForm.phoneNumber,
  email: editForm.email,
}) as API.UserUpdateRequest
```

## 验证用例
- 文本置空：`userProfile = ''` → 后端应将简介置空。
- 数字置空：`vipNumber = ''` → 请求中不包含 `vipNumber`，后端不更新该字段。
- 正常更新：`phoneNumber = '123456'` → 请求中传 `phoneNumber: 123456`。
- 无修改：字段 `undefined` → 请求中不包含该键。

## 影响范围与回滚
- 仅影响用户管理页的编辑提交逻辑；如需回滚，只需还原清洗函数与 `submitEdit` 构建 `payload` 的方式。