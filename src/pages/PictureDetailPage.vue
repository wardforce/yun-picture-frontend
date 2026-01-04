<template>
  <div id="pictureDetailPage">
    <a-row :gutter="[16, 16]">
      <!-- 图片预览 -->
      <a-col :sm="24" :md="16" :xl="18">
        <a-card title="图片预览">
          <a-image v-if="picture.url" :src="picture.url" style=" max-height: 600px; object-fit: contain;" />
          <a-empty v-else description="图片加载中或加载失败" />
        </a-card>
      </a-col>
      <!-- 图片信息 -->
      <a-col :sm="24" :md="8" :lg="6">
        <a-card title="图片信息">
          <a-descriptions :column="1">
            <a-descriptions-item label="作者">
              <a-space>
                <a-avatar :size="24" :src="picture.user?.userAvatar" />
                <div>{{ picture.user?.userName }}</div>
              </a-space>
            </a-descriptions-item>
            <a-descriptions-item label="名称">
              {{ picture.name ?? '未命名' }}
            </a-descriptions-item>
            <a-descriptions-item label="简介">
              {{ picture.introduction ?? '-' }}
            </a-descriptions-item>
            <a-descriptions-item label="分类">
              {{ picture.category ?? '默认' }}
            </a-descriptions-item>
            <a-descriptions-item label="标签">
              <a-tag v-for="tag in picture.tags" :key="tag">
                {{ tag }}
              </a-tag>
            </a-descriptions-item>
            <a-descriptions-item label="格式">
              {{ picture.picFormat ?? '-' }}
            </a-descriptions-item>
            <a-descriptions-item label="宽度">
              {{ picture.picWidth ?? '-' }}
            </a-descriptions-item>
            <a-descriptions-item label="高度">
              {{ picture.picHeight ?? '-' }}
            </a-descriptions-item>
            <a-descriptions-item label="宽高比">
              {{ picture.picScale ?? '-' }}
            </a-descriptions-item>
            <a-descriptions-item label="大小">
              {{ formatSize(picture.picSize) }}
            </a-descriptions-item>
            <a-descriptions-item label="颜色">
              <a-space>
                {{ picture.picColor ?? '-' }}
                <div :style="{ width: '16px', height: '16px', backgroundColor: toHexColor(picture.picColor) }"></div>
              </a-space>
            </a-descriptions-item>
          </a-descriptions>
          <!-- 图片操作 -->
          <a-space wrap>
            <a-button :icon="h(ShareAltOutlined)" type="primary" ghost @click="doShare">
              分享
            </a-button>
            <a-button :icon="h(DownloadOutlined)" type="primary" @click="doDownload">
              免费下载
            </a-button>
            <a-button v-if="canEdit" :icon="h(EditOutlined)" type="default" @click="doEdit">
              编辑
            </a-button>
            <a-button v-if="canEdit" :icon="h(DeleteOutlined)" danger @click="doDelete">
              删除
            </a-button>
          </a-space>
        </a-card>
      </a-col>
    </a-row>
    <ShareModel ref="shareModelRef" :link="shareLink" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, h, computed } from 'vue'
import { message } from 'ant-design-vue'
import { deletePicture, getPictureVoById } from '@/api/pictureController'
import { formatSize, toHexColor } from '@/utils'
import { EditOutlined, DeleteOutlined, DownloadOutlined, ShareAltOutlined } from '@ant-design/icons-vue'
import { useLoginUserStore } from '@/stores/useLoginUserStore'
import { useRouter } from 'vue-router'
import { downloadImage } from '@/utils'
interface Props {
  id: number | string
}

const picture = ref<API.PictureVO>({})
const props = defineProps<Props>()
const loginUserStore = useLoginUserStore()
/**
 * 是否可以编辑
 * @returns boolean
 */
const canEdit = computed(() => {
  const loginUser = loginUserStore.loginUser
  if (!loginUser.id) {
    message.error('请先登录')
    return false
  }
  const user = picture.value.user || {}
  return loginUser.id === user.id || loginUser.userRole === 'admin'
})
/**
 * 删除图片
 */
const doDelete = async () => {
  const id = picture.value.id
  if (!id) {
    message.error('图片id不能为空')
    return
  }
  try {
    const { data } = await deletePicture({ id })
    if (data && data.code === 0) {
      message.success('删除图片成功')
    } else {
      message.error('删除图片失败' + (data?.message ?? '未知错误'))
    }
  } catch (error) {
    message.error('删除图片失败' + (error as Error).message)
  }
}
const router = useRouter()
const doEdit = () => {
  if (!picture.value.id) {
    message.error('图片 ID 不存在')
    return
  }
  router.push({
    path: '/add_picture',
    query: {
      id: String(picture.value.id),
      spaceId: picture.value.spaceId
    }
  })
}
const getPictureDetail = async () => {
  try {
    const res = await getPictureVoById({ id: props.id })
    if (res.data.code === 0 && res.data.data) {
      picture.value = res.data.data
    } else {
      message.error('获取图片详情失败' + res.data.message)
    }
  } catch (error: unknown) {
    message.error('获取图片详情失败' + (error as Error).message)
  }

}

// 处理下载
const doDownload = () => {
  downloadImage(picture.value.url)
}


// 页面加载时请求一次
onMounted(async () => {
  // 获取数据
  getPictureDetail()
})
const shareModelRef = ref()
const shareLink = ref<string>()
const doShare = () => {

  if (!picture.value.id) {
    message.error('图片 ID 不存在')
    return
  }
  shareLink.value = `${window.location.protocol}//${window.location.host}/picture/${picture.value.id}`
  if (shareModelRef.value) {
    shareModelRef.value.openModal()
  }
}


</script>

<style scoped>
#pictureDetailPage {

  margin-bottom: 16px;
}
</style>
