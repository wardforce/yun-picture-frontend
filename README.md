# 狐仙云图前端 (yun-picture-frontend)

狐仙云图前端项目，基于 Vue 3 + TypeScript + Ant Design Vue 构建。

## 技术栈

- **框架**: Vue 3 + TypeScript
- **构建工具**: Vite 6
- **UI 组件库**: Ant Design Vue 4
- **状态管理**: Pinia
- **路由**: Vue Router
- **HTTP 客户端**: 基于 OpenAPI 自动生成

## 快速开始

### 前置要求

- Node.js 18+
- 后端服务运行在 http://localhost:8081

### 安装依赖

```bash
npm install
```

### 生成 API 客户端

**重要**: 生成前需要先启动后端服务

```bash
npm run openapi
```

### 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:8088

### 构建生产版本

```bash
npm run build
```

### 代码规范

```bash
npm run lint    # ESLint 检查并修复
npm run format  # Prettier 格式化
```

## 项目结构

```
src/
├── api/          - API 客户端（OpenAPI 自动生成）
├── assets/       - 静态资源
├── components/   - 通用组件（无状态，通过 props 通信）
├── pages/        - 路由级页面（可以有状态和副作用）
├── router/       - Vue Router 路由配置
├── stores/       - Pinia 状态管理
├── utils/        - 工具函数
└── main.ts       - 应用入口
```

## 开发工作流

### 当后端 API 发生变更时

1. 确保后端服务正在运行
2. 运行 `npm run openapi` 重新生成 API 客户端
3. 前端代码会自动使用新的类型定义

## IDE 推荐

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (需要禁用 Vetur)

## 相关链接

- **主项目**: https://github.com/wardforce/yun-picture-backend
- **后端仓库**: https://github.com/wardforce/yun-picture-backend
- **License**: Apache 2.0
