<template>
  <div class="user-info">
    <a-descriptions title="用户信息" bordered :column="1">
      <a-descriptions-item label="用户账号">
        {{ userInfo.userAccount || '-' }}
      </a-descriptions-item>
      <a-descriptions-item label="用户昵称">
        {{ userInfo.userName || '-' }}
      </a-descriptions-item>
      <a-descriptions-item label="个人简介">
        {{ userInfo.userProfile || '-' }}
      </a-descriptions-item>
      <a-descriptions-item label="邮箱">
        {{ userInfo.email || '-' }}
      </a-descriptions-item>
      <a-descriptions-item label="用户角色">
        <a-tag :color="getRoleColor(userInfo.userRole)">
          {{ getRoleLabel(userInfo.userRole) }}
        </a-tag>
      </a-descriptions-item>
      <a-descriptions-item label="会员等级">
        <a-tag :color="getVipColor(userInfo.vipLevel)">
          {{ getVipLabel(userInfo.vipLevel) }}
        </a-tag>
      </a-descriptions-item>
      <a-descriptions-item label="会员到期时间">
        {{ userInfo.vipExpireTime || '-' }}
      </a-descriptions-item>
      <a-descriptions-item label="分享码">
        {{ userInfo.shareCode || '-' }}
      </a-descriptions-item>
    </a-descriptions>

    <div class="action-bar">
      <a-button type="primary" @click="openEditModal">编辑信息</a-button>
    </div>

    <a-modal
      v-model:open="editVisible"
      title="编辑个人信息"
      @ok="handleSubmit"
      @cancel="closeEditModal"
      :confirm-loading="loading"
      :destroy-on-close="true"
    >
      <a-form :model="editForm" layout="vertical">
        <a-form-item label="用户昵称">
          <a-input
            v-model:value="editForm.userName"
            placeholder="请输入用户昵称"
            allow-clear
          />
        </a-form-item>
        <a-form-item label="个人简介">
          <a-textarea
            v-model:value="editForm.userProfile"
            placeholder="请输入个人简介"
            :rows="4"
            allow-clear
          />
        </a-form-item>
        <a-form-item label="邮箱">
          <a-input
            v-model:value="editForm.email"
            placeholder="请输入邮箱"
            allow-clear
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { getLoginUser, updateUserByThemself } from '@/api/UserController'
import { useLoginUserStore } from '@/stores/useLoginUserStore'

const loginUserStore = useLoginUserStore()
const userInfo = ref<API.LoginUserVO>({})
const editVisible = ref(false)
const loading = ref(false)
const editForm = reactive<API.UserUpdateByThemSelfRequest>({
  id: 0,
  userName: '',
  userProfile: '',
  email: '',
})

const fetchUserInfo = async () => {
  const res = await getLoginUser()
  if (res.data.code === 0 && res.data.data) {
    userInfo.value = res.data.data
  }
}

const openEditModal = () => {
  editForm.id = userInfo.value.id || 0
  editForm.userName = userInfo.value.userName || ''
  editForm.userProfile = userInfo.value.userProfile || ''
  editForm.email = userInfo.value.email || ''
  editVisible.value = true
}

const closeEditModal = () => {
  editVisible.value = false
}

const handleSubmit = async () => {
  if (!editForm.id) {
    message.error('用户信息异常')
    return
  }
  loading.value = true
  try {
    const res = await updateUserByThemself(editForm)
    if (res.data.code === 0) {
      message.success('更新成功')
      await fetchUserInfo()
      await loginUserStore.fetchLoginUser()
      closeEditModal()
    } else {
      message.error('更新失败：' + res.data.message)
    }
  } finally {
    loading.value = false
  }
}

const getRoleLabel = (role?: string) => {
  const map: Record<string, string> = {
    admin: '管理员',
    vip: '会员用户',
    user: '普通用户',
  }
  return map[role || ''] || '普通用户'
}

const getRoleColor = (role?: string) => {
  const map: Record<string, string> = {
    admin: 'red',
    vip: 'gold',
    user: 'blue',
  }
  return map[role || ''] || 'blue'
}

const getVipLabel = (level?: string) => {
  const map: Record<string, string> = {
    standard: '普通会员',
    pro: '专业会员',
    max: '超级会员',
  }
  return map[level || ''] || '未开通'
}

const getVipColor = (level?: string) => {
  const map: Record<string, string> = {
    standard: 'blue',
    pro: 'gold',
    max: 'purple',
  }
  return map[level || ''] || 'default'
}

onMounted(() => {
  fetchUserInfo()
})
</script>

<style scoped>
.user-info {
  padding: 16px 0;
}

.action-bar {
  margin-top: 24px;
  text-align: center;
}
</style>
