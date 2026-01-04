<template>
  <div>
    <a-modal v-model:visible="visible" title="分享图片" @cancel="closeModal" :footer="false">
      <h4>复制分享链接</h4>
      <a-typography-link copyable>
        {{ props.link }}
      </a-typography-link>
      <div style="margin-bottom: 16px;"></div>
      <h4>用户扫码查看</h4>
      <a-qrcode :value="props.link" />
    </a-modal>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const visible = ref<boolean>(false)
interface Props {
  link: string;
}
const props = withDefaults(defineProps<Props>(), {
  link: 'https://github.com/wardbit'
})
const openModal = () => {
  visible.value = true;
};
const closeModal = () => {
  visible.value = false;
};
defineExpose({
  openModal,
  closeModal
})
</script>
