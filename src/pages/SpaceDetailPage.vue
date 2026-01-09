<template>
  <div id="spaceDetailPage">
    <a-flex justify="space-between">
      <h2>{{ space.spaceName }}(私有空间)</h2>
      <a-sapce size="middle">
        <a-space>
          <a-button type="primary" :href="`/add_picture?spaceId=${id}`" target="_blank">+ 创建图片</a-button>
          <a-button type="primary" ghost :icon="h(RobotOutlined)" @click="goToAiGenerate">AI绘图</a-button>
          <a-button :icon="h(EditOutlined)" @click="doBatchEdit">批量编辑</a-button>
          <a-tooltip :title="`${formatSize(space.totalSize)} / ${formatSize(space.maxSize)}`">
            <a-progress type="circle" :percent="((space.totalSize / space.maxSize) * 100).toFixed(1)" :size="42" />
          </a-tooltip>
        </a-space>
      </a-sapce>
    </a-flex>
    <div style="margin-bottom: 16px" />
    <!-- 搜索表单 -->
    <PictureSearchFrom :onSearch="onSearch" v-model:searchParams="searchParams" />
    <div style="margin-bottom: 16px" />
    <a-form-item label="按照颜色搜索">
      <color-picker format="hex" @pureColorChange="onColorChange" v-model:pureColor="pureColor"
        v-model:gradientColor="gradientColor" />
    </a-form-item>
    <PictureList :dataList="dataList" :loading="loading" :showOp="true" :onReload="fetchData"
      style="margin-top: 16px" />
    <a-pagination v-model:current="searchParams.current" v-model:pageSize="searchParams.pageSize" :total="total"
      @change="onPageChange" style="text-align: right; display: flex; justify-content: flex-end" />
  </div>
  <BatchEditPictureModel ref="batchEditPictureModelRef" :spaceId="props.id" :pictureList="dataList"
    :onSuccess="onBatchEditPictureSuccess" />
</template>

<script setup lang="ts">
import { ref, onMounted, h } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { getSpaceVoById } from '@/api/spaceController'
import { listPictureVoByPage, searchPictureByColor } from '@/api/pictureController'
import { formatSize } from '@/utils'
import { ColorPicker } from 'vue3-colorpicker'
import 'vue3-colorpicker/style.css'
import { EditOutlined, RobotOutlined } from '@ant-design/icons-vue'
interface Props {
  id: number | string
}

const space = ref<API.SpaceVO>({})
const props = defineProps<Props>()
const router = useRouter()

const getSpaceDetail = async () => {
  try {
    const res = await getSpaceVoById({ id: props.id })
    if (res.data.code === 0 && res.data.data) {
      space.value = res.data.data
    } else {
      message.error('获取空间详情失败' + res.data.message)
    }
  } catch (error: unknown) {
    message.error('获取空间详情失败' + (error as Error).message)
  }
}
//定义数据
const dataList = ref<API.PictureVO[]>([])
const total = ref(0)
const loading = ref(true)

// 搜索条件
const searchParams = ref<API.PictureQueryRequest>({
  current: 1,
  pageSize: 12,
  sortField: 'createTime',
  sortOrder: 'descend',
})

const onPageChange = (page: number, pageSize: number) => {
  searchParams.value.current = page
  searchParams.value.pageSize = pageSize
  fetchData()
}
// 获取数据
const fetchData = async () => {
  loading.value = true
  const params = {
    ...searchParams.value,
    spaceId: props.id,
  }

  const res = await listPictureVoByPage(params)
  if (res.data.data) {
    dataList.value = res.data.data.records ?? []
    total.value = res.data.data.total ?? 0
  } else {
    message.error('获取数据失败，' + res.data.message)
  }
  loading.value = false
}
const onSearch = (params: API.PictureQueryRequest) => {
  searchParams.value = {
    ...searchParams.value,
    ...params,
    current: 1,
    pageSize: 12,
  }
  fetchData()
}

// 页面加载时请求一次
onMounted(async () => {
  // 获取数据
  getSpaceDetail()
  // 获取数据
  fetchData()
})
const onColorChange = async (color: string) => {
  loading.value = true
  const res = await searchPictureByColor({
    picColor: color,
    spaceId: props.id,
  })
  if (res.data.code === 0 && res.data.data) {
    const data = res.data.data
    dataList.value = data
    total.value = data.length
  } else {
    message.error('获取数据失败，' + res.data.message)
  }
  loading.value = false
}
//批量编辑图片
const onBatchEditPictureSuccess = () => {
  fetchData()
}
const batchEditPictureModelRef = ref()
//打开编辑弹窗
const doBatchEdit = () => {
  if (batchEditPictureModelRef.value) {
    batchEditPictureModelRef.value.openModal()
  }
}

// 跳转到AI生成页，传递spaceId
const goToAiGenerate = () => {
  router.push({
    path: '/ai/generate',
    query: { spaceId: props.id }
  })
}
</script>

<style scoped>
#spaceDetailPage {
  margin-bottom: 16px;
}
</style>
