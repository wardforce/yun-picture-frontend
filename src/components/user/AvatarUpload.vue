<template>
  <a-modal v-model:visible="visible" title="修改头像" :footer="null" @cancel="closeModal">
    <a-tabs v-model:activeKey="activeKey">
      <a-tab-pane key="file" tab="本地上传">
        <AvatarFileUpload @select="handleSelect" />
      </a-tab-pane>
      <a-tab-pane key="url" tab="URL 上传">
        <AvatarUrlUpload @select="handleSelect" />
      </a-tab-pane>
    </a-tabs>
  </a-modal>

  <ImageCropper
    ref="imageCropperRef"
    :imageUrl="imageUrl"
    :uploadApi="uploadApi"
    :onSuccess="handleSuccess"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AvatarFileUpload from './AvatarFileUpload.vue'
import AvatarUrlUpload from './AvatarUrlUpload.vue'
import ImageCropper from '@/components/ImageCropper.vue'
import { uploadAvatar } from '@/api/UserController'
import { useLoginUserStore } from '@/stores/useLoginUserStore'

const visible = ref(false)
const activeKey = ref('file')
const imageUrl = ref('')
const imageCropperRef = ref()
const loginUserStore = useLoginUserStore()

const openModal = () => {
  visible.value = true
}

const closeModal = () => {
  visible.value = false
}

const handleSelect = (url: string) => {
  imageUrl.value = url
  visible.value = false // Close the selection modal
  imageCropperRef.value.openModal() // Open the cropper modal
}

const uploadApi = (file: File) => {
  return uploadAvatar({}, file)
}

const handleSuccess = () => {
  loginUserStore.fetchLoginUser()
}

defineExpose({
  openModal
})
</script>
