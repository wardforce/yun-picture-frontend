<template>
    <div class="chat-input">
        <!-- 待发送图片预览 -->
        <div v-if="pendingPictures.length > 0" class="pending-images">
            <div v-for="pic in pendingPictures" :key="pic.id" class="pending-image-item">
                <img :src="pic.thumbnailUrl || pic.url" :alt="pic.name" />
                <a-button class="remove-btn" type="text" size="small" danger @click="removePicture(pic.id!)">
                    <template #icon>
                        <CloseOutlined />
                    </template>
                </a-button>
            </div>
        </div>

        <!-- 输入区域 -->
        <div class="input-area">
            <a-button type="text" class="upload-btn" @click="showUploadModal = true">
                <template #icon>
                    <PlusOutlined />
                </template>
            </a-button>

            <a-textarea v-model:value="inputText" :placeholder="placeholder" :auto-size="{ minRows: 1, maxRows: 4 }"
                :disabled="isGenerating" @press-enter="handleEnter" />

            <a-button type="primary" :loading="isGenerating" :disabled="!canSend" @click="handleSend" class="send-btn">
                <template #icon>
                    <SendOutlined />
                </template>
            </a-button>
        </div>

        <!-- 图片上传Modal -->
        <a-modal v-model:open="showUploadModal" title="上传图片" :footer="null" :width="400">
            <ImageUploadPanel :spaceId="spaceId" @upload-success="handleUploadSuccess" />
        </a-modal>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAiChatStore } from '@/stores/useAiChatStore'
import { PlusOutlined, SendOutlined, CloseOutlined } from '@ant-design/icons-vue'
import ImageUploadPanel from './ImageUploadPanel.vue'

interface Props {
    spaceId?: number
}

const props = defineProps<Props>()

const store = useAiChatStore()

const inputText = ref('')
const showUploadModal = ref(false)

const pendingPictures = computed(() => store.pendingPictures)
const isGenerating = computed(() => store.isGenerating)

const placeholder = computed(() => {
    if (pendingPictures.value.length > 0) {
        return '描述你想要的效果...'
    }
    return '输入文字或上传图片开始对话...'
})

const canSend = computed(() => {
    return inputText.value.trim() || pendingPictures.value.length > 0
})

function handleEnter(e: KeyboardEvent) {
    // Shift+Enter换行，Enter发送
    if (!e.shiftKey) {
        e.preventDefault()
        handleSend()
    }
}

async function handleSend() {
    if (!canSend.value || isGenerating.value) return

    const text = inputText.value.trim()
    inputText.value = ''

    await store.sendMessage(text)
}

function handleUploadSuccess(picture: API.PictureVO) {
    store.addPendingPicture(picture)
    showUploadModal.value = false
}

function removePicture(pictureId: number) {
    store.removePendingPicture(pictureId)
}
</script>

<style scoped>
.chat-input {
    background: white;
    border-top: 1px solid #eee;
    padding: 12px 16px;
}

.pending-images {
    display: flex;
    gap: 8px;
    margin-bottom: 12px;
    flex-wrap: wrap;
}

.pending-image-item {
    position: relative;
    width: 60px;
    height: 60px;
    border-radius: 8px;
    overflow: hidden;
}

.pending-image-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.pending-image-item .remove-btn {
    position: absolute;
    top: 2px;
    right: 2px;
    background: rgba(0, 0, 0, 0.5);
    color: white;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
}

.pending-image-item .remove-btn:hover {
    background: rgba(255, 0, 0, 0.8);
}

.input-area {
    display: flex;
    align-items: flex-end;
    gap: 8px;
}

.upload-btn {
    flex-shrink: 0;
    width: 40px;
    height: 40px;
}

.input-area :deep(.ant-input) {
    flex: 1;
    border-radius: 20px;
    padding: 8px 16px;
    resize: none;
}

.send-btn {
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
