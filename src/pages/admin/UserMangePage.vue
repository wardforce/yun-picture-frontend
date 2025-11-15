<template>
  <div class="userMangerPage">
    <!-- 条件查询 -->
    <a-form layout="inline" :model="searchParams" @finish="doSearch" @submit.prevent="doSearch">
      <a-form-item label="id">
        <a-input v-model:value="searchParams.id" placeholder="输入id" allow-clear />
      </a-form-item>
      <a-form-item label="会员编号">
        <a-input v-model:value="searchParams.vipNumber" placeholder="输入会员编号" allow-clear />
      </a-form-item>
      <a-form-item label="会员等级">
        <a-radio-group v-model:value="searchParams.vipLevel">
          <a-radio value="standard" name="type" @click="toggleVipLevel('standard')">普通会员</a-radio>
          <a-radio value="pro" name="type" @click="toggleVipLevel('pro')">专业会员</a-radio>
          <a-radio value="max" name="type" @click="toggleVipLevel('max')">超级会员</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="账号">
        <a-input v-model:value="searchParams.userAccount" placeholder="输入账号" allow-clear />
      </a-form-item>
      <a-form-item label="用户名">
        <a-input v-model:value="searchParams.userName" placeholder="输入用户名" allow-clear />
      </a-form-item>
      <a-form-item label="手机地区号">
        <a-input v-model:value="searchParams.phoneCountryCode" placeholder="输入手机地区号" allow-clear />
      </a-form-item>
      <a-form-item label="手机号">
        <a-input v-model:value="searchParams.phoneNumber" placeholder="输入手机号" allow-clear />
      </a-form-item>
      <a-form-item label="邮箱">
        <a-input v-model:value="searchParams.email" placeholder="输入邮箱" allow-clear />
      </a-form-item>
      <a-form-item label="分享码">
        <a-input v-model:value="searchParams.shareCode" placeholder="输入分享码" allow-clear />
      </a-form-item>
      <a-form-item label="兑换码">
        <a-input v-model:value="searchParams.vipCode" placeholder="输入兑换码" allow-clear />
      </a-form-item>
      <a-form-item label="邀请人id">
        <a-input v-model:value="searchParams.inviteUser" placeholder="输入邀请人id" allow-clear />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit" @click="doSearch">搜索</a-button>
      </a-form-item>
    </a-form>

    <!-- 用户列表表格：使用 AntD Table 原生分页与排序 -->
    <a-table :columns="columns" :data-source="dataList" :pagination="tablePagination" :row-key="'id'"
      @change="handleTableChange">
      <template #headerCell="{ column }">
        <template v-if="column.key === 'name'">
          <span>
            <smile-outlined />
            Name
          </span>
        </template>
      </template>

      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'userAvatar'">
          <a-image :src="record.userAvatar" :width="40" />
        </template>
        <template v-else-if="column.key === 'userRole'">
          <div v-if="record.userRole === 'admin'">
            <a-tag color="green">管理员</a-tag>
          </div>
          <div v-else-if="record.userRole === 'vip'">
            <a-tag color="orange">会员用户</a-tag>
          </div>
          <div v-else>
            <a-tag color="volcano">普通用户</a-tag>
          </div>
        </template>
        <template v-else-if="column.key === 'vipLevel'">
          <div v-if="record.vipLevel === 'standard'">
            <a-tag color="blue">普通会员</a-tag>
          </div>
          <div v-else-if="record.vipLevel === 'pro'">
            <a-tag color="pink">专业会员</a-tag>
          </div>
          <div v-else-if="record.vipLevel === 'max'">
            <a-tag color="orange">超级会员</a-tag>
          </div>
          <div v-else>
            <a-tag color="volcano">普通用户</a-tag>
          </div>
        </template>
        <template v-else-if="column.key === 'vipExpireTime'">
          <div v-if="record.vipExpireTime">
            {{ dayjs(record.vipExpireTime).format('YYYY-MM-DD HH:mm:ss') }}
          </div>
          <div v-else>
            未过期
          </div>
        </template>
        <template v-else-if="column.key === 'createTime'">
          {{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template v-else-if="column.key === 'updateTime'">
          {{ dayjs(record.updateTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template v-else-if="column.key === 'action'">
          <a-button type="primary" @click="openEdit(record)">编辑</a-button>
          <!-- 有时间一定要完成这个东西 -->
          <a-button danger @click="doDelete(record.id)">删除</a-button>
        </template>
      </template>
    </a-table>
    <a-modal v-model:open="editVisible" title="编辑用户" @ok="submitEdit" @cancel="closeEdit" :destroyOnClose="true">
      <a-form :model="editForm" layout="vertical">
        <a-form-item label="用户昵称">
          <a-input v-model:value="editForm.userName" placeholder="输入用户昵称" allow-clear />
        </a-form-item>
        <a-form-item label="头像URL">
          <a-input v-model:value="editForm.userAvatar" placeholder="输入头像URL" allow-clear />
        </a-form-item>
        <a-form-item label="用户简介">
          <a-input v-model:value="editForm.userProfile" placeholder="输入用户简介" allow-clear />
        </a-form-item>
        <a-form-item label="用户角色">
          <a-select v-model:value="editForm.userRole" allow-clear placeholder="选择用户角色">
            <a-select-option value="user">普通用户</a-select-option>
            <a-select-option value="vip">会员用户</a-select-option>
            <a-select-option value="admin">管理员</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="会员等级">
          <a-select v-model:value="editForm.vipLevel" allow-clear placeholder="选择会员等级">
            <a-select-option value="standard">普通会员</a-select-option>
            <a-select-option value="pro">专业会员</a-select-option>
            <a-select-option value="max">超级会员</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="会员编号">
          <a-input v-model:value="editForm.vipNumber" placeholder="输入会员编号" allow-clear />
        </a-form-item>
        <a-form-item label="手机国家代码">
          <a-input v-model:value="editForm.phoneCountryCode" placeholder="输入手机国家代码" allow-clear />
        </a-form-item>
        <a-form-item label="手机号">
          <a-input v-model:value="editForm.phoneNumber" placeholder="输入手机号" allow-clear />
        </a-form-item>
        <a-form-item label="邮箱">
          <a-input v-model:value="editForm.email" placeholder="输入邮箱" allow-clear />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script lang="ts" setup>
// 接口：用户分页查询（由 openapi 生成）
import { listUserPageVoByPage } from '@/api/userController';
import { SmileOutlined, DownOutlined } from '@ant-design/icons-vue';
import { message, type TableProps } from 'ant-design-vue';
import { computed, onMounted, reactive, ref } from 'vue';
import dayjs from 'dayjs';
import { deleteUser } from '@/api/userController';
import { updateUser } from '@/api/userController';
// 说明：移除 vue-request 依赖，改用 AntD Table 原生分页与 onChange 事件处理，避免未安装依赖导致的报错

const columns = [
  {
    title: 'id',
    dataIndex: 'id',
    key: 'id',
    sorter: true,
  },
  {
    title: '账号',
    dataIndex: 'userAccount',
    key: 'userAccount',
    sorter: true,
  },
  {
    title: '用户名',
    dataIndex: 'userName',
    key: 'userName',
    sorter: true,
  },
  {
    title: '头像',
    dataIndex: 'userAvatar',
    key: 'userAvatar',
  },
  {
    title: '简介',
    dataIndex: 'userProfile',
    key: 'userProfile',
  },
  {
    title: '用户角色',
    dataIndex: 'userRole',
    key: 'userRole',
  },
  {
    title: '国家/地区代码',
    dataIndex: 'phoneCountryCode',
    key: 'phoneCountryCode',
  },
  {
    title: '手机号',
    dataIndex: 'phoneNumber',
    key: 'phoneNumber',
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: '会员编号',
    dataIndex: 'vipNumber',
    key: 'vipNumber',
    sorter: true,
  },
  {
    title: '会员等级',
    dataIndex: 'vipLevel',
    key: 'vipLevel',
  },
  {
    title: '会员过期时间',
    dataIndex: 'vipExpireTime',
    key: 'vipExpireTime',
    sorter: true,
  },
  {
    title: '邀请人id',
    dataIndex: 'inviteUser',
    key: 'inviteUser',
    sorter: true,
  },
  {
    title: '分享码',
    dataIndex: 'shareCode',
    key: 'shareCode',
  },
  {
    title: '兑换码',
    dataIndex: 'vipCode',
    key: 'exchangeCode',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
    sorter: true,
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
    key: 'updateTime',
    sorter: true,
  },
  {
    title: '操作',
    key: 'action',
  },
]
// 列表数据与分页参数（受控状态）
const dataList = ref<API.UserVO[]>([])
const total = ref(0)
const searchParams = reactive<API.UserQueryRequest>({
  current: 1,
  pageSize: 10,
  sortField: undefined,
  sortOrder: undefined,
  id: undefined,
  userName: undefined,
  userAccount: undefined,
  userProfile: undefined,
  userRole: undefined,
  vipNumber: undefined,
  vipLevel: undefined,
  vipExpireTime: undefined,
  inviteUser: undefined,
  shareCode: undefined,
  phoneNumber: undefined,
  email: undefined,
  phoneCountryCode: undefined,
  editTime: undefined,
  createTime: undefined,
  updateTime: undefined,
})

// 表格分页对象（绑定到 Table 的 pagination 属性）
const tablePagination = computed(() => ({
  current: searchParams.current,
  pageSize: searchParams.pageSize,
  total: total.value,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (t: number) => `共 ${t} 条`,
}))

// 拉取数据：根据 searchParams 请求后端，填充 dataList 与 total


// 规范化数字字段：字符串数字转 number，空字符串/undefined/null 置为 undefined
const normalizeNumber = (val: any): number | undefined => {
  if (val === '' || val === undefined || val === null) return undefined
  const n = typeof val === 'string' ? Number(val) : val
  return Number.isFinite(n) ? n : undefined
}

// 清理空值字段，避免向后端传递空字符串
const cleanParams = (params: Record<string, any>) => {
  const out: Record<string, any> = {}
  Object.entries(params).forEach(([k, v]) => {
    if (v !== '' && v !== undefined && v !== null) out[k] = v
  })
  return out
}
const cleanParams4submitEdit = (params: Record<string, any>) => {
  const out: Record<string, any> = {}
  const textKeys = ['userName', 'userAvatar', 'userProfile', 'userRole', 'vipLevel', 'phoneCountryCode', 'email']
  const numberKeys = ['vipNumber', 'phoneNumber']

  out.id = params.id

  // textKeys: 允许空字符串，只过滤 undefined 和 null
  textKeys.forEach((k) => {
    const v = params[k]
    if (v !== undefined && v !== null) {
      out[k] = v
    }
  })

  // numberKeys: 空值传 null，有效数字传数字
  numberKeys.forEach((k) => {
    const v = params[k]
    if (v === '' || v === undefined || v === null) {
      out[k] = null
      return
    }
    const n = typeof v === 'string' ? Number(v) : v
    if (Number.isFinite(n)) out[k] = n
    else out[k] = null  // 无效数字也传 null
  })

  return out
}
const fetchData = async () => {
  const payload = cleanParams({
    ...searchParams,
    vipNumber: normalizeNumber(searchParams.vipNumber),
    phoneNumber: normalizeNumber(searchParams.phoneNumber),
    sortField: searchParams.sortField,
  })

  const { data } = await listUserPageVoByPage(payload)
  if (data && data.code === 0 && data.data) {
    dataList.value = data.data.records ?? []
    total.value = data.data.total ?? 0
  } else {
    message.error('获取用户列表失败' + (data?.message ?? '未知错误'))
  }
}

// 切换 vipLevel：再次点击已选项时清空选择
const toggleVipLevel = (level: string) => {
  searchParams.vipLevel = searchParams.vipLevel === level ? undefined : level
}


const handleTableChange: TableProps['onChange'] = (pagination, filters, sorter) => {
  // 更新分页
  searchParams.current = pagination.current ?? 1
  searchParams.pageSize = pagination.pageSize ?? 10

  // 抽取排序字段与方向（兼容多种来源）
  const extractField = (s: any): string | undefined =>
    (s?.field as string) ?? (s?.columnKey as string) ?? (s?.column?.dataIndex as string) ?? undefined

  const normalizeOrder = (order?: 'descend' | 'ascend'): 'desc' | 'asc' | undefined =>
    order ? (order === 'descend' ? 'desc' : 'asc') : undefined

  if (Array.isArray(sorter)) {
    const first = sorter[0]
    searchParams.sortField = extractField(first)
    searchParams.sortOrder = normalizeOrder(first?.order)
  } else {
    searchParams.sortField = extractField(sorter)
    searchParams.sortOrder = normalizeOrder(sorter?.order)
  }

  // 重新拉取数据
  fetchData()
}
const doSearch = () => {
  // 更新分页
  searchParams.current = 1
  searchParams.pageSize = searchParams.pageSize ?? 10
  fetchData()
}
// ... existing code ...
onMounted(() => {
  fetchData()
})
const doDelete = async (id: number) => {
  const { data } = await deleteUser({ id })
  if (data && data.code === 0) {
    message.success('删除用户成功')
    fetchData()
  } else {
    message.error('删除用户失败' + (data?.message ?? '未知错误'))
  }
}

const editVisible = ref(false)
const editForm = reactive<Partial<API.UserUpdateRequest & { id: number }>>({})

const openEdit = (record: API.UserVO) => {
  editForm.id = record.id as number
  editForm.userName = record.userName
  editForm.userAvatar = record.userAvatar
  editForm.userProfile = record.userProfile
  editForm.userRole = record.userRole
  editForm.vipLevel = record.vipLevel
  editForm.vipNumber = record.vipNumber as number
  editForm.phoneCountryCode = record.phoneCountryCode
  editForm.phoneNumber = record.phoneNumber as number
  editForm.email = record.email
  editVisible.value = true
}

const closeEdit = () => {
  editVisible.value = false
}

const submitEdit = async () => {
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
  const { data } = await updateUser(payload)
  if (data && data.code === 0) {
    message.success('更新用户成功')
    editVisible.value = false
    fetchData()
  } else {
    message.error('更新用户失败' + (data?.message ?? '未知错误'))
  }
}

</script>
