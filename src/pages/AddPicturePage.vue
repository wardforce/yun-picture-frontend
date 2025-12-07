<template>
  <div class="addPicturePage">
    <h2 style="margin-bottom: 16px;">{{ id ? '编辑图片' : '创建图片' }}</h2>
    <!-- 图片上传组件 -->
    <PictureUpload :picture="picture" :on-upload-success="onSuccess" />
    <!-- 信息表单 -->
    <a-form name="pictureForm" v-if="picture" layout="vertical" :model="pictureForm" @finish="handleSubmit">
      <a-form-item name="name" label="名称">
        <a-input v-model:value="pictureForm.name" placeholder="请输入图片名称" allow-clear />
      </a-form-item>
      <a-form-item name="introduction" label="简介">
        <a-textarea v-model:value="pictureForm.introduction" placeholder="请输入图片简介" allow-clear
          :auto-size="{ minRows: 2, maxRows: 5 }" />
      </a-form-item>
      <a-form-item name="category" label="分类">
        <a-auto-complete v-model:value="pictureForm.category" placeholder="请输入图片分类" allow-clear
          :options="categoryOptions" />
      </a-form-item>
      <a-form-item name="tags" label="标签">
        <a-select v-model:value="pictureForm.tags" placeholder="请选择图片标签" mode="tags" allow-clear
          :options="tagOptions" />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit" style="width: 100%">提交</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { editPicture, getPictureVoById, listPictureTagCategory } from '@/api/pictureController'
import PictureUpload from '@/components/PictureUpload.vue'
import { message } from 'ant-design-vue'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
const picture = ref<API.PictureVO>()
/**
 * 上传成功后的回调
 * @param newPicture
 */
const onSuccess = (newPicture: API.PictureVO) => {
  picture.value = newPicture
  pictureForm.value.name = newPicture.name
}
const router = useRouter()
const pictureForm = ref<API.PictureEditRequest>({})
/**
 * 提交表单
 * @param values 表单数据
 */
const handleSubmit = async (values: any) => {
  const pictureId = picture.value.id
  if (!pictureId) {
    return
  }
  const res = await editPicture({
    id: pictureId,
    ...values
  })
  //操作成功
  if (res.data.code === 0 && res.data.data) {
    message.success('创建成功')
    //跳转到详情页面
    router.push({
      path: `/picture/${pictureId}`,
    })
  } else {
    message.error('创建失败' + res.data.message)
  }
}
const categoryOptions = ref<string[]>([])
const tagOptions = ref<string[]>([])
/**
 * 获取分类和标签
 *
 */
const getCategoryAndTag = async () => {
  const res = await listPictureTagCategory()
  if (res.data.code === 0 && res.data.data) {
    categoryOptions.value = (res.data.data.categoryList ?? []).map((data: string) => {
      return {
        label: data,
        value: data,
      }
    })
    tagOptions.value = (res.data.data.tagList ?? []).map((data: string) => {
      return {
        label: data,
        value: data,
      }
    })
  } else {
    message.error('获取分类和标签失败' + res.data.message)
  }
}
onMounted(() => {
  getCategoryAndTag()
})
//获取路由参数
const route = useRoute()
const id = computed(() => route.query?.id)
const getPicture = async () => {
  if (id.value) {
    const res = await getPictureVoById({ id: id.value as unknown as number })
    if (res.data.code === 0 && res.data.data) {
      const data = res.data.data
      picture.value = data
      pictureForm.value.name = data.name
      pictureForm.value.introduction = data.introduction
      pictureForm.value.category = data.category
      pictureForm.value.tags = data.tags
    }
  }
}
onMounted(() => {
  getPicture()
})
</script>

<style scoped>
.addPicturePage {
  max-width: 720px;
  margin: 0 auto;
}
</style>
