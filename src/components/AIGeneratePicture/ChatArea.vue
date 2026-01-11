<template>
  <div class="chat-area" ref="chatAreaRef">
    <!-- 空消息欢迎页 -->
    <div v-if="messages.length === 0 && !isLoadingMessages" class="welcome-area">
      <div class="welcome-content">
        <div class="welcome-icon">✨</div>
        <h2>AI图片生成</h2>
        <p>上传图片并描述你的想法，AI将为你生成新图片</p>
      </div>
    </div>

    <!-- 加载更多 -->
    <div v-if="messagePagination.hasMore" class="load-more">
      <a-button type="link" @click="loadMoreMessages" :loading="isLoadingMessages">
        加载更早的消息
      </a-button>
    </div>

    <!-- 消息列表 -->
    <div class="messages-container">
      <div v-for="msg in messages" :key="msg.id"
        :class="['message-item', msg.placement === 'end' ? 'message-user' : 'message-ai']">
        <!-- 头像 -->
        <div class="message-avatar">
          <a-avatar v-if="msg.type === 'user'" :size="36">
            <a-avatar v-if="loginUserStore.loginUser.userAvatar" :src="loginUserStore.loginUser.userAvatar"
              size="large"><template #icon>
                <AntDesignOutlined />
              </template></a-avatar>
            <a-avatar v-else size="large"><template #icon>
                {{ loginUserStore.loginUser.userName?.[0] ?? 'momo' }}
                <AntDesignOutlined />
              </template></a-avatar>
          </a-avatar>
          <a-avatar v-else :size="36" style="background-color: #1890ff">
            <template #icon>
              <RobotOutlined />
            </template>
          </a-avatar>
        </div>

        <!-- 消息内容 -->
        <div class="message-content">
          <!-- 图片Grid -->
          <div v-if="msg.pictures.length > 0" class="pictures-grid">
            <div v-for="pic in msg.pictures" :key="pic.id" class="picture-wrapper">
              <img :src="pic.url" :data-fallback="pic.thumbnailUrl" :alt="pic.type" @error="handleImageError"
                @click="previewImage(pic.pictureId)" />
              <span class="picture-badge" :class="pic.type">
                {{ pic.type?.toLowerCase() === 'input' ? '参考图' : '生成图' }}
              </span>
            </div>
          </div>

          <!-- 文字内容 -->
          <div v-if="msg.content" class="message-text" v-html="renderMarkdown(msg.content)"></div>

          <!-- 时间戳 -->
          <div class="message-footer">
            <div class="message-time">{{ formatTime(msg.createTime) }}</div>
            <a-dropdown :trigger="['click']">
              <DashOutlined class="action-icon" />
              <template #overlay>
                <a-menu>
                  <a-menu-item key="delete" danger @click="handleDeleteMessage(msg.id)">
                    <DeleteOutlined /> 删除
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </div>
        </div>
      </div>

      <!-- 正在生成加载态 -->
      <div v-if="isGenerating" class="message-item message-ai">
        <div class="message-avatar">
          <a-avatar :size="36" style="background-color: #1890ff">
            <template #icon>
              <RobotOutlined />
            </template>
          </a-avatar>
        </div>
        <div class="message-content">
          <div class="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </div>

    <!-- 图片预览 -->
    <a-image :style="{ display: 'none' }" :preview="{
      visible: previewVisible,
      onVisibleChange: (vis: boolean) => (previewVisible = vis),
    }" :src="previewUrl" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, watch } from 'vue'
import { useAiChatStore, type ChatMessageVM } from '@/stores/useAiChatStore'
import { UserOutlined, RobotOutlined, DashOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import { renderMarkdown } from '@/utils/markdown'
import { Modal, message } from 'ant-design-vue'
import dayjs from 'dayjs'
import { useLoginUserStore } from '@/stores/useLoginUserStore'
import router from '@/router'
const loginUserStore = useLoginUserStore()

loginUserStore.loginUser
const store = useAiChatStore()
const chatAreaRef = ref<HTMLElement | null>(null)

const messages = computed(() => store.messages)
const messagePagination = computed(() => store.messagePagination)
const isLoadingMessages = computed(() => store.isLoadingMessages)
const isGenerating = computed(() => store.isGenerating)

// 图片预览
const previewVisible = ref(false)
const previewUrl = ref('')

function previewImage(id: number) {
  router.push({ path: `/picture/${id}` })
}

// 加载更多消息
async function loadMoreMessages() {
  if (store.currentSessionId) {
    await store.loadSessionDetail(store.currentSessionId, store.messagePagination.current + 1)
  }
}

// 图片加载失败降级处理
function handleImageError(event: Event) {
  const img = event.target as HTMLImageElement
  const fallback = img.dataset.fallback

  if (fallback && img.src !== fallback) {
    console.warn('主图加载失败，降级到缩略图:', img.src)
    img.src = fallback
  } else {
    console.error('图片加载完全失败')
    img.src = '/placeholder.png'
  }
}

// 格式化时间
function formatTime(dateStr: string): string {
  if (!dateStr) return ''
  const date = dayjs(dateStr)
  const now = dayjs()

  if (date.isSame(now, 'day')) {
    return date.format('HH:mm')
  } else if (date.isSame(now, 'year')) {
    return date.format('MM-DD HH:mm')
  } else {
    return date.format('YYYY-MM-DD HH:mm')
  }
}

// 删除消息
function handleDeleteMessage(id: number) {
  Modal.confirm({
    title: '确认删除',
    content: '确定要删除这条消息吗？',
    okText: '确定',
    cancelText: '取消',
    okType: 'danger',
    onOk: async () => {
      await store.deleteMessage(id)
      message.success('删除成功')
    }
  })
}

// 自动滚动到底部
watch(
  () => messages.value.length,
  () => {
    nextTick(() => {
      if (chatAreaRef.value) {
        chatAreaRef.value.scrollTop = chatAreaRef.value.scrollHeight
      }
    })
  },
)
</script>

<style scoped>
.chat-area {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: #f5f5f5;
}

.welcome-area {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.welcome-content {
  text-align: center;
  color: #666;
}

.welcome-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.welcome-content h2 {
  margin-bottom: 8px;
  color: #333;
}

.load-more {
  text-align: center;
  margin-bottom: 16px;
}

.messages-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.message-item {
  display: flex;
  gap: 12px;
  max-width: 80%;
}

.message-user {
  flex-direction: row-reverse;
  align-self: flex-end;
}

.message-ai {
  align-self: flex-start;
}

.message-avatar {
  flex-shrink: 0;
}

.message-content {
  background: white;
  border-radius: 12px;
  padding: 12px 16px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.message-user .message-content {
  background: #1890ff;
  color: white;
}

.pictures-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 8px;
  margin-bottom: 8px;
}

.picture-wrapper {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
}

.picture-wrapper img {
  width: 100%;
  height: 150px;
  object-fit: cover;
  transition: transform 0.2s;
}

.picture-wrapper:hover img {
  transform: scale(1.05);
}

.picture-badge {
  position: absolute;
  top: 4px;
  right: 4px;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 10px;
  color: white;
}

.picture-badge.input {
  background: rgba(255, 152, 0, 0.9);
}

.picture-badge.output {
  background: rgba(76, 175, 80, 0.9);
}

.message-text {
  word-break: break-word;
  line-height: 1.6;
}

/* Markdown 渲染样式 */
.message-text :deep(p) {
  margin: 0 0 8px 0;
}

.message-text :deep(p:last-child) {
  margin-bottom: 0;
}

.message-text :deep(code) {
  background: rgba(0, 0, 0, 0.06);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Consolas', monospace;
  font-size: 0.9em;
}

.message-text :deep(pre) {
  background: #f6f8fa;
  padding: 12px;
  border-radius: 6px;
  overflow-x: auto;
  margin: 8px 0;
}

.message-text :deep(pre code) {
  background: none;
  padding: 0;
}

.message-text :deep(ul),
.message-text :deep(ol) {
  margin: 8px 0;
  padding-left: 20px;
}

.message-text :deep(blockquote) {
  border-left: 3px solid #ddd;
  margin: 8px 0;
  padding-left: 12px;
  color: #666;
}

.message-text :deep(a) {
  color: #1890ff;
}

/* 用户消息中的样式覆盖 */
.message-user .message-text :deep(code) {
  background: rgba(255, 255, 255, 0.2);
}

.message-user .message-text :deep(pre) {
  background: rgba(255, 255, 255, 0.15);
}

.message-user .message-text :deep(a) {
  color: #fff;
  text-decoration: underline;
}

.message-user .message-text :deep(blockquote) {
  border-left-color: rgba(255, 255, 255, 0.5);
  color: rgba(255, 255, 255, 0.85);
}

.message-time {
  font-size: 11px;
  color: #999;
}

.message-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 4px;
}

.action-icon {
  cursor: pointer;
  color: #999;
  font-size: 14px;
  padding: 2px;
  opacity: 0;
  transition: opacity 0.2s, color 0.2s;
}

.message-content:hover .action-icon {
  opacity: 1;
}

.action-icon:hover {
  color: #1890ff;
}

.message-user .message-time {
  color: rgba(255, 255, 255, 0.7);
}

.message-user .action-icon {
  color: rgba(255, 255, 255, 0.7);
}

.message-user .action-icon:hover {
  color: #fff;
}

/* 加载动画 */
.loading-dots {
  display: flex;
  gap: 4px;
}

.loading-dots span {
  width: 8px;
  height: 8px;
  background: #1890ff;
  border-radius: 50%;
  animation: bounce 1.4s infinite ease-in-out both;
}

.loading-dots span:nth-child(1) {
  animation-delay: -0.32s;
}

.loading-dots span:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes bounce {

  0%,
  80%,
  100% {
    transform: scale(0);
  }

  40% {
    transform: scale(1);
  }
}
</style>
