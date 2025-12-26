<template>
  <div id="spaceDetailPage">
    <a-flex justify="space-between">
      <h2>{{ space.spaceName }}(私有空间)</h2>
      <a-sapce size="middle">
        <a-button type="primary" :href="`/add_picture?spaceId=${id}`" target="_blank">+ 创建图片</a-button>
        <a-tooltip :title="`${formatSize(space.totalSize)} / ${formatSize(space.maxSize)}`">
          <a-progress type="circle" :percent="((space.totalSize / space.maxSize) * 100).toFixed(1)" :size="42" />
        </a-tooltip>
      </a-sapce>
    </a-flex>
    <div style="margin-bottom: 16px" />
    <PictureList :dataList="dataList" :loading="loading" :showOp="true" :onReload="fetchData" />
    <a-pagination v-model:current="searchParams.current" v-model:pageSize="searchParams.pageSize" :total="total"
      @change="onPageChange" style="text-align: right; display: flex; justify-content: flex-end;" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, h, computed, reactive } from 'vue'
import { message } from 'ant-design-vue'
import { deleteSpace, getSpaceVoById } from '@/api/spaceController'
import { listPictureVoByPage } from '@/api/pictureController'
import { formatSize } from '@/utils'


interface Props {
  id: number | string
}

const space = ref<API.SpaceVO>({})
const props = defineProps<Props>()





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
    spaceId: props.id
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


// 页面加载时请求一次
onMounted(async () => {
  // 获取数据
  getSpaceDetail()
  // 获取数据
  fetchData()
})


</script>

<style scoped>
#spaceDetailPage {

  margin-bottom: 16px;
}
</style>
