<template>
  <div class="avatar-file-upload">
    <a-upload
      name="file"
      :show-upload-list="false"
      :before-upload="beforeUpload"
      :custom-request="customRequest"
    >
      <div class="upload-area">
        <plus-outlined />
        <div class="ant-upload-text">点击或拖拽上传</div>
      </div>
    </a-upload>
  </div>
</template>

<script setup lang="ts">
import { PlusOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import type { UploadProps } from 'ant-design-vue'

const emit = defineEmits(['select'])

const beforeUpload = (file: UploadProps['fileList'][number]) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
  if (!isJpgOrPng) {
    message.error('只能上传 JPG/PNG 文件!')
  }
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    message.error('图片大小不能超过 2MB!')
  }
  return isJpgOrPng && isLt2M
}

const customRequest = ({ file }: any) => {
  // Convert file to base64 or object URL to preview in cropper
  const reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = () => {
    emit('select', reader.result)
  }
}
</script>

<style scoped>
.upload-area {
  width: 100%;
  height: 150px;
  border: 1px dashed #d9d9d9;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background-color: #fafafa;
  transition: border-color 0.3s;
}

.upload-area:hover {
  border-color: #1890ff;
}

.ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>
