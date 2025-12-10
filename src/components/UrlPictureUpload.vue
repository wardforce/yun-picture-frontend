<template>
  <div class="url-picture-upload">
    <a-input-group compact>
      <a-input v-model:value="fileUrl" style="width: calc(100% - 120px)" placeholder="请输入图片url" />
      <a-button type="primary" style="width: 120px;" :loading="loading" @click="handleUpload">提交</a-button>
    </a-input-group>
    <div class="img-wrapper"><img v-if="picture?.url" :src="picture?.url" alt="avatar" /></div>

  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import type { UploadChangeParam, UploadProps } from 'ant-design-vue'
import { uploadPicture, uploadPictureByUrl } from '@/api/pictureController'
const fileUrl = ref<string>('')

interface Props {
  picture?: API.PictureVO
  onUploadSuccess?: (picture: API.PictureVO) => void
}
const props = defineProps<Props>()
/**
 * 上传文件的操作
 */
const handleUpload = async () => {
  if (!fileUrl.value) {
    message.warning('请输入图片 URL')
    return
  }
  loading.value = true
  try {
    const parmas: API.PictureUploadRequest = { fileUrl: fileUrl.value }
    if (props.picture) {
      parmas.id = props.picture.id
    }
    const res = await uploadPictureByUrl({}, parmas)
    if (res.data.code === 0 && res.data.data) {
      message.success('上传成功')
      props.onUploadSuccess?.(res.data.data)
    } else {
      message.error('图片上传失败,' + res.data.message)
    }
  } catch (error) {
    message.error('图片上传失败,' + (error as Error).message)
  } finally {
    loading.value = false
  }
}
const loading = ref<boolean>(false)
</script>
<style scoped>
.url-picture-upload {
  margin-bottom: 16px;
}

.img-wrapper img {
  max-height: 480px;
  max-width: 100%;
}


.img-wrapper {
  text-align: center;
  margin-top: 16px;
}
</style>
