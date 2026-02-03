<template>
  <a-modal id="image-cropper" v-model:visible="visible" @ok="handleConfirm" title="编辑图片">

    <!-- 图片裁切 -->
    <div class="cut">
      <vue-cropper ref="cropperRef" :img="imageUrl" outputType="png" :info="true" full="true" canMoveBox="true"
        :fixedBox="false" original="true" autoCrop="true" centerBox="true" high="true">
      </vue-cropper>
    </div>
    <div style="margin-bottom: 16px" />
    <!-- 图片操作 -->
    <div class="image-cropper-actions">
      <a-space>
        <a-button @click="rotateLeft">向左旋转</a-button>
        <a-button @click="rotateRight">向右旋转</a-button>
        <a-button @click="changeScale(1)">放大</a-button>
        <a-button @click="changeScale(-1)">缩小</a-button>
        <!-- <a-button type="primary" :loading="loading" @click="handleFinish">确认</a-button> -->
      </a-space>
    </div>
  </a-modal>

</template>

<script lang="ts" setup>
import { message } from 'ant-design-vue';
import { ref } from 'vue'
import { VueCropper } from 'vue-cropper'
import { uploadPicture } from '@/api/pictureController'

const visible = ref(false)

const openModal = () => {
  visible.value = true;
};

const closeModal = () => {
  visible.value = false;
};

defineExpose({
  openModal,
  closeModal
})

const cropperRef = ref()

interface Props {
  imageUrl?: string
  picture?: API.PictureVO
  spaceId?: number
  onSuccess?: (data: any) => void
  uploadApi?: (file: File) => Promise<any>
}

const props = defineProps<Props>()

const changeScale = (num: number) => {
  num = num || 1;
  cropperRef.value?.changeScale(num);
}

const rotateLeft = () => {
  cropperRef.value?.rotateLeft();
}

const rotateRight = () => {
  cropperRef.value?.rotateRight();
}


const loading = ref<boolean>(false)

// 确认裁剪
const handleConfirm = () => {
  cropperRef.value.getCropBlob((blob: Blob) => {
    const fileName = (props.picture?.name || 'image') + '.png'
    const file = new File([blob], fileName, { type: blob.type })
    // 上传图片
    handleUpload({ file })
  })
}


/**
 * 上传
 * @param file
 */
const handleUpload = async ({ file }: any) => {
  loading.value = true
  try {
    let res
    if (props.uploadApi) {
      res = await props.uploadApi(file)
    } else {
      const params: API.PictureUploadRequest = props.picture ? { id: props.picture.id } : {}
      params.spaceId = props.spaceId
      res = await uploadPicture(params, {}, file)
    }

    if (res.data.code === 0 && res.data.data) {
      message.success('图片上传成功')
      // 将上传成功的图片信息传递给父组件
      props.onSuccess?.(res.data.data)
      closeModal();
    } else {
      message.error('图片上传失败，' + res.data.message)
    }
  } catch (error) {
    message.error('图片上传失败')
  } finally {
    loading.value = false
  }
}




</script>

<style scoped>
#image-cropper {
  width: 100%;
  margin-bottom: 24px;
}

.cut {
  width: 100%;
  height: 500px;
  margin-bottom: 16px;
}

.image-cropper-actions {
  display: flex;
  justify-content: center;
}
</style>
