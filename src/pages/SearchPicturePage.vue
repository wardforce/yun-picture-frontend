<template>
  <div id="searchPicturePage">
    <h2 style="margin-bottom: 16px;">以图搜图</h2>
    <h3 style="margin-bottom: 16px;">原图</h3>
    <a-card hoverable style="width: 240px">
      <template #cover>
        <!-- 图片 -->
        <img :alt="picture.name" :src="picture.thumbnailUrl ?? picture.url" style="height: 180px;object-fit: cover;" />
      </template>
    </a-card>
    <h3 style="margin-bottom: 16px;">搜索结果</h3>
    <!-- 图片结果列表 -->
    <!-- 图片列表 -->
    <a-list :grid="{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 5, xxl: 6, xxxl: 7 }" :data-source="dataList"
      :loading="loading">
      <template #renderItem="{ item }">
        <a-list-item style="padding:0 ">
          <a :href="item.imgUrl" target="_blank">
            <a-card hoverable>
              <template #cover>
                <!-- 图片 -->
                <img :src="item.imgUrl" style="height: 180px;object-fit: cover;" />
              </template>
            </a-card>
          </a>
        </a-list-item>
      </template>
    </a-list>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, h, computed } from 'vue'
import { message } from 'ant-design-vue'
import { deletePicture, getPictureVoById, searchPictureByPictureIsSo } from '@/api/pictureController'
import { formatSize } from '@/utils'
import { EditOutlined, DeleteOutlined, DownloadOutlined } from '@ant-design/icons-vue'
import { useLoginUserStore } from '@/stores/useLoginUserStore'
import { useRoute, useRouter } from 'vue-router'
import { downloadImage } from '@/utils'
const route = useRoute()
const picture = ref<API.PictureVO>({})
const loading = ref(true)
const pictureId = computed(() => {
  return route.query?.pictureId
})


const router = useRouter()
const getPictureDetail = async () => {
  try {
    const res = await getPictureVoById({ id: pictureId.value })
    if (res.data.code === 0 && res.data.data) {
      picture.value = res.data.data
    } else {
      message.error('获取图片详情失败' + res.data.message)
    }
  } catch (error: unknown) {
    message.error('获取图片详情失败' + (error as Error).message)
  }

}
const dataList = ref<API.SoImageSearchResult[]>([])
const fetchResultDeta = async () => {
  loading.value = true
  try {
    const res = await searchPictureByPictureIsSo({ pictureId: pictureId.value })
    if (res.data.code === 0 && res.data.data) {
      dataList.value = res.data.data ?? []
    } else {
      message.error('获取图片详情失败' + res.data.message)
    }
  } catch (error: unknown) {
    message.error('获取图片详情失败' + (error as Error).message)
  }
  loading.value = false
}
// 页面加载时请求一次
onMounted(() => {
  // 获取数据
  fetchResultDeta()
})

// 页面加载时请求一次
onMounted(async () => {
  // 获取数据
  getPictureDetail()
})


</script>

<style scoped>
#searchPicturePage {

  margin-bottom: 16px;
}
</style>
