<template>
  <div id="picture-list">
    <!-- 图片列表 -->
    <a-list :grid="{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 5, xxl: 6, xxxl: 7 }" :data-source="props.dataList"
      :loading="props.loading">
      <template #renderItem="{ item: picture }">
        <a-list-item style="padding:0 ">
          <a-card hoverable @click="doClickPicture(picture)">
            <template #cover>
              <!-- 图片 -->
              <img :alt="picture.name" :src="picture.thumbnailUrl ?? picture.url"
                style="height: 180px;object-fit: cover;" />
            </template>
            <a-card-meta :title="picture.name || '未命名图片'">
              <template #description>
                <a-flex>
                  <a-tag color="green">
                    {{ picture.category ?? '默认' }}
                  </a-tag>
                  <a-tag v-for="tag in picture.tags" :key="tag">
                    {{ tag }}
                  </a-tag>
                </a-flex>
              </template>
            </a-card-meta>
            <template #actions v-if="showOp">
              <a-space @click="(e) => doSearch(picture, e)">
                <SearchOutlined />
                搜索
              </a-space>
              <a-space @click="(e) => doEdit(picture, e)">
                <edit-outlined />编辑
              </a-space>
              <a-space @click="(e) => doDelete(picture, e)">
                <delete-outlined />删除
              </a-space>
            </template>
          </a-card>
        </a-list-item>
      </template>
    </a-list>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { deletePicture } from '@/api/pictureController'

// props 定义（组件外传入的数据）

interface Props {
  dataList?: API.PictureVO[]
  loading?: boolean
  showOp?: boolean
  onReload?: () => void
}
const props = withDefaults(defineProps<Props>(), {
  dataList: () => [],
  loading: false,
  showOp: false
})
const router = useRouter()

const doClickPicture = (picture: API.PictureVO) => {
  router.push({ path: `/picture/${picture.id}` })
}
/**
 * 删除图片
 */
const doDelete = async (picture, e) => {
  //阻止冒泡
  e.stopPropagation()
  const id = picture.id
  if (!id) {
    message.error('图片id不能为空')
    return
  }
  try {
    const { data } = await deletePicture({ id })
    if (data && data.code === 0) {
      message.success('删除图片成功')
      props.onReload?.()
    } else {
      message.error('删除图片失败' + (data?.message ?? '未知错误'))
    }
  } catch (error) {
    message.error('删除图片失败' + (error as Error).message)
  }
}

const doEdit = (picture, e) => {
  // 阻止冒泡
  e.stopPropagation()
  if (!picture.id) {
    message.error('图片 ID 不存在')
    return
  }
  router.push({
    path: '/add_picture',
    query: {
      id: picture.id,
      spaceId: picture.spaceId
    }
  })
}

const doSearch = (picture, e) => {
  // 阻止冒泡
  e.stopPropagation()
  if (!picture.id) {
    message.error('图片 ID 不存在')
    return
  }
  window.open(`/search_picture?pictureId=${picture.id}`)
}
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
