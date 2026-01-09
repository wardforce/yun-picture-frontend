<template>
  <div class="ai-generate-page">
    <a-layout class="page-layout">
      <!-- 左侧对话记录侧边栏 -->
      <a-layout-sider width="260" theme="light" class="sidebar">
        <ConversationSidebar />
      </a-layout-sider>

      <!-- 主内容区 -->
      <a-layout-content class="main-content">
        <!-- 顶部标题栏 -->
        <div class="header">
          <div class="header-left">
            <h3>AI图片生成</h3>
          </div>
          <div class="header-right">
            <!-- 空间内AI绘图标识 -->
            <a-tag v-if="isInSpaceMode" color="blue">
              <template #icon>
                <AppstoreOutlined />
              </template>
              空间内AI绘图
            </a-tag>
          </div>
        </div>

        <!-- 聊天消息区域 -->
        <ChatArea />

        <!-- 输入框区域 -->
        <ChatInput :spaceId="createSpaceId ?? undefined" />
      </a-layout-content>
    </a-layout>
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAiChatStore } from '@/stores/useAiChatStore'
import ConversationSidebar from '@/components/AIGeneratePicture/ConversationSidebar.vue'
import ChatArea from '@/components/AIGeneratePicture/ChatArea.vue'
import ChatInput from '@/components/AIGeneratePicture/ChatInput.vue'
import { AppstoreOutlined } from '@ant-design/icons-vue'

const route = useRoute()
const store = useAiChatStore()

const createSpaceId = computed(() => store.createSpaceId)
const isInSpaceMode = computed(() => store.isInSpaceMode)

onMounted(async () => {
  // 从路由参数初始化
  const sessionId = route.query.sessionId ? String(route.query.sessionId) : undefined
  const pictureId = route.query.pictureId ? Number(route.query.pictureId) : undefined
  const spaceId = route.query.spaceId ? Number(route.query.spaceId) : undefined

  await store.initFromRoute({ sessionId, pictureId, spaceId })
})

// 监听路由变化
watch(
  () => route.query,
  async (newQuery) => {
    const sessionId = newQuery.sessionId ? String(newQuery.sessionId) : undefined
    const pictureId = newQuery.pictureId ? Number(newQuery.pictureId) : undefined
    const spaceId = newQuery.spaceId ? Number(newQuery.spaceId) : undefined

    // 更新createSpaceId（如果从路由带spaceId进入）
    if (spaceId) {
      store.createSpaceId = spaceId
    }

    // 加载会话
    if (sessionId && sessionId !== store.currentSessionId) {
      await store.loadSessionDetail(sessionId)
    } else if (!sessionId && store.currentSessionId) {
      // 清空会话（新建对话）
      store.newConversation()
    }

    // 加载图片
    if (pictureId) {
      await store.loadPictureById(pictureId)
    }
  },
  { deep: true }
)
</script>

<style scoped>
.ai-generate-page {
  height: calc(100vh - 64px);
  background: #f5f5f5;
}

.page-layout {
  height: 100%;
}

.sidebar {
  height: 100%;
  overflow: hidden;
}

.main-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  background: white;
  border-bottom: 1px solid #eee;
}

.header-left h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
