<template>
  <div class="add-picture-page-by-batch">
    <h2 style="margin-bottom: 16px;">批量创建图片</h2>
    <!-- 信息表单 -->
    <a-form name="formData" layout="vertical" :model="formData" @finish="handleSubmit">
      <a-form-item name="searchText" label="关键词">
        <a-input v-model:value="formData.searchText" placeholder="请输入关键词" allow-clear />
      </a-form-item>
      <a-form-item name="count" label="抓取数量">
        <a-input-number v-model:value="formData.count" placeholder="请输入数量" :min="1" :max="30" allow-clear />
      </a-form-item>
      <a-form-item name="namePrefix" label="名称前缀">
        <a-auto-complete v-model:value="formData.namePrefix" placeholder="请输入图片名称前缀，会自动补充序号" allow-clear />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit" style="width: 100%" :loding="loading">抓取图片</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { uploadPictureByBatch } from '@/api/pictureController'
import { message } from 'ant-design-vue'
import { ref, toRaw } from 'vue'

//提交任务状态
const loading = ref(false)

const formData = ref<API.PictureUploadByBatchRequest>({})
/**
 * 提交表单
 * @param values 表单数据
 */
const handleSubmit = async (values: any) => {
  loading.value = true

  const res = await uploadPictureByBatch({
    ...formData.value,
  })
  //操作成功
  if (res.data.code === 0 && res.data.data) {
    message.success(`拉取成功，共${res.data.data}条`)
    //跳转到详情页面

  } else {
    message.error('拉取失败' + res.data.message)
  }
  loading.value = false
}
</script>

<style scoped>
.add-picture-page-by-batch {
  max-width: 720px;
  margin: 0 auto;
}
</style>
