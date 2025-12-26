<template>
  <div class="addSpacePage">
    <h2 style="margin-bottom: 16px;">{{ id ? '编辑空间' : '创建空间' }}</h2>

    <!-- 信息表单 -->
    <a-form name="spaceForm" layout="vertical" :model="spaceForm" @finish="handleSubmit">
      <a-form-item name="spaceName" label="空间名称">
        <a-input v-model:value="spaceForm.spaceName" placeholder="请输入空间名称" allow-clear />
      </a-form-item>
      <a-form-item name="spaceLevel" label="空间级别">
        <a-select v-model:value="spaceForm.spaceLevel" placeholder="请选择空间级别" allow-clear
          :options="SPACE_LEVEL_OPTIONS" />
      </a-form-item>

      <a-form-item>
        <a-button type="primary" html-type="submit" style="width: 100%" :loading="loading">提交</a-button>
      </a-form-item>
    </a-form>
    <!-- 空间组件介绍 -->
    <a-card title="空间组件介绍">
      <a-typography-paragraph>
        *目前仅支持开通普通版，尽情期待未来系统上线升级
        <a href="https://github.com/wardforce">ward 华</a>
      </a-typography-paragraph>
      <a-typography-paragraph v-for="spaceLevel in spaceLevelList">
        {{ spaceLevel.text }}： 大小 {{ formatSize(spaceLevel.maxSize) }}， 数量
        {{ spaceLevel.maxCount }}
      </a-typography-paragraph>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { addSpace, getSpaceVoById, listSpaceLevel, updateSpace } from '@/api/spaceController'
import { SPACE_LEVEL_OPTIONS } from '@/constants/space'
import { formatSize } from '@/utils'

import { message } from 'ant-design-vue'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
const space = ref<API.SpaceVO>()
const loading = ref<boolean>(false)
const spaceLevelList = ref<API.SpaceLevel[]>([])

// 获取空间级别
const fetchSpaceLevelList = async () => {
  const res = await listSpaceLevel()
  if (res.data.code === 0 && res.data.data) {
    spaceLevelList.value = res.data.data
  } else {
    message.error('加载空间级别失败，' + res.data.message)
  }
}

onMounted(() => {
  fetchSpaceLevelList()
})

/**
 * 上传成功后的回调
 * @param newSpace
 */
const onSuccess = (newSpace: API.SpaceVO) => {
  space.value = newSpace
}
const router = useRouter()
const spaceForm = ref<API.SpaceAddRequest | API.SpaceEditRequest>({})
/**
 * 提交表单
 * @param values 表单数据
 */
const handleSubmit = async (values: any) => {
  const spaceId = space.value?.id
  loading.value = true
  let res;
  if (spaceId) {
    res = await updateSpace({
      id: spaceId,
      ...values
    })
  } else {
    res = await addSpace({
      ...values
    })
  }


  //操作成功
  if (res.data.code === 0 && res.data.data) {
    message.success('操作成功')
    //跳转到详情页面
    router.push({
      path: `/space/${res.data.data}`,
    })
  } else {
    message.error('操作失败' + res.data.message)
  }
  loading.value = false
}



//获取路由参数
const route = useRoute()
const id = computed(() => route.query?.id)
const getSpace = async () => {
  if (id.value) {
    const res = await getSpaceVoById({ id: id.value as unknown as number })
    if (res.data.code === 0 && res.data.data) {
      const data = res.data.data
      space.value = data
      spaceForm.value.spaceName = data.spaceName
      spaceForm.value.spaceLevel = data.spaceLevel
    }
  }
}
onMounted(() => {
  getSpace()
})
</script>

<style scoped>
.addSpacePage {
  max-width: 720px;
  margin: 0 auto;
}
</style>
