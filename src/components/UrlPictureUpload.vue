<template>
  <div class="url-picture-upload">

  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import type { UploadChangeParam, UploadProps } from 'ant-design-vue'
import { uploadPicture } from '@/api/pictureController'
interface Props {
  picture?: API.PictureVO
  onUploadSuccess?: (picture: API.PictureVO) => void
}
const props = defineProps<Props>()
/**
 * 上传文件的操作
 */
const handleUpload = async ({ file }: any) => {
  loading.value = true
  const parmas = props.picture ? { id: props.picture.id.valueOf() } : {}
  const res = await uploadPicture(parmas, {}, file)
  try {
    if (res.data.code === 0 && res.data.data) {
      message.success('上传成功')
      //将上传成功的信息上传给父组件
      props.onUploadSuccess?.(res.data.data)
    } else {
      message.error('图片上传失败,' + res.data.message)
    }
  } catch (error) {
    message.error('图片上传失败,' + error.message)
  }
  loading.value = false
}

const loading = ref<boolean>(false)

/**
 * 上传前的校验
 * @param file
 */
const beforeUpload = (file: UploadProps['fileList'][number]) => {
  //文件类型校验
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
  if (!isJpgOrPng) {
    // message.error('You can only upload JPG file!')
    message.error('只能上传JPG/PNG文件!')
  }
  //文件大小校验
  const isLt10M = file.size / 1024 / 1024 < 10
  if (!isLt10M) {
    message.error('图片大小不能超过10MB!')
  }
  return isJpgOrPng && isLt10M
}
</script>
<style scoped>
.url-picture-upload :deep(.ant-upload) {
  width: 100% !important;
  height: 100% !important;
  min-height: 152px;
  min-width: 152px;
}

.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.url-picture-upload img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>
