<template>
  <div class="batch-edit-picture-model">
    <a-modal v-model:visible="visible" title="批量编辑图片" @cancel="closeModal" :footer="false">
      <a-typography-paragraph type="secondary">
        只对当前页面的图片生效
      </a-typography-paragraph>
      <!-- 批量表单 -->
      <a-form name="formData" layout="vertical" :model="formData" @finish="handleSubmit">
        <a-form-item name="category" label="分类">
          <a-select v-model:value="formData.category" placeholder="请输入图片分类" mode="category" allow-clear
            :options="categoryOptions" />
        </a-form-item>
        <a-form-item name="tags" label="标签">
          <a-select v-model:value="formData.tags" placeholder="请输入图片标签" mode="tags" allow-clear :options="tagOptions" />
        </a-form-item>
        <a-form-item name="nameRule" label="命名规则">
          <a-input v-model:value="formData.nameRule" placeholder="请输入命名规则，输入序号可以动态生成" allow-clear />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit" style="width: 100%">提交</a-button>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script lang="ts" setup>
import { editPictureByBatch, listPictureTagCategory } from '@/api/pictureController';
import { message } from 'ant-design-vue';
import { onMounted, ref } from 'vue';
const visible = ref<boolean>(false)
const formData = ref<API.PictureEditByBatchRequest>({
  category: '',
  tags: [],
  nameRule: '',
})
interface Props {
  pictureList: API.PictureVO[]
  spaceId: number
  onSuccess: () => void
}
const props = withDefaults(defineProps<Props>(), {

})
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
/**
 * 提交表单
 * @param values 表单数据
 */
const handleSubmit = async (values: any) => {
  if (!props.pictureList) {
    message.error('图片列表不能为空')
    return
  }
  const res = await editPictureByBatch({
    spaceId: props.spaceId,
    pictureIdList: props.pictureList.map((picture) => picture.id),
    ...values,
  })
  //操作成功
  if (res.data.code === 0 && res.data.data) {
    message.success('批量编辑成功')
    props.onSuccess()
    closeModal()
  } else {
    message.error('批量编辑失败' + res.data.message)
  }
}
</script>
