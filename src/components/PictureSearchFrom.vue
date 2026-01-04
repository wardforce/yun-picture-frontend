<template>
  <div class="picture-search-from">
    <a-flex justify="space-between">
      <div style="margin-bottom: 16px"></div>
      <!-- 条件查询 -->
      <a-form name="searchForm" layout="inline" :model="searchParams" @finish="doSearch" @submit.prevent="doSearch">
        <a-form-item label="关键词" name="searchText">
          <a-input v-model:value="searchParams.searchText" placeholder="关键词输入框" allow-clear />
        </a-form-item>
        <a-form-item label="图片名称">
          <a-input v-model:value="searchParams.name" placeholder="输入图片名称" allow-clear />
        </a-form-item>
        <a-form-item name="introduction" label="简介">
          <a-textarea v-model:value="searchParams.introduction" placeholder="请输入图片简介" allow-clear
            :auto-size="{ minRows: 2, maxRows: 5 }" />
        </a-form-item>
        <a-form-item name="category" label="分类">
          <a-select v-model:value="searchParams.category" placeholder="请输入图片分类" allow-clear
            :options="categoryOptions" />
        </a-form-item>
        <a-form-item name="tags" label="标签">
          <a-select v-model:value="searchParams.tags" placeholder="请输入图片标签" mode="tags" allow-clear
            :options="tagOptions" style="min-width: 180px" />
        </a-form-item>
        <a-form-item label="日期" name="dateRange">
          <a-range-picker style="width: 400px" show-time format="YYYY/MM/DD HH:mm:ss" v-model:value="dateRange"
            :placeholder="['编辑开始时间', '编辑结束时间']" :presets="rangePresets" @change="onRangeChange" />
        </a-form-item>
        <a-form-item label="格式">
          <a-input v-model:value="searchParams.picFormat" placeholder="输入图片格式" allow-clear />
        </a-form-item>
        <a-form-item label="宽度">
          <a-input-number v-model:value="searchParams.picWidth" />
        </a-form-item>
        <a-form-item label="高度">
          <a-input-number v-model:value="searchParams.picHeight" />
        </a-form-item>
        <a-form-item>
          <a-space>
            <a-button type="primary" html-type="submit" @click="doSearch">搜索</a-button>
            <a-button html-type="reset" @click="doClear">重置</a-button>
          </a-space>
        </a-form-item>

      </a-form>
    </a-flex>
  </div>
</template>
<script lang="ts" setup>
// 接口：图片分页查询（由 openapi 生成）

import { onMounted, reactive, ref } from 'vue'
import dayjs from 'dayjs'
import { PIC_REVIEW_STATUS_OPTIONS } from '@/constants/picture'
import { message } from 'ant-design-vue'
import { listPictureTagCategory } from '@/api/pictureController'
interface Props {
  onSearch?: (params: API.PictureQueryRequest) => void
}
const props = defineProps<Props>()

// 列表数据与分页参数（受控状态）
const searchParams = reactive<API.PictureQueryRequest>({})

// 拉取数据：根据 searchParams 请求后端，填充 dataList 与 total

// 清理空值字段，避免向后端传递空字符串
const cleanParams = (params: Record<string, any>) => {
  const out: Record<string, any> = {}
  Object.entries(params).forEach(([k, v]) => {
    if (v !== '' && v !== undefined && v !== null) out[k] = v
  })
  return out
}
const dateRange = ref<[]>([])
const doSearch = () => {
  // 更新分页
  searchParams.current = 1
  searchParams.pageSize = searchParams.pageSize ?? 10
  props.onSearch?.(searchParams)
}
/**
 * 日期范围更改时触发
 * @param dates
 * @param dateStrings
 */
const onRangeChange = (dates: any[], dateStrings: string[]) => {
  if (dates && dates.length >= 2) {
    searchParams.startEditTime = dates[0].toDate()
    searchParams.endEditTime = dates[1].toDate()
  } else {
    searchParams.startEditTime = undefined
    searchParams.endEditTime = undefined
  }
}
//时间预设函数
const rangePresets = ref([
  { label: '过去 7 天', value: [dayjs().add(-7, 'd'), dayjs()] },
  { label: '过去 14 天', value: [dayjs().add(-14, 'd'), dayjs()] },
  { label: '过去 30 天', value: [dayjs().add(-30, 'd'), dayjs()] },
  { label: '过去 90 天', value: [dayjs().add(-90, 'd'), dayjs()] },
])
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
 * 清空搜索
 */
const doClear = () => {
  Object.keys(searchParams).forEach((key) => {
    searchParams[key] = undefined
  })

  //日期选项单独处理，必须定义为空数组
  dateRange.value = []
  //清空后重新搜索
  props.onSearch?.(searchParams)
}

</script>

<style scoped>
.delete-action {
  color: #ff4d4f;
  cursor: pointer;
}

.picture-search-from .ant-form-item {
  margin-top: 16px;
}
</style>
