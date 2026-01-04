<template>
  <a-modal id="image-out-painting" v-model:visible="visible" :footer="false" @cancel="closeModal" title="AI扩图">

    <a-row :gutter="16">
      <a-col span="12">
        <h4>原始图片</h4>
        <img :src="picture?.url" :alt="picture?.name" style="max-width: 100%;" />
      </a-col>
      <a-col span="12">
        <h4>扩图结果</h4>
        <img v-if="resultImageUrl" :src="resultImageUrl" :alt="picture?.name" style="max-width: 100%;" />
      </a-col>
    </a-row>
    <div style="margin-top: 16px;">
      <a-flex justify="center" gap="16">
        <a-button type="primary" :loading="!!taskId" ghost @click="handleGenerate">生成图片</a-button>
        <a-button v-if="resultImageUrl" type="primary" :loading="loading" @click="handleUpload">应用结果</a-button>
      </a-flex>
    </div>
  </a-modal>

</template>

<script lang="ts" setup>
import { message } from 'ant-design-vue';
import { ref } from 'vue'
import { VueCropper } from 'vue-cropper'
import { createOutPaintingTask, getOutPaintingTask, uploadPictureByUrl } from '@/api/pictureController'
import { log } from 'console';

const visible = ref(false)

const openModal = () => {
  visible.value = true;
};
const resultImageUrl = ref<string>('')
const closeModal = () => {
  visible.value = false;
};

defineExpose({
  openModal,
  closeModal
})



interface Props {
  picture?: API.PictureVO
  spaceId?: number
  onSuccess?: (picture: API.PictureVO) => void
}

const props = defineProps<Props>()
// 任务ID
const taskId = ref<string>('')




/*
 * 开始生成图片任务
 */
const handleGenerate = async () => {
  if (!props.picture?.id) {
    message.error('请上传图片')
    return
  }

  try {
    const res = await createOutPaintingTask({
      pictureId: props.picture.id,
      parameters: {
        xScale: 2
      }
    })
    if (res.data.code === 0 && res.data.data) {
      message.success('创建任务成功，请耐心等待，不要退出界面。')
      console.log(res.data.data.output?.taskId)
      taskId.value = res.data.data.output?.taskId
      startPollTask()
    }
    //开启轮询
    else
      message.error('创建任务失败，' + res.data.message)
  } catch (error) {
    message.error('扩图失败' + error.message)
    console.error(error)
  } finally {

  }
}
let pollingTimer: NodeJS.Timeout = null
//开始轮询
const startPollTask = () => {
  if (!taskId.value) {
    return
  }
  pollingTimer = setInterval(async () => {
    try {
      const res = await getOutPaintingTask({ taskId: taskId.value })
      if (res.data.code === 0 && res.data.data) {
        const taskResult = res.data.data.output
        if (taskResult?.taskStatus === 'SUCCEEDED') {
          message.success('扩图成功')
          resultImageUrl.value = taskResult.outputImageUrl
          stopPollTask()
        } else if (taskResult?.taskStatus === 'FAILED') {
          message.error('扩图失败')
          stopPollTask()
        }
      }
    } catch (error) {
      console.error('扩图任务轮询失败', error)
      message.error('扩图任务轮询失败' + error.message)
      stopPollTask()
    }
  }, 3000);//3秒轮询一次
}
//清理轮询
const stopPollTask = () => {
  if (pollingTimer) {
    clearInterval(pollingTimer)
    pollingTimer = null
    taskId.value = null
  }
}
const loading = ref<boolean>(false)

/**
 * 根据url上传图片
 */
const handleUpload = async () => {
  loading.value = true
  // if (!resultImageUrl.value) {
  //   message.warning('请输入图片 URL')
  //   return
  // }
  try {
    const parmas: API.PictureUploadRequest = {
      fileUrl: resultImageUrl.value,
      spaceId: props.spaceId
    }
    if (props.picture) {
      parmas.id = props.picture.id
    }
    const res = await uploadPictureByUrl({}, parmas)
    if (res.data.code === 0 && res.data.data) {
      message.success('上传成功')
      props.onSuccess?.(res.data.data)
      closeModal()
    } else {
      message.error('图片上传失败,' + res.data.message)
    }
  } catch (error) {
    message.error('图片上传失败,' + (error as Error).message)
  } finally {
    loading.value = false
  }
}




</script>

<style scoped>
#image-out-painting {
  text-align: center;
}
</style>
