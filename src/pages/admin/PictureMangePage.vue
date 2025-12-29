<template>
  <div class="userMangerPage">
    <a-flex justify="space-between">
      <h2>图片管理</h2>
      <a-space>
        <a-button type="primary" href="/add_picture" target="_blank">+ 创建图片</a-button>
        <a-button type="primary" href="/add_picture/batch" target="_blank" ghost
          >+ 批量创建图片</a-button
        >
      </a-space>
    </a-flex>
    <div style="margin-bottom: 16px"></div>
    <!-- 条件查询 -->
    <a-form layout="inline" :model="searchParams" @finish="doSearch" @submit.prevent="doSearch">
      <a-form-item label="id">
        <a-input v-model:value="searchParams.id" placeholder="输入id" allow-clear />
      </a-form-item>
      <a-form-item label="用户id">
        <a-input v-model:value="searchParams.userId" placeholder="输入用户id" allow-clear />
      </a-form-item>
      <a-form-item label="图片名称">
        <a-input v-model:value="searchParams.name" placeholder="输入图片名称" allow-clear />
      </a-form-item>
      <a-form-item label="图片分类">
        <a-select
          v-model:value="searchParams.category"
          placeholder="请输入图片分类"
          mode="category"
          allow-clear
          :options="categoryOptions"
        />
      </a-form-item>
      <a-form-item label="图片标签">
        <a-select
          v-model:value="searchParams.tags"
          placeholder="请输入图片标签"
          mode="tags"
          allow-clear
          :options="tagOptions"
          style="min-width: 180px"
        />
      </a-form-item>
      <a-form-item label="简介搜索">
        <a-input
          v-model:value="searchParams.introduction"
          placeholder="输入名称或者简介"
          allow-clear
        />
      </a-form-item>
      <a-form-item name="reviewStatus" label="审核状态">
        <a-select
          v-model:value="searchParams.reviewStatus"
          placeholder="请选择审核状态"
          allow-clear
          :options="PIC_REVIEW_STATUS_OPTIONS"
        />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit" @click="doSearch">搜索</a-button>
      </a-form-item>
    </a-form>

    <!-- 用户列表表格：使用 AntD Table 原生分页与排序 -->
    <a-table
      :columns="columns"
      :data-source="dataList"
      :pagination="tablePagination"
      :row-key="'id'"
      @change="handleTableChange"
    >
      <template #headerCell="{ column }">
        <template v-if="column.key === 'name'">
          <span>
            <smile-outlined />
            Name
          </span>
        </template>
      </template>

      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'url'">
          <a-image :src="record.url" :width="40" />
        </template>
        <template v-else-if="column.key === 'tags'">
          <a-space wrap>
            <a-tag v-for="tag in JSON.parse(record.tags || '[]')" :key="tag">
              {{ tag }}
            </a-tag>
          </a-space>
        </template>
        <template v-if="column.dataIndex === 'picInfo'">
          <div>格式：{{ record.picFormat }}</div>
          <div>宽度：{{ record.picWidth }}</div>
          <div>高度：{{ record.picHeight }}</div>
          <div>宽高比：{{ record.picScale }}</div>
          <div>大小：{{ (record.picSize / 1024).toFixed(2) }}KB</div>
        </template>
        <template v-if="column.dataIndex === 'reviewMessage'">
          <div>审核状态：{{ PIC_REVIEW_STATUS_MAP[record.reviewStatus] }}</div>
          <div>审核信息：{{ record.reviewMessage }}</div>
          <div>审核人：{{ record.reviewerId }}</div>
          <div v-if="record.reviewTime">
            审核时间：{{ dayjs(record.reviewTime).format('YYYY-MM-DD HH:mm:ss') }}
          </div>
        </template>
        <template v-if="column.key === 'createTime'">
          {{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template v-if="column.key === 'editTime'">
          {{ dayjs(record.editTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template v-else-if="column.key === 'action'">
          <a-button type="link" :href="`/add_picture?id=${record.id}`" target="_blank"
            >编辑</a-button
          >
          <a-popconfirm
            title="确定删除吗？"
            ok-test="确定"
            cancel-text="取消"
            danger
            @confirm="doDelete(record.id)"
            @cancel="cancel"
          >
            <span class="delete-action">删除</span>
          </a-popconfirm>
          <a-button
            v-if="record.reviewStatus !== PIC_REVIEW_STATUS_ENUM.PASS"
            type="link"
            @click="handleReview(record, PIC_REVIEW_STATUS_ENUM.PASS)"
            >通过</a-button
          >
          <a-button
            v-if="record.reviewStatus !== PIC_REVIEW_STATUS_ENUM.REJECT"
            type="link"
            @click="openReviewModal(record)"
            danger
          >
            拒绝
          </a-button>
        </template>
      </template>
    </a-table>
    <a-modal
      v-model:open="open"
      title="拒绝原因"
      @ok="handleReviewOK(PIC_REVIEW_STATUS_ENUM.REJECT)"
      @cancel="cancel"
    >
      <a-form-item label="拒绝原因">
        <a-input v-model:value="reviewMessage" placeholder="输入拒绝原因" allow-clear />
      </a-form-item>
    </a-modal>
  </div>
</template>
<script lang="ts" setup>
// 接口：图片分页查询（由 openapi 生成）
import {
  doPictureReview,
  listPictureByPage,
  listPictureTagCategory,
  listPictureVoByPage,
} from '@/api/pictureController'
import { SmileOutlined } from '@ant-design/icons-vue'
import { message, type TableProps } from 'ant-design-vue'
import { computed, onMounted, reactive, ref } from 'vue'
import dayjs from 'dayjs'
import { deletePicture } from '@/api/pictureController'
import {
  PIC_REVIEW_STATUS_ENUM,
  PIC_REVIEW_STATUS_MAP,
  PIC_REVIEW_STATUS_OPTIONS,
} from '@/constants/picture'
// 说明：移除 vue-request 依赖，改用 AntD Table 原生分页与 onChange 事件处理，避免未安装依赖导致的报错
// 基础列定义
const open = ref<boolean>(false)
const reviewRecord = ref<API.Picture | null>(null)
const reviewMessage = ref<string>('')
const baseColumns = [
  {
    title: 'id',
    dataIndex: 'id',
    key: 'id',
    width: 80,
    sorter: true,
  },
  {
    title: '图片',
    dataIndex: 'url',
    key: 'url',
  },
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
    sorter: true,
  },
  // {
  //   title: '空间id  ',
  //   dataIndex: 'spaceId',
  //   key: 'spaceId',
  //   sorter: true,
  // },
  {
    title: '简介',
    dataIndex: 'introduction',
    key: 'introduction',
    ellipsis: true,
  },
  {
    title: '类型',
    dataIndex: 'category',
    key: 'category',
    sorter: true,
  },
  {
    title: '标签',
    dataIndex: 'tags',
    key: 'tags',
  },
  {
    title: '图片信息',
    dataIndex: 'picInfo',
    key: 'picInfo',
  },
  {
    title: '用户 id',
    dataIndex: 'userId',
    key: 'userId',
    width: 80,
    sorter: true,
  },
  {
    title: '审核信息',
    dataIndex: 'reviewMessage',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
    sorter: true,
  },
  {
    title: '编辑时间',
    dataIndex: 'editTime',
    key: 'editTime',
    sorter: true,
  },
  {
    title: '操作',
    key: 'action',
  },
]
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
// 动态计算列，同步排序状态
const columns = computed(() => {
  return baseColumns.map((col) => {
    if (col.sorter && col.key === searchParams.sortField) {
      return {
        ...col,
        sortOrder:
          searchParams.sortOrder === 'asc'
            ? 'ascend'
            : searchParams.sortOrder === 'desc'
              ? 'descend'
              : null,
      }
    }
    return {
      ...col,
      sortOrder: null,
    }
  })
})

// 列表数据与分页参数（受控状态）
const dataList = ref<API.Picture[]>([])
const total = ref(0)
const searchParams = reactive<API.PictureQueryRequest>({
  current: 1,
  pageSize: 10,
  sortField: undefined,
  sortOrder: undefined,
  id: undefined,
  name: undefined,
  introduction: undefined,
  category: undefined,
  tags: undefined,
  picSize: undefined,
  picWidth: undefined,
  picHeight: undefined,
  picScale: undefined,
  picFormat: undefined,
  userId: undefined,
  createTime: undefined,
  updateTime: undefined,
})
// 表格分页对象（绑定到 Table 的 pagination 属性）
const tablePagination = computed(() => ({
  current: searchParams.current,
  pageSize: searchParams.pageSize,
  total: total.value,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (t: number) => `共 ${t} 条`,
}))

// 拉取数据：根据 searchParams 请求后端，填充 dataList 与 total

// 清理空值字段，避免向后端传递空字符串
const cleanParams = (params: Record<string, any>) => {
  const out: Record<string, any> = {}
  Object.entries(params).forEach(([k, v]) => {
    if (v !== '' && v !== undefined && v !== null) out[k] = v
  })
  return out
}
const fetchData = async () => {
  const payload = cleanParams({
    ...searchParams,
    sortField: searchParams.sortField,
    nullSpaceId: true,
  })

  // 强制转换为 PictureQueryRequest，确保满足类型要求
  const payloadTyped: API.PictureQueryRequest = {
    ...payload,
    id: searchParams.id,
  }
  const { data } = await listPictureByPage(payloadTyped)
  if (data && data.code === 0 && data.data) {
    dataList.value = data.data.records ?? []
    total.value = data.data.total ?? 0
  } else {
    message.error('获取图片列表失败' + (data?.message ?? '未知错误'))
  }
}

const handleTableChange: TableProps['onChange'] = (pagination, filters, sorter) => {
  // 更新分页
  searchParams.current = pagination.current ?? 1
  searchParams.pageSize = pagination.pageSize ?? 10

  // 抽取排序字段与方向（兼容多种来源）
  const extractField = (s: any): string | undefined => {
    if (!s) return undefined
    return (
      (s?.field as string) ??
      (s?.columnKey as string) ??
      (s?.column?.dataIndex as string) ??
      undefined
    )
  }

  const normalizeOrder = (order?: 'descend' | 'ascend' | null): 'desc' | 'asc' | undefined => {
    if (!order) return undefined
    return order === 'descend' ? 'desc' : 'asc'
  }

  // 处理排序
  if (Array.isArray(sorter)) {
    const first = sorter[0]
    searchParams.sortField = extractField(first)
    searchParams.sortOrder = normalizeOrder(first?.order)
  } else if (sorter) {
    searchParams.sortField = extractField(sorter)
    searchParams.sortOrder = normalizeOrder(sorter?.order)
  } else {
    // 清除排序
    searchParams.sortField = undefined
    searchParams.sortOrder = undefined
  }

  // 重新拉取数据
  fetchData()
}
const doSearch = () => {
  // 更新分页
  searchParams.current = 1
  searchParams.pageSize = searchParams.pageSize ?? 10
  fetchData()
}
// ... existing code ...
onMounted(() => {
  fetchData()
})
const doDelete = async (id: number) => {
  if (!id) {
    message.error('图片id不能为空')
    return
  }
  try {
    const { data } = await deletePicture({ id })
    if (data && data.code === 0) {
      message.success('删除图片成功')
      fetchData()
    } else {
      message.error('删除图片失败' + (data?.message ?? '未知错误'))
    }
  } catch (error) {
    message.error('删除图片失败' + (error as Error).message)
  }
}
const cancel = (e: MouseEvent) => {
  console.log(e)
  message.error('你已取消操作！')
}

/**
 * 图片审核
 * @param record
 * @param reviewStatus
 */
const handleReview = async (
  record: API.Picture,
  reviewStatus: number,
  messageOverride?: string,
) => {
  if (!record.id) {
    message.error('图片 ID 不能为空')
    return
  }
  // 通过审核时使用默认消息，拒绝时使用已有的审核信息或默认消息
  let reviewMessage: string
  if (reviewStatus === PIC_REVIEW_STATUS_ENUM.PASS) {
    reviewMessage = '管理员自动过审'
  } else {
    reviewMessage = messageOverride ?? record.reviewMessage ?? '管理员操作拒绝'
  }

  try {
    const res = await doPictureReview({
      id: record.id,
      reviewStatus,
      reviewMessage,
    } as API.PictureUpdataRequest & { reviewStatus: number; reviewMessage: string })
    if (res.data.code === 0) {
      message.success('审核操作成功')
      fetchData()
    } else {
      message.error('审核失败' + (res.data.message ?? '未知错误'))
    }
  } catch (error) {
    message.error('审核失败：' + (error as Error).message)
  }
}
const handleReviewOK = async (reviewStatus: number) => {
  if (!reviewRecord.value) {
    message.error('未选中记录')
    return
  }
  await handleReview(reviewRecord.value, reviewStatus, reviewMessage.value)
  fetchData()
  open.value = false
}

const openReviewModal = (record: API.Picture) => {
  reviewRecord.value = record
  reviewMessage.value = record.reviewMessage || ''
  open.value = true
}
</script>

<style scoped>
.delete-action {
  color: #ff4d4f;
  cursor: pointer;
}
</style>
