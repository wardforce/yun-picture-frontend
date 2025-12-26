<template>
  <div>
    <p>正在跳转，请稍后</p>
  </div>
</template>

<script lang="ts" setup>
import { listSpaceVoByPage } from '@/api/spaceController';
import { useLoginUserStore } from '@/stores/useLoginUserStore';
import { message } from 'ant-design-vue';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter()
const loginUserStore = useLoginUserStore();
const checkUserSpace = async () => {
  //验证登录用户
  const loginUser = loginUserStore.loginUser
  if (!loginUser?.id) {
    router.replace("/user/login")
    return
  }
  const res = await listSpaceVoByPage({
    userId: loginUser.id,
    current: 1,
    pageSize: 1
  })
  if (res.data.code === 0) {
    //如果有空间，进入第一个空间
    if (res.data.data?.records?.length > 0) {
      const space = res.data.data.records[0]
      router.replace(`/space/${space.id}`)
    } else {

      router.replace("/add_space")
      message.warn('请先创建空间')
    }
  } else {
    message.error("加载我的空间失败，" + res.data.message)
  }
}
onMounted(() => {
  checkUserSpace()
})
</script>


<style scoped></style>
