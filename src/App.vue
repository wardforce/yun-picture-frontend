<script setup lang="ts">
// import { health } from './api/mainController'
import BasicLayout from './layouts/BasicLayout.vue'
// import { useLoginUserStore } from './stores/useLoginUserStore'
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
dayjs.locale('zh-cn');

const appLocale = zhCN; // 设置当前应用的语言环境
// health().then((res) => {
//   console.log(res)
// })
// const loginUserStore = useLoginUserStore()
// loginUserStore.fetchLoginUser()
// loginUserStore.loginUser
</script>

<template>
  <a-config-provider :locale=appLocale>
    <div id="app">
      <BasicLayout />

    </div>
  </a-config-provider>
</template>

<style scoped></style>
