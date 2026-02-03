<template>
  <div class="user-page">
    <div class="avatar-section">
      <div class="avatar-wrapper" @click="doAvatarClick">
        <a-avatar
          v-if="loginUserStore.loginUser.userAvatar"
          :src="loginUserStore.loginUser.userAvatar"
          :size="80"
        >
          <template #icon><AntDesignOutlined /></template>
        </a-avatar>
        <a-avatar v-else :size="80">
          <template #icon>
            {{ loginUserStore.loginUser.userName?.[0] ?? '游' }}
          </template>
        </a-avatar>
        <div class="avatar-mask">
          <edit-outlined />
        </div>
      </div>
    </div>
    <a-tabs>
      <a-tab-pane key="info" tab="用户信息">
        <UserInfo />
      </a-tab-pane>
      <a-tab-pane key="password" tab="修改密码">
        <UpdataPassword />
      </a-tab-pane>
    </a-tabs>
    <AvatarUpload ref="avatarUploadRef" />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useLoginUserStore } from '@/stores/useLoginUserStore'
import UserInfo from '@/components/user/UserInfo.vue'
import UpdataPassword from '@/components/user/UpdataPassword.vue'
import AvatarUpload from '@/components/user/AvatarUpload.vue'
import { AntDesignOutlined, EditOutlined } from '@ant-design/icons-vue'

const loginUserStore = useLoginUserStore()
const avatarUploadRef = ref()

const doAvatarClick = () => {
  if (avatarUploadRef.value) {
    avatarUploadRef.value.openModal()
  }
}

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

.avatar-wrapper {
  position: relative;
  cursor: pointer;
  border-radius: 50%;
  overflow: hidden;
}

.avatar-mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 24px;
  opacity: 0;
  transition: opacity 0.3s;
}

.avatar-wrapper:hover .avatar-mask {
  opacity: 1;
}
</style>
