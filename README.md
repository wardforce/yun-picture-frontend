# 狐仙云图前端

**Huxian Yun Picture Frontend** is the frontend application for the Huxian Yun Picture platform, built with Vue 3 + TypeScript + Ant Design Vue.

**狐仙云图前端**是狐仙云图平台的前端应用，基于 Vue 3 + TypeScript + Ant Design Vue 构建。

---

## Tech Stack | 技术栈

- **Framework**: Vue 3 + TypeScript
- **Build Tool**: Vite 6
- **UI Library**: Ant Design Vue 4
- **State Management**: Pinia
- **Router**: Vue Router
- **HTTP Client**: OpenAPI Auto-generated

- **框架**: Vue 3 + TypeScript
- **构建工具**: Vite 6
- **UI 组件库**: Ant Design Vue 4
- **状态管理**: Pinia
- **路由**: Vue Router
- **HTTP 客户端**: 基于 OpenAPI 自动生成

---

## Quick Start | 快速开始

### Prerequisites | 前置要求

- Node.js 18+
- Backend service running at http://localhost:8081

### Install Dependencies | 安装依赖

```bash
npm install
```

### Generate API Client | 生成 API 客户端

**Important**: Requires backend service running first

**重要**: 生成前需要先启动后端服务

```bash
npm run openapi
```

### Start Development Server | 启动开发服务器

```bash
npm run dev
```

Visit http://localhost:8088

### Build Production | 构建生产版本

```bash
npm run build
```

### Code Style | 代码规范

```bash
npm run lint    # ESLint check and fix
npm run format  # Prettier format
```

---

## Project Structure | 项目结构

```
src/
├── api/          - API Clients (OpenAPI auto-generated)
├── assets/       - Static Assets
├── components/   - Reusable Components (stateless, props-based)
├── pages/        - Route-level Pages (can have state and side effects)
├── router/       - Vue Router Configuration
├── stores/       - Pinia State Management
├── utils/        - Utility Functions
└── main.ts       - Application Entry Point

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

---

## Development Workflow | 开发工作流

### When Backend API Changes | 当后端 API 发生变更时

1. Ensure backend service is running
2. Run `npm run openapi` to regenerate API client
3. Frontend code will automatically use new type definitions

1. 确保后端服务正在运行
2. 运行 `npm run openapi` 重新生成 API 客户端
3. 前端代码会自动使用新的类型定义

---

## IDE Recommendation | IDE 推荐

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (disable Vetur)

---

## Related Links | 相关链接

- **Main Project**: https://github.com/wardforce/yun-picture-backend
- **Backend Repository**: https://github.com/wardforce/yun-picture-backend
- **License**: Apache 2.0
