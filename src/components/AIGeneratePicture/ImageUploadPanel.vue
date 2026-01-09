<template>
    <a-tabs v-model:activeKey="activeTab" class="upload-panel">
        <a-tab-pane key="file" tab="文件上传">
            <a-upload list-type="picture-card" :custom-request="handleFileUpload" :before-upload="beforeUpload"
                :show-upload-list="false" class="upload-area">
                <div class="upload-placeholder">
                    <loading-outlined v-if="uploading" />
                    <plus-outlined v-else />
                    <div class="upload-text">{{ uploading ? '上传中...' : '点击上传' }}</div>
                </div>
            </a-upload>
        </a-tab-pane>

        <a-tab-pane key="url" tab="URL上传">
            <a-input v-model:value="imageUrl" placeholder="请输入图片URL" allow-clear @press-enter="handleUrlUpload" />
            <a-button type="primary" @click="handleUrlUpload" :loading="uploading"
                style="margin-top: 12px; width: 100%">
                确认上传
            </a-button>
        </a-tab-pane>
    </a-tabs>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { uploadPicture, uploadPictureByUrl } from '@/api/pictureController'
import { message } from 'ant-design-vue'
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue'

const emit = defineEmits<{
    uploadSuccess: [picture: API.PictureVO]
}>()

interface Props {
    spaceId?: number
}

const props = defineProps<Props>()

const activeTab = ref('file')
const imageUrl = ref('')
const uploading = ref(false)

async function handleFileUpload({ file }: any) {
    uploading.value = true
    try {
        const params: API.PictureUploadRequest = {}
        if (props.spaceId) {
            params.spaceId = props.spaceId
        }

        const res = await uploadPicture(params, {}, file)
        if (res.data.code === 0 && res.data.data) {
            message.success('上传成功')
            emit('uploadSuccess', res.data.data)
        } else {
            message.error('上传失败: ' + (res.data.message || '未知错误'))
        }
    } catch (error) {
        message.error('上传失败: ' + (error as Error).message)
    } finally {
        uploading.value = false
    }
}

async function handleUrlUpload() {
    if (!imageUrl.value.trim()) {
        message.warning('请输入图片URL')
        return
    }

    uploading.value = true
    try {
        const params: API.PictureUploadRequest = {
            fileUrl: imageUrl.value.trim()
        }
        if (props.spaceId) {
            params.spaceId = props.spaceId
        }

        const res = await uploadPictureByUrl({}, params)
        if (res.data.code === 0 && res.data.data) {
            message.success('上传成功')
            emit('uploadSuccess', res.data.data)
            imageUrl.value = ''
        } else {
            message.error('上传失败: ' + (res.data.message || '未知错误'))
        }
    } catch (error) {
        message.error('上传失败: ' + (error as Error).message)
    } finally {
        uploading.value = false
    }
}

function beforeUpload(file: File) {
    const isImage = file.type.startsWith('image/')
    if (!isImage) {
        message.error('只能上传图片文件')
        return false
    }

    const isLt10M = file.size / 1024 / 1024 < 10
    if (!isLt10M) {
        message.error('图片大小不能超过10MB')
        return false
    }

    return true
}
</script>

<style scoped>
.upload-panel {
    width: 100%;
}

.upload-area :deep(.ant-upload) {
    width: 100%;
    height: 120px;
}

.upload-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
}

.upload-placeholder .anticon {
    font-size: 32px;
    color: #999;
}

.upload-text {
    margin-top: 8px;
    color: #666;
}
</style>
