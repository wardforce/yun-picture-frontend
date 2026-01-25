<template>
  <div class="user-page">
    <div class="avatar-section">
      <a-avatar
        v-if="loginUserStore.loginUser.userAvatar"
        :src="loginUserStore.loginUser.userAvatar"
        :size="80"
        @click="doAvatarClick"
      >
        <template #icon><AntDesignOutlined /></template>
      </a-avatar>
      <a-avatar v-else :size="80" @click="doAvatarClick">
        <template #icon>
          {{ loginUserStore.loginUser.userName?.[0] ?? '游' }}
        </template>
      </a-avatar>
    </div>
    <a-tabs>
      <a-tab-pane key="info" tab="用户信息">
        <UserInfo />
      </a-tab-pane>
      <a-tab-pane key="password" tab="修改密码">
        <UpdataPassword />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { useLoginUserStore } from '@/stores/useLoginUserStore'
import UserInfo from '@/components/user/UserInfo.vue'
import UpdataPassword from '@/components/user/UpdataPassword.vue'
import { AntDesignOutlined } from '@ant-design/icons-vue'

const loginUserStore = useLoginUserStore()
//切换头像方法，后端没有实现，先空着
const doAvatarClick = () => {}

onMounted(() => {
  loginUserStore.fetchLoginUser()
})
</script>

<style scoped>
.user-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
}

.avatar-section {
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
}
</style>
