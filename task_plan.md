# Task Plan: 聊天记录删除功能

## Goal
在 AI 图片生成聊天界面添加删除功能：消息气泡可删除单条记录，会话列表可删除整个会话。

## Current Phase
Phase 1

## Phases

### Phase 1: Requirements & Discovery
- [x] 理解用户需求
- [x] 分析现有代码结构
- [x] 确认 API 接口
- **Status:** complete

### Phase 2: Planning & Structure
- [ ] 设计 UI 交互方案
- [ ] 确定代码修改点
- [ ] 设计数据流
- **Status:** in_progress

### Phase 3: Implementation
- [ ] ChatArea.vue: 添加消息删除下拉菜单
- [ ] ConversationSidebar.vue: 添加会话删除下拉菜单（替换右键菜单）
- [ ] useAiChatStore.ts: 添加 deleteMessage action
- **Status:** pending

### Phase 4: Testing & Verification
- [ ] 测试删除单条消息功能
- [ ] 测试删除会话功能
- [ ] 验证删除后界面刷新
- **Status:** pending

### Phase 5: Delivery
- [ ] 代码审查
- [ ] 交付用户
- **Status:** pending

## Key Findings

### 现有代码分析

**1. ChatArea.vue (消息列表)**
- 消息结构: `ChatMessageVM { id, content, placement, type, createTime, pictures }`
- 时间显示位置: `.message-time` 在 `.message-content` 内部
- 需要在时间下方添加 `<DashOutlined />` 图标

**2. ConversationSidebar.vue (会话列表)**
- 已有右键菜单删除功能，但用户要求改为点击图标触发
- 会话结构: `API.ChatHistorySessionVO { sessionId, firstPrompt, firstChatTime }`
- 需要在每个 `.session-item` 右侧添加删除图标

**3. useAiChatStore.ts (状态管理)**
- 已有 `deleteSession(sessionId)` 方法
- **缺少** `deleteMessage(id)` 方法，需要新增

**4. chatHistoryController.ts (API)**
- `deleteById(body: API.DeleteRequest)` - 删除单条记录
- `deleteBySession(body: API.DeleteBySessionRequest)` - 删除整个会话

## Decisions Made
| Decision | Rationale |
|----------|-----------|
| 使用 Ant Design Vue Dropdown 组件 | 用户明确要求，且已在项目中使用 |
| 点击 DashOutlined 触发下拉菜单 | 符合用户截图标注的交互方式 |
| 删除后调用 loadSessionDetail 刷新 | 保持数据一致性 |
| ConversationSidebar 保留右键菜单 + 添加图标 | 双重入口提升体验 |

## Implementation Details

### ChatArea.vue 修改点

```vue
<!-- 在 .message-time 下方添加 -->
<a-dropdown :trigger="['click']">
  <DashOutlined class="message-action-icon" />
  <template #overlay>
    <a-menu @click="handleMessageAction($event, msg)">
      <a-menu-item key="delete" danger>
        <DeleteOutlined /> 删除
      </a-menu-item>
    </a-menu>
  </template>
</a-dropdown>
```

### ConversationSidebar.vue 修改点

```vue
<!-- 在 .session-item 内添加 -->
<a-dropdown :trigger="['click']" @click.stop>
  <DashOutlined class="session-action-icon" />
  <template #overlay>
    <a-menu @click="handleSessionAction($event, session)">
      <a-menu-item key="delete" danger>
        <DeleteOutlined /> 删除会话
      </a-menu-item>
    </a-menu>
  </template>
</a-dropdown>
```

### useAiChatStore.ts 新增方法

```typescript
// 删除单条消息
async function deleteMessage(id: number) {
  try {
    const res = await deleteById({ id })
    if (res.data.code === 0) {
      messages.value = messages.value.filter(m => m.id !== id)
      // 重新加载当前会话
      if (currentSessionId.value) {
        await loadSessionDetail(currentSessionId.value)
      }
    }
  } catch (error) {
    console.error('删除消息失败:', error)
  }
}
```

## Errors Encountered
| Error | Attempt | Resolution |
|-------|---------|------------|
| (none yet) | - | - |

## Notes
- 用户截图显示红框位置：消息气泡右下角、会话列表项右侧
- 需要导入 `DashOutlined, DeleteOutlined` 图标
- 删除需要确认弹窗，防止误操作
