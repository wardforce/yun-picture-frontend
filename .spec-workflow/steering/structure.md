# Project Structure

## Directory Organization

```
yun-picture-frontend/
├── src/                          # 源代码目录
│   ├── api/                      # API 接口层
│   │   ├── typings.d.ts          # API 类型定义（自动生成）
│   │   ├── userController.ts     # 用户接口
│   │   ├── pictureController.ts  # 图片接口
│   │   ├── spaceController.ts    # 空间接口
│   │   ├── fileController.ts     # 文件接口
│   │   ├── mainController.ts     # 主业务接口
│   │   └── index.ts              # API 导出入口
│   │
│   ├── components/               # 通用组件
│   │   ├── GlobalHeader.vue      # 全局顶部导航
│   │   ├── GlobalSider.vue       # 全局左侧菜单
│   │   ├── PictureList.vue       # 图片列表展示
│   │   ├── PictureUpload.vue     # 图片上传组件
│   │   ├── UrlPictureUpload.vue  # URL 图片上传
│   │   ├── PictureSearchFrom.vue # 图片搜索表单
│   │   └── icons/                # 图标组件（预留）
│   │
│   ├── pages/                    # 页面组件
│   │   ├── HomePage.vue          # 首页（图片浏览）
│   │   ├── AddPicturePage.vue    # 创建/编辑图片页
│   │   ├── AddPicturePageByBatch.vue  # 批量上传图片
│   │   ├── PictureDetailPage.vue # 图片详情页
│   │   ├── AddSpacePage.vue      # 创建/编辑空间页
│   │   ├── MySpacePage.vue       # 我的空间（重定向）
│   │   ├── SpaceDetailPage.vue   # 空间详情页
│   │   │
│   │   ├── admin/                # 管理员页面
│   │   │   ├── UserMangePage.vue     # 用户管理
│   │   │   ├── PictureMangePage.vue  # 图片管理
│   │   │   └── SpaceManagePage.vue   # 空间管理
│   │   │
│   │   └── user/                 # 用户相关页面
│   │       ├── UserLoginPage.vue     # 用户登录
│   │       └── UserRegisterPage.vue  # 用户注册
│   │
│   ├── stores/                   # Pinia 状态管理
│   │   ├── useLoginUserStore.ts  # 登录用户状态
│   │   └── counter.ts            # 计数器状态（示例）
│   │
│   ├── router/                   # 路由配置
│   │   └── index.ts              # 路由定义
│   │
│   ├── layouts/                  # 布局模板
│   │   └── BasicLayout.vue       # 基础布局
│   │
│   ├── constants/                # 常量定义
│   │   ├── picture.ts            # 图片相关常量
│   │   ├── space.ts              # 空间相关常量
│   │   └── userRole.ts           # 用户角色常量
│   │
│   ├── utils/                    # 工具函数
│   │   └── index.ts              # 文件格式化、图片下载
│   │
│   ├── assets/                   # 静态资源
│   ├── views/                    # 视图页面（遗留）
│   │
│   ├── App.vue                   # 根组件
│   ├── main.ts                   # 应用入口
│   ├── request.ts                # Axios 实例与拦截器
│   └── accesss.ts                # 全局路由权限控制
│
├── public/                       # 公共静态资源
├── docs/                         # 项目文档
│
├── .spec-workflow/               # 规范文档工作流
│   ├── steering/                 # 指导文档（核心规范）
│   │   ├── tech.md               # 技术栈文档
│   │   ├── product.md            # 产品需求文档
│   │   └── structure.md          # 项目结构文档
│   ├── specs/                    # 功能规范文档
│   ├── templates/                # 文档模板
│   ├── approvals/                # 审批文档
│   ├── archive/                  # 归档
│   └── user-templates/           # 用户自定义模板
│
├── vite.config.ts                # Vite 配置
├── tsconfig.json                 # TypeScript 主配置
├── tsconfig.app.json             # 应用 TS 配置
├── tsconfig.node.json            # 构建工具 TS 配置
├── package.json                  # 项目依赖配置
├── openapi.config.js             # OpenAPI 代码生成配置
└── README.md                     # 项目说明
```

## Naming Conventions

### Files

| 类型 | 命名规范 | 示例 |
|-----|---------|------|
| **Vue 组件** | PascalCase | `GlobalHeader.vue`, `PictureList.vue` |
| **页面组件** | PascalCase + Page 后缀 | `HomePage.vue`, `UserLoginPage.vue` |
| **API 控制器** | camelCase + Controller 后缀 | `userController.ts`, `pictureController.ts` |
| **Store** | use + 名称 + Store | `useLoginUserStore.ts` |
| **工具函数** | camelCase | `index.ts` (utils) |
| **常量文件** | camelCase | `picture.ts`, `userRole.ts` |
| **类型定义** | .d.ts 后缀 | `typings.d.ts` |

### Code

| 类型 | 命名规范 | 示例 |
|-----|---------|------|
| **组件名** | PascalCase | `GlobalHeader`, `PictureList` |
| **函数/方法** | camelCase | `fetchLoginUser()`, `formatSize()` |
| **常量** | UPPER_SNAKE_CASE | `PIC_REVIEW_STATUS_ENUM`, `SPACE_LEVEL_MAP` |
| **变量** | camelCase | `loginUser`, `pictureList` |
| **接口/类型** | PascalCase | `LoginUserVO`, `PictureVO` |
| **枚举** | PascalCase + Enum 后缀 | `UserRoleEnum`, `SpaceLevelEnum` |

## Import Patterns

### Import Order

```typescript
// 1. Vue 核心库
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'

// 2. 第三方库
import { message } from 'ant-design-vue'
import axios from 'axios'

// 3. 内部模块 - Store
import { useLoginUserStore } from '@/stores/useLoginUserStore'

// 4. 内部模块 - API
import { listPictureVoByPageUsingPost } from '@/api/pictureController'

// 5. 内部模块 - 组件
import GlobalHeader from '@/components/GlobalHeader.vue'

// 6. 内部模块 - 工具/常量
import { formatSize } from '@/utils'
import { PIC_REVIEW_STATUS_ENUM } from '@/constants/picture'

// 7. 类型定义
import type { PictureVO, SpaceVO } from '@/api/typings'

// 8. 样式导入（最后）
import './styles.css'
```

### Module/Package Organization

```typescript
// 使用 @ 别名指向 src 目录
import { xxx } from '@/api/userController'
import { xxx } from '@/components/GlobalHeader.vue'
import { xxx } from '@/stores/useLoginUserStore'

// 避免深层相对路径
// ❌ Bad
import { xxx } from '../../../components/GlobalHeader.vue'

// ✅ Good
import { xxx } from '@/components/GlobalHeader.vue'
```

## Code Structure Patterns

### Vue 组件结构

```vue
<template>
  <!-- 模板内容 -->
</template>

<script setup lang="ts">
// 1. 导入声明
import { ref, onMounted } from 'vue'
import type { PropType } from 'vue'

// 2. Props 定义
const props = defineProps<{
  title: string
  data?: Array<any>
}>()

// 3. Emits 定义
const emit = defineEmits<{
  (e: 'update', value: string): void
  (e: 'delete', id: number): void
}>()

// 4. 响应式状态
const loading = ref(false)
const dataList = ref<any[]>([])

// 5. 计算属性
const isEmpty = computed(() => dataList.value.length === 0)

// 6. 方法定义
const fetchData = async () => {
  // ...
}

// 7. 生命周期钩子
onMounted(() => {
  fetchData()
})
</script>

<style scoped>
/* 组件样式 */
</style>
```

### API 控制器结构

```typescript
// src/api/xxxController.ts

import request from '@/request'

/**
 * 获取数据列表
 * @param params 查询参数
 */
export async function getListUsingGet(
  params: API.QueryParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponse<API.DataVO[]>>('/api/xxx/list', {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  })
}

/**
 * 创建数据
 * @param body 请求体
 */
export async function createUsingPost(
  body: API.CreateRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponse<number>>('/api/xxx/create', {
    method: 'POST',
    data: body,
    ...(options || {}),
  })
}
```

### Store 结构

```typescript
// src/stores/useXxxStore.ts

import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useXxxStore = defineStore('xxx', () => {
  // 1. 状态定义
  const data = ref<DataType | null>(null)
  const loading = ref(false)

  // 2. Actions
  async function fetchData() {
    loading.value = true
    try {
      const res = await api.getData()
      data.value = res.data
    } finally {
      loading.value = false
    }
  }

  function setData(newData: DataType) {
    data.value = newData
  }

  // 3. 返回状态和方法
  return {
    data,
    loading,
    fetchData,
    setData,
  }
})
```

### 常量定义结构

```typescript
// src/constants/xxx.ts

/**
 * 状态枚举
 */
export const STATUS_ENUM = {
  PENDING: 0,
  ACTIVE: 1,
  DISABLED: 2,
} as const

/**
 * 状态文案映射
 */
export const STATUS_MAP: Record<number, string> = {
  [STATUS_ENUM.PENDING]: '待处理',
  [STATUS_ENUM.ACTIVE]: '已激活',
  [STATUS_ENUM.DISABLED]: '已禁用',
}

/**
 * 表单选项配置
 */
export const STATUS_OPTIONS = [
  { label: '待处理', value: STATUS_ENUM.PENDING },
  { label: '已激活', value: STATUS_ENUM.ACTIVE },
  { label: '已禁用', value: STATUS_ENUM.DISABLED },
]
```

## Code Organization Principles

1. **单一职责**: 每个文件只负责一个功能模块
2. **模块化**: 按功能划分目录，便于查找和维护
3. **可测试性**: 业务逻辑与 UI 分离，便于单元测试
4. **一致性**: 遵循统一的命名和编码规范

## Module Boundaries

### 模块依赖关系

```
Pages（页面）
  ├─ 可依赖: Components, Stores, API, Utils, Constants
  └─ 不可依赖: 其他 Pages

Components（组件）
  ├─ 可依赖: Utils, Constants, API（仅读取）
  └─ 不可依赖: Pages, Stores（通过 props/emit 通信）

Stores（状态）
  ├─ 可依赖: API, Utils, Constants
  └─ 不可依赖: Pages, Components

API（接口）
  ├─ 可依赖: request.ts, Constants
  └─ 不可依赖: Pages, Components, Stores

Utils / Constants
  ├─ 可依赖: 无（纯函数/纯数据）
  └─ 不可依赖: 任何业务模块
```

### 公共 vs 私有

| 类型 | 位置 | 说明 |
|-----|------|------|
| **公共组件** | `src/components/` | 可被多个页面复用 |
| **页面私有组件** | `src/pages/xxx/components/` | 仅被特定页面使用 |
| **公共工具** | `src/utils/` | 通用工具函数 |
| **公共常量** | `src/constants/` | 全局常量定义 |

## Code Size Guidelines

| 类型 | 建议行数 | 说明 |
|-----|---------|------|
| **Vue 组件** | < 300 行 | 超过考虑拆分子组件 |
| **函数/方法** | < 50 行 | 超过考虑提取子函数 |
| **API 控制器** | < 200 行 | 按业务模块拆分 |
| **Store** | < 150 行 | 复杂状态考虑拆分 |
| **嵌套深度** | ≤ 3 层 | 避免过深嵌套 |

## Documentation Standards

### 代码注释规范

```typescript
/**
 * 函数描述
 * @param paramName - 参数说明
 * @returns 返回值说明
 * @example
 * ```ts
 * const result = functionName(param)
 * ```
 */
function functionName(paramName: string): ResultType {
  // 实现逻辑
}
```

### 组件文档规范

```vue
<!--
  组件名称: GlobalHeader
  描述: 全局顶部导航栏组件

  Props:
    - title: 页面标题
    - showMenu: 是否显示菜单

  Events:
    - @logout: 退出登录事件
-->
```

## 关键文件说明

| 文件 | 作用 | 修改频率 |
|-----|------|---------|
| `src/main.ts` | 应用入口，全局配置 | 低 |
| `src/App.vue` | 根组件，全局样式 | 低 |
| `src/router/index.ts` | 路由配置 | 中 |
| `src/accesss.ts` | 权限守卫 | 低 |
| `src/request.ts` | HTTP 客户端配置 | 低 |
| `src/stores/useLoginUserStore.ts` | 用户状态 | 中 |
| `src/api/typings.d.ts` | API 类型定义 | 高（自动生成）|

---

**文档版本**: 1.0.0
**最后更新**: 2025-12-27
**维护者**: 前端开发团队
