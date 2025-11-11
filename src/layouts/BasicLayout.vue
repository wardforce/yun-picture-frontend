<template>
  <div id="basic-layout">
    <a-layout style="min-height: 100vh;">
      <a-layout-header class="header">
        <GlobalHeader />
      </a-layout-header>
      <a-layout-content class="content">
        <router-view />
      </a-layout-content>
      <a-layout-footer class="footer">
        <a href="https://github.com/wardbit">狐仙云图 by WARDBIT</a>
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped>
#basic-layout :deep(.ant-layout-header),
#basic-layout :deep(.header) {
  padding-inline: 20px;
  background: white;
  margin-bottom: 16px;

}

#basic-layout :deep(.ant-layout-content),
#basic-layout :deep(.content) {
  padding: 20px;
}

#basic-layout :deep(.ant-layout-footer),
#basic-layout :deep(.footer) {
  text-align: center;
  background: #efefef;
  padding: 16px;
}
</style>
