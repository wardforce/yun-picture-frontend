<template>
  <div class="avatar-url-upload">
    <a-input-group compact>
      <a-input v-model:value="url" style="width: calc(100% - 80px)" placeholder="请输入图片 URL" />
      <a-button type="primary" @click="handleSelect">确认</a-button>
    </a-input-group>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { message } from 'ant-design-vue'

const emit = defineEmits(['select'])
const url = ref('')

const handleSelect = () => {
  if (!url.value) {
    message.warning('请输入图片 URL')
    return
  }
  emit('select', url.value)
}
</script>
<style scoped>
.avatar-url-upload {
    margin-top: 16px;
}
</style>
