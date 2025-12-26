<template>
  <div id="home-page">
    <!-- 搜索框 -->
    <div class="search-bar">
      <a-input-search v-model:value="searchParams.searchText" placeholder="从海量图片中搜索" enter-button="搜索" size="large"
        @search="doSearch" allow-clear />
    </div>
    <!-- 分类筛选 -->
    <a-tabs v-model:activeKey="selectedCategory" @change="doSearch">
      <a-tab-pane key="all" tab="全部"></a-tab-pane>
      <a-tab-pane v-for="category in categoryList" :key="category" :tab="category"></a-tab-pane>
    </a-tabs>
    <div class="tag-bar">
      <span style="margin-right: 8px">标签:</span>
      <a-space :size="[0, 8]" wrap>
        <a-checkable-tag v-for="(tag, index) in tagList" :key="tag" v-model:checked="selectedTagList[index]"
          @change="doSearch">
          {{ tag }}
        </a-checkable-tag>
      </a-space>
    </div>
    <!-- 图片列表 -->
    <PictureList :dataList="dataList" :loading="loading" />
    <a-pagination v-model:current="searchParams.current" v-model:pageSize="searchParams.pageSize" :total="total"
      @change="onPageChange" style="text-align: right; display: flex; justify-content: flex-end;" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { message } from 'ant-design-vue'
import { listPictureTagCategory, listPictureVoByPage } from '@/api/pictureController'
import { useRouter, useRoute } from 'vue-router'
import PictureList from '@/components/PictureList.vue'
//定义数据
const dataList = ref<API.PictureVO[]>([])
const total = ref(0)
const loading = ref(true)

// 搜索条件
const searchParams = reactive<API.PictureQueryRequest>({
  current: 1,
  pageSize: 12,
  sortField: 'createTime',
  sortOrder: 'descend',
})


const onPageChange = (page: number, pageSize: number) => {
  searchParams.current = page
  searchParams.pageSize = pageSize
  fetchData()
}
// 获取数据
const fetchData = async () => {
  loading.value = true
  const params = {
    ...searchParams,
    tags: [] as string[],
  }
  if (selectedCategory.value !== 'all') {
    params.category = selectedCategory.value
  }
  selectedTagList.value.forEach((useTag, index) => {
    if (useTag) {
      params.tags.push(tagList.value[index])
    }
  })
  const res = await listPictureVoByPage(params)
  if (res.data.data) {
    dataList.value = res.data.data.records ?? []
    total.value = res.data.data.total ?? 0
  } else {
    message.error('获取数据失败，' + res.data.message)
  }
  loading.value = false
}
const doSearch = () => {
  searchParams.current = 1;
  fetchData()
}
// 页面加载时请求一次
onMounted(async () => {
  // 先获取分类和标签列表
  await getCategoryAndTag()

  // 从 URL 初始化参数
  initParamsFromUrl()

  // 初始化完成，允许 watch 更新 URL
  isInitializing.value = false

  // 获取数据
  fetchData()
})
const categoryList = ref<string[]>([])
const tagList = ref<string[]>([])
const selectedCategory = ref<string>('all')
const selectedTagList = ref<boolean[]>([])

// 标志：是否正在从 URL 初始化参数（避免循环更新）
const isInitializing = ref(true)


/**
 * 获取分类和标签
 *
 */
const getCategoryAndTag = async () => {
  const res = await listPictureTagCategory()
  if (res.data.code === 0 && res.data.data) {
    categoryList.value = res.data.data.categoryList ?? []
    tagList.value = res.data.data.tagList ?? []
    // 初始化标签选中状态数组
    if (selectedTagList.value.length === 0) {
      selectedTagList.value = new Array(tagList.value.length).fill(false)
    }
  } else {
    message.error('获取分类和标签失败' + res.data.message)
  }
}
const router = useRouter()
const route = useRoute()

// 从 URL 查询参数初始化搜索参数
const initParamsFromUrl = () => {
  const query = route.query

  // 搜索文本
  if (query.searchText) {
    searchParams.searchText = String(query.searchText)
  }

  // 分页
  if (query.current) {
    searchParams.current = Number(query.current) || 1
  }
  if (query.pageSize) {
    searchParams.pageSize = Number(query.pageSize) || 12
  }

  // 排序
  if (query.sortField) {
    searchParams.sortField = String(query.sortField)
  }
  if (query.sortOrder) {
    searchParams.sortOrder = String(query.sortOrder) as 'asc' | 'desc'
  }

  // 分类
  if (query.category) {
    selectedCategory.value = String(query.category)
  }

  // 标签（从逗号分隔的字符串解析）
  if (query.tags) {
    const tags = String(query.tags).split(',').filter(Boolean)
    selectedTagList.value = tagList.value.map(tag => tags.includes(tag))
  } else {
    // 如果没有标签参数，初始化为全 false 数组
    selectedTagList.value = new Array(tagList.value.length).fill(false)
  }
}

// 同步搜索参数到 URL
const syncParamsToUrl = () => {
  const query: Record<string, string> = {}

  // 搜索文本
  if (searchParams.searchText) {
    query.searchText = searchParams.searchText
  }

  // 分页
  if (searchParams.current && searchParams.current > 1) {
    query.current = String(searchParams.current)
  }
  if (searchParams.pageSize && searchParams.pageSize !== 12) {
    query.pageSize = String(searchParams.pageSize)
  }

  // 排序
  if (searchParams.sortField && searchParams.sortField !== 'createTime') {
    query.sortField = searchParams.sortField
  }
  if (searchParams.sortOrder && searchParams.sortOrder !== 'descend') {
    query.sortOrder = searchParams.sortOrder
  }

  // 分类
  if (selectedCategory.value && selectedCategory.value !== 'all') {
    query.category = selectedCategory.value
  }

  // 标签（转换为逗号分隔的字符串）
  const selectedTags = tagList.value.filter((_, index) => selectedTagList.value[index])
  if (selectedTags.length > 0) {
    query.tags = selectedTags.join(',')
  }

  // 更新 URL（不触发页面刷新）
  router.replace({
    path: route.path,
    query
  })
}

// 监听搜索参数变化，同步到 URL
watch(
  () => [
    searchParams.searchText,
    searchParams.current,
    searchParams.pageSize,
    searchParams.sortField,
    searchParams.sortOrder,
    selectedCategory.value,
    selectedTagList.value
  ],
  () => {
    // 初始化时不更新 URL，避免循环
    if (!isInitializing.value) {
      syncParamsToUrl()
    }
  },
  { deep: true }
)


</script>

<style scoped>
#home-page .search-bar {
  max-width: 520px;
  margin: 0 auto 24px;
  padding-top: 16px;
}

#home-page .search-bar :deep(.ant-input-search) {
  width: 100%;
}

#home-page .tag-bar {
  margin-bottom: 16px;
}
</style>
