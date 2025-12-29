# Technology Stack

## Project Type
Vue 3 企业级图片管理系统前端应用（Web Application），提供图片上传、管理、审核、空间管理等功能的单页应用（SPA）。

## Core Technologies

### Primary Language(s)
- **Language**: TypeScript ~5.6.3
- **Runtime**: Node.js 18+, 浏览器 ES2020+
- **Language-specific tools**: npm (包管理), vue-tsc (类型检查)

### Key Dependencies/Libraries

| 库/框架 | 版本 | 用途 |
|--------|------|------|
| **Vue.js** | 3.5.13 | 核心前端框架，使用 Composition API |
| **Vite** | 6.0.1 | 构建工具与开发服务器 |
| **Vue Router** | 4.4.5 | 客户端路由管理 |
| **Pinia** | 2.2.6 | 状态管理（替代 Vuex） |
| **Ant Design Vue** | 4.2.6 | 企业级 UI 组件库 |
| **Axios** | 1.13.1 | HTTP 客户端 |
| **file-saver** | 2.0.5 | 文件下载工具 |

### Application Architecture
- **架构模式**: 单页应用（SPA）+ 组件化架构
- **状态管理**: Pinia Store 集中管理
- **路由模式**: Hash/History 路由
- **数据流**: 单向数据流（Props Down, Events Up）

```
┌─────────────────────────────────┐
│    Pages（页面组件）              │
├─────────────────────────────────┤
│    Components（通用组件）         │
├─────────────────────────────────┤
│    Stores（Pinia状态管理）        │
├─────────────────────────────────┤
│    API（HTTP接口层）             │
├─────────────────────────────────┤
│    Utils / Constants            │
└─────────────────────────────────┘
```

### Data Storage (if applicable)
- **Primary storage**: 后端 API 服务（RESTful）
- **Caching**: 浏览器本地缓存 + API 缓存机制
- **Data formats**: JSON

### External Integrations
- **APIs**: 后端 API 服务 `http://localhost:8081/api/`
- **Protocols**: HTTP/REST
- **Authentication**: Cookie-based 会话认证（withCredentials: true）

### Monitoring & Dashboard Technologies
- **Dashboard Framework**: Vue 3 + Ant Design Vue
- **Real-time Communication**: 轮询（可扩展 WebSocket）
- **Visualization Libraries**: Ant Design Vue 内置图表组件
- **State Management**: Pinia（文件：`src/stores/useLoginUserStore.ts`）

## Development Environment

### Build & Development Tools
- **Build System**: Vite 6.0.1
- **Package Management**: npm
- **Development workflow**:
  - 热更新（HMR）
  - 开发服务器端口：8088
  - 自动组件导入（unplugin-vue-components）

### Code Quality Tools
- **Static Analysis**: ESLint 9.14.0 + @vue/eslint-config-typescript
- **Formatting**: Prettier 3.3.3
- **Testing Framework**: 暂未集成
- **Documentation**: Markdown 规范文档

### Version Control & Collaboration
- **VCS**: Git
- **Branching Strategy**:
  - `master`: 主分支/生产分支
  - `dev`: 开发分支
- **Code Review Process**: PR 审核

### Dashboard Development
- **Live Reload**: Vite HMR（热模块替换）
- **Port Management**: 默认 8088，非严格端口
- **Multi-Instance Support**: 支持

## Deployment & Distribution
- **Target Platform(s)**: Web 浏览器（Chrome、Firefox、Safari、Edge）
- **Distribution Method**: 静态资源部署
- **Installation Requirements**:
  - Node.js >= 18.0
  - npm >= 9.0
- **Update Mechanism**: 重新构建部署

## Technical Requirements & Constraints

### Performance Requirements
- 首屏加载时间 < 3s
- 图片懒加载
- 分页查询限制单页 20 条
- 请求超时：60 秒

### Compatibility Requirements
- **Platform Support**: 现代浏览器（ES2020+）
- **Dependency Versions**:
  - Vue >= 3.5
  - Node >= 18
- **Standards Compliance**: ECMAScript 2020, TypeScript 5.x

### Security & Compliance
- **Security Requirements**:
  - Cookie 会话认证
  - 路由权限守卫
  - 敏感操作需管理员权限
- **Compliance Standards**: 无特殊合规要求
- **Threat Model**:
  - 防止未授权访问管理后台
  - 防止 XSS/CSRF 攻击

### Scalability & Reliability
- **Expected Load**: 中小型用户规模
- **Availability Requirements**: 依赖后端服务可用性
- **Growth Projections**: 可通过组件化扩展功能模块

## Technical Decisions & Rationale

### Decision Log

1. **Vue 3 + Composition API**:
   - 原因：更好的 TypeScript 支持，逻辑复用更灵活
   - 替代方案：React、Angular
   - 选择理由：团队熟悉度，生态完善

2. **Pinia 替代 Vuex**:
   - 原因：更简洁的 API，天然 TypeScript 支持
   - 替代方案：Vuex 4
   - 选择理由：减少样板代码，类型推断更好

3. **Ant Design Vue**:
   - 原因：企业级组件库，开箱即用
   - 替代方案：Element Plus、Naive UI
   - 选择理由：组件丰富，文档完善

4. **Vite 构建工具**:
   - 原因：快速冷启动，原生 ESM 支持
   - 替代方案：Webpack
   - 选择理由：开发体验更好，构建速度更快

## Known Limitations

| 限制 | 影响 | 未来方案 |
|-----|------|---------|
| **缺少单元测试** | 代码质量保障不足 | 集成 Vitest + Vue Test Utils |
| **无国际化支持** | 仅支持中文 | 集成 vue-i18n |
| **API baseURL 硬编码** | 环境切换不便 | 使用环境变量配置 |
| **缺少全局错误上报** | 生产环境问题定位困难 | 集成 Sentry 等监控工具 |
| **无 PWA 支持** | 移动端体验一般 | 集成 vite-plugin-pwa |

---

**文档版本**: 1.0.0
**最后更新**: 2025-12-27
**维护者**: 前端开发团队