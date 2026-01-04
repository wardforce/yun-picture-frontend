# Project Context

## Purpose

**云图库前端 (Yun Picture Frontend)** - 一个功能完善的云端图片存储与管理平台前端应用。

### 核心功能

- **用户系统**: 用户注册、登录、权限管理（普通用户/VIP/管理员）
- **图片管理**: 图片上传（单张/批量）、编辑、删除、搜索、详情查看
- **空间管理**: 个人空间创建与管理，支持多级别空间（普通版/专业版/旗舰版）
- **图片搜索**: 支持按名称、分类、标签、颜色、时间等多维度搜索
- **高级功能**: 图片裁剪、以图搜图、颜色搜索

## Tech Stack

### 核心框架

- **Vue 3** (v3.5.13) - 组合式 API (Composition API)
- **TypeScript** (~5.6.3) - 类型安全
- **Vite** (v6.0.1) - 构建工具与开发服务器

### 状态管理与路由

- **Pinia** (v2.2.6) - 状态管理
- **Vue Router** (v4.4.5) - 路由管理

### UI 组件库

- **Ant Design Vue** (v4.2.6) - UI 组件库

### HTTP 请求

- **Axios** (v1.13.1) - HTTP 客户端

### 工具库

- **vue-cropper** (v1.1.4) - 图片裁剪
- **file-saver** (v2.0.5) - 文件下载
- **vue3-colorpicker** (v2.3.0) - 颜色选择器

### 开发工具

- **ESLint** (v9.14.0) - 代码检查
- **Prettier** (v3.3.3) - 代码格式化
- **vue-tsc** (v2.1.10) - TypeScript 类型检查
- **@umijs/openapi** (v1.14.1) - API 代码生成

## Project Conventions

### Code Style

#### 格式化规则 (Prettier)

- `semi: false` - 不使用分号
- `singleQuote: true` - 使用单引号
- `printWidth: 100` - 每行最大 100 字符

#### 缩进规则 (EditorConfig)

- 使用 **2 空格** 缩进
- UTF-8 编码
- 文件末尾插入空行
- 去除行尾空格

#### 命名约定

- **组件文件**: PascalCase (如 `UserLoginPage.vue`, `GlobalHeader.vue`)
- **工具函数**: camelCase (如 `useLoginUserStore.ts`)
- **常量文件**: camelCase (如 `userRole.ts`, `picture.ts`)
- **API 控制器**: camelCase + Controller (如 `userController.ts`)

### Architecture Patterns

#### 目录结构

```
src/
├── api/                 # API 接口层 (自动生成)
│   ├── typings.d.ts     # API 类型定义
│   └── *Controller.ts   # 各模块 API 函数
├── assets/              # 静态资源
├── components/          # 可复用组件
├── constants/           # 常量定义与枚举
├── layouts/             # 布局组件
├── pages/               # 页面组件
│   ├── admin/           # 管理员页面
│   └── user/            # 用户相关页面
├── router/              # 路由配置
├── stores/              # Pinia 状态管理
├── utils/               # 工具函数
└── views/               # 视图组件
```

#### 权限控制模式

- 使用路由守卫 (`accesss.ts`) 进行全局权限校验
- 管理员页面路径以 `/admin` 开头
- 未登录用户自动重定向到登录页

#### API 层模式

- 使用 `@umijs/openapi` 从后端 OpenAPI 规范自动生成 API 代码
- 统一使用 Axios 实例 (`request.ts`) 处理请求
- 全局响应拦截器处理未登录状态 (code: 40100)

#### 状态管理模式

- 使用 Pinia 的 Composition API 风格定义 Store
- `useLoginUserStore` 管理用户登录状态

### Testing Strategy

- 使用 `vue-tsc --build` 进行 TypeScript 类型检查
- 使用 ESLint 进行代码静态分析
- 测试目录: `tests/`

### Git Workflow

#### 分支策略

- 主分支用于稳定版本
- 功能开发使用功能分支

#### 忽略文件

- `node_modules/`
- `dist/`
- `.idea/`
- `*.log`
- `*.local`

## Domain Context

### 业务实体

- **User (用户)**: 支持普通用户、VIP 用户、管理员三种角色
- **Picture (图片)**: 核心实体，包含元数据（尺寸、格式、颜色等）和审核状态
- **Space (空间)**: 用户的图片存储空间，有容量限制

### 审核机制

- 图片上传后需审核 (待审核/通过/拒绝)
- 审核信息包含审核人、审核时间、审核消息

### VIP 体系

- 用户可升级为 VIP，有会员编号和等级
- 会员有过期时间限制
- 支持邀请码机制

### 空间级别

- **普通版 (0)**: 基础存储容量
- **专业版 (1)**: 中等存储容量
- **旗舰版 (2)**: 大容量存储

## Important Constraints

### 后端依赖

- 后端 API 地址: `http://localhost:8081/api/`
- 需要后端服务运行才能正常使用
- 使用 Cookie 进行身份验证 (`withCredentials: true`)

### 浏览器兼容

- 基于 Vite 和 ES Modules，需要现代浏览器支持

### 开发环境

- 开发服务器端口: `8088`
- 推荐 IDE: VSCode + Volar 插件

## External Dependencies

### 后端 API

- 基础路径: `http://localhost:8081/api/`
- 使用 RESTful 风格 API
- OpenAPI 规范用于代码生成

### API 模块

- `/user/*` - 用户管理
- `/picture/*` - 图片管理
- `/space/*` - 空间管理
- `/file/*` - 文件上传下载

## NPM Scripts

| 命令                 | 说明                   |
| -------------------- | ---------------------- |
| `npm run dev`        | 启动开发服务器         |
| `npm run build`      | 类型检查并构建生产版本 |
| `npm run preview`    | 预览生产构建           |
| `npm run lint`       | ESLint 代码检查与修复  |
| `npm run format`     | Prettier 格式化代码    |
| `npm run openapi`    | 从后端生成 API 代码    |
| `npm run type-check` | TypeScript 类型检查    |
