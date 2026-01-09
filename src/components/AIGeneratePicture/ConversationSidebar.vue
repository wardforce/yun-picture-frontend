<template>
    <div class="conversation-sidebar">
        <!-- 新建对话按钮 -->
        <a-button type="primary" block class="new-chat-btn" @click="handleNewChat">
            <template #icon>
                <PlusOutlined />
            </template>
            新建对话
        </a-button>

        <!-- 会话列表 -->
        <div class="session-list">
            <a-spin :spinning="isLoadingSessionList">
                <div v-if="sessionList.length === 0" class="empty-sessions">
                    <a-empty description="暂无历史对话" :image="Empty.PRESENTED_IMAGE_SIMPLE" />
                </div>

                <div v-for="session in sessionList" :key="session.sessionId"
                    :class="['session-item', { active: session.sessionId === currentSessionId }]"
                    @click="handleSessionClick(session)" @contextmenu.prevent="handleContextMenu($event, session)">
                    <div class="session-title">
                        {{ truncateText(session.firstPrompt || '新对话', 30) }}
                    </div>
                    <div class="session-time">{{ formatTime(session.firstChatTime) }}</div>
                </div>
            </a-spin>
        </div>

        <!-- 右键菜单 -->
        <a-dropdown :open="contextMenuVisible" :trigger="[]">
            <template #overlay>
                <a-menu @click="handleMenuClick">
                    <a-menu-item key="delete" danger>
                        <template #icon>
                            <DeleteOutlined />
                        </template>
                        删除会话
                    </a-menu-item>
                </a-menu>
            </template>
            <div :style="{
                position: 'fixed',
                left: contextMenuPosition.x + 'px',
                top: contextMenuPosition.y + 'px'
            }" />
        </a-dropdown>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAiChatStore } from '@/stores/useAiChatStore'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import { Empty, Modal, message } from 'ant-design-vue'
import dayjs from 'dayjs'

const router = useRouter()
const store = useAiChatStore()

const sessionList = computed(() => store.sessionList)
const currentSessionId = computed(() => store.currentSessionId)
const isLoadingSessionList = computed(() => store.isLoadingSessionList)

// 右键菜单
const contextMenuVisible = ref(false)
const contextMenuPosition = ref({ x: 0, y: 0 })
const selectedSession = ref<API.ChatHistorySessionVO | null>(null)

function handleNewChat() {
    store.newConversation()
    router.push({ path: '/ai/generate' })
}

function handleSessionClick(session: API.ChatHistorySessionVO) {
    router.push({
        path: '/ai/generate',
        query: { sessionId: session.sessionId }
    })
}

function handleContextMenu(e: MouseEvent, session: API.ChatHistorySessionVO) {
    contextMenuPosition.value = { x: e.clientX, y: e.clientY }
    selectedSession.value = session
    contextMenuVisible.value = true
}

function handleMenuClick({ key }: { key: string }) {
    contextMenuVisible.value = false

    if (key === 'delete' && selectedSession.value?.sessionId) {
        Modal.confirm({
            title: '确认删除',
            content: '删除后将无法恢复，确定要删除这个会话吗？',
            okText: '确定',
            cancelText: '取消',
            okType: 'danger',
            onOk: async () => {
                if (selectedSession.value?.sessionId) {
                    await store.deleteSession(selectedSession.value.sessionId)
                    message.success('删除成功')
                }
            }
        })
    }
}

// 点击其他地方关闭右键菜单
function closeContextMenu() {
    contextMenuVisible.value = false
}

function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength) + '...'
}

function formatTime(dateStr?: string): string {
    if (!dateStr) return ''
    const date = dayjs(dateStr)
    const now = dayjs()

    if (date.isSame(now, 'day')) {
        return '今天 ' + date.format('HH:mm')
    } else if (date.isSame(now.subtract(1, 'day'), 'day')) {
        return '昨天'
    } else if (date.isSame(now, 'year')) {
        return date.format('MM-DD')
    } else {
        return date.format('YYYY-MM-DD')
    }
}

onMounted(() => {
    document.addEventListener('click', closeContextMenu)
})

onUnmounted(() => {
    document.removeEventListener('click', closeContextMenu)
})
</script>

<style scoped>
.conversation-sidebar {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: #fafafa;
    border-right: 1px solid #eee;
}

.new-chat-btn {
    margin: 16px;
    border-radius: 8px;
}

.session-list {
    flex: 1;
    overflow-y: auto;
    padding: 0 8px;
}

.empty-sessions {
    padding: 40px 0;
}

.session-item {
    padding: 12px;
    border-radius: 8px;
    cursor: pointer;
    margin-bottom: 4px;
    transition: background 0.2s;
}

.session-item:hover {
    background: #f0f0f0;
}

.session-item.active {
    background: #e6f7ff;
    border-left: 3px solid #1890ff;
}

.session-title {
    font-size: 14px;
    color: #333;
    margin-bottom: 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.session-time {
    font-size: 12px;
    color: #999;
}
</style>
