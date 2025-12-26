<template>
  <div class="userMangerPage">
    <a-flex justify="space-between">
      <h2>空间管理</h2>
      <a-space>
        <a-button type="primary" href="/add_space" target="_blank">+ 创建空间</a-button>
      </a-space>
    </a-flex>
    <div style="margin-bottom: 16px;"></div>
    <!-- 条件查询 -->
    <a-form layout="inline" :model="searchParams" @finish="doSearch" @submit.prevent="doSearch">
      <a-form-item label="id">
        <a-input v-model:value="searchParams.id" placeholder="输入id" allow-clear />
      </a-form-item>
      <a-form-item label="用户id">
        <a-input v-model:value="searchParams.userId" placeholder="输入用户id" allow-clear />
      </a-form-item>
      <a-form-item label="空间名称">
        <a-input v-model:value="searchParams.spaceName" placeholder="输入空间名称" allow-clear />
      </a-form-item>
      <a-form-item label="空间级别">
        <a-select v-model:value="searchParams.spaceLevel" placeholder="请选择空间级别" allow-clear
          :options="SPACE_LEVEL_OPTIONS" />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit" @click="doSearch">搜索</a-button>
      </a-form-item>
    </a-form>

    <!-- 用户列表表格：使用 AntD Table 原生分页与排序 -->
    <a-table :columns="columns" :data-source="dataList" :pagination="tablePagination" :row-key="'id'"
      @change="handleTableChange">


      <template #bodyCell="{ column, record }">

        <template v-if="column.dataIndex === 'spaceUseInfo'">
          <div>大小：{{ formatSize(record.totalSize) }}/{{ formatSize(record.maxSize) }}</div>
          <div>数量：{{ record.totalCount }}/{{ record.maxCount }}</div>
        </template>
        <template v-if="column.dataIndex === 'spaceLevel'">
          <div>空间级别：{{ SPACE_LEVEL_MAP[record.spaceLevel] }}</div>
        </template>
        <template v-if="column.dataIndex === 'createTime'">
          {{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template v-if="column.dataIndex === 'editTime'">
          {{ dayjs(record.editTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template v-else-if="column.key === 'action'">
          <a-button type="link" :href="`/add_space?id=${record.id}`" target="_blank">编辑</a-button>
          <a-popconfirm title="确定删除吗？" ok-test="确定" cancel-text="取消" danger @confirm="doDelete(record.id)"
            @cancel="cancel">
            <span class="delete-action">删除</span>
          </a-popconfirm>

        </template>
      </template>
    </a-table>

  </div>
</template>
<script lang="ts" setup>
// 接口：图片分页查询（由 openapi 生成）
import { listSpaceByPage } from '@/api/spaceController';
import { SmileOutlined } from '@ant-design/icons-vue';
import { message, type TableProps } from 'ant-design-vue';
import { computed, onMounted, reactive, ref } from 'vue';
import dayjs from 'dayjs';
import { deleteSpace } from '@/api/spaceController';
import { formatSize } from '@/utils';
import { SPACE_LEVEL_MAP, SPACE_LEVEL_OPTIONS } from '@/constants/space';

// 说明：移除 vue-request 依赖，改用 AntD Table 原生分页与 onChange 事件处理，避免未安装依赖导致的报错
// 基础列定义
const open = ref<boolean>(false)
const reviewRecord = ref<API.Space | null>(null)
const reviewMessage = ref<string>('')
const baseColumns = [
  {
    title: 'id',
    dataIndex: 'id',
    width: 80,
  },
  {
    title: '空间名称',
    dataIndex: 'spaceName',
  },
  {
    title: '空间级别',
    dataIndex: 'spaceLevel',
  },
  {
    title: '使用情况',
    dataIndex: 'spaceUseInfo',
  },
  {
    title: '用户 id',
    dataIndex: 'userId',
    width: 80,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
  },
  {
    title: '编辑时间',
    dataIndex: 'editTime',
  },
  {
    title: '操作',
    key: 'action',
  },
]


// 动态计算列，同步排序状态
const columns = computed(() => {
  return baseColumns.map((col) => {
    if (col.sorter && col.key === searchParams.sortField) {
      return {
        ...col,
        sortOrder: searchParams.sortOrder === 'asc' ? 'ascend' : searchParams.sortOrder === 'desc' ? 'descend' : null,
      }
    }
    return {
      ...col,
      sortOrder: null,
    }
  })
})

// 列表数据与分页参数（受控状态）
const dataList = ref<API.Space[]>([])
const total = ref(0)
const searchParams = reactive<API.SpaceQueryRequest>({
  current: 1,
  pageSize: 10,
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
  })

  // 强制转换为 SpaceQueryRequest，确保满足类型要求
  const payloadTyped: API.SpaceQueryRequest = {
    ...payload,
    id: searchParams.id
  }
  const { data } = await listSpaceByPage(payloadTyped)
  if (data && data.code === 0 && data.data) {
    dataList.value = data.data.records ?? []
    total.value = data.data.total ?? 0
  } else {
    message.error('获取空间列表失败' + (data?.message ?? '未知错误'))
  }
}



const handleTableChange: TableProps['onChange'] = (pagination, filters, sorter) => {
  // 更新分页
  searchParams.current = pagination.current ?? 1
  searchParams.pageSize = pagination.pageSize ?? 10

  // 抽取排序字段与方向（兼容多种来源）
  const extractField = (s: any): string | undefined => {
    if (!s) return undefined
    return (s?.field as string) ?? (s?.columnKey as string) ?? (s?.column?.dataIndex as string) ?? undefined
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
    const { data } = await deleteSpace({ id })
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
  console.log(e);
  message.error('你已取消操作！')
}




</script>

<style scoped>
.delete-action {
  color: #ff4d4f;
  cursor: pointer;
}
</style>
