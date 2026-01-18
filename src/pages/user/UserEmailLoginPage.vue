<template>
  <h2 class="title">狐仙云图库-邮箱登录</h2>
  <div class="desc">
    企业级智能协同云图库
  </div>
  <div id="userEmailLoginPage">
    <a-form :model="formState" name="emailLogin" autocomplete="off" @finish="handleSubmit">
      <a-form-item name="email" :rules="[
        { required: true, message: '请输入邮箱!' },
        { type: 'email', message: '请输入有效的邮箱地址' }
      ]">
        <a-input v-model:value="formState.email" placeholder="请输入邮箱" />
      </a-form-item>

      <a-form-item name="code" :rules="[{ required: true, message: '请输入验证码!' }]">
        <a-input-group compact>
          <a-input
            v-model:value="formState.code"
            placeholder="请输入验证码"
            style="width: calc(100% - 120px)"
          />
          <a-button
            type="primary"
            :disabled="countdown > 0"
            :loading="sendingCode"
            @click="handleSendCode"
          >
            {{ countdown > 0 ? `${countdown}s后重试` : '发送验证码' }}
          </a-button>
        </a-input-group>
      </a-form-item>

      <div class="tips">
        <router-link to="/user/login" class="account-login">账号密码登录</router-link>
        <span>没有账号？<router-link to="/user/register">去注册</router-link></span>
      </div>

      <a-form-item :wrapper-col="{ span: 24 }">
        <a-button type="primary" html-type="submit" :loading="loading" style="width: 100%;">登录</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { emailLogin, sendEmailCode } from '@/api/UserController'
import { useLoginUserStore } from '@/stores/useLoginUserStore'
import { message } from 'ant-design-vue'
import router from '@/router'

const formState = reactive<API.EmailLoginRequest>({
  email: '',
  code: ''
})

const loginUserStore = useLoginUserStore()
const loading = ref(false)
const sendingCode = ref(false)
const countdown = ref(0)

const handleSendCode = async () => {
  if (!formState.email) {
    message.error('请先输入邮箱')
    return
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(formState.email)) {
    message.error('请输入有效的邮箱地址')
    return
  }
  sendingCode.value = true
  try {
    const res = await sendEmailCode({
      email: formState.email,
      codeType: 'LOGIN'
    })
    if (res.data.code === 0) {
      message.success('验证码已发送，请查收邮箱')
      countdown.value = 60
      const timer = setInterval(() => {
        countdown.value--
        if (countdown.value <= 0) {
          clearInterval(timer)
        }
      }, 1000)
    } else {
      message.error('发送失败：' + res.data.message)
    }
  } finally {
    sendingCode.value = false
  }
}

const handleSubmit = async () => {
  loading.value = true
  try {
    const res = await emailLogin(formState)
    if (res.data.code === 0 && res.data.data) {
      await loginUserStore.fetchLoginUser()
      message.success('登录成功')
      router.push({
        path: '/',
        replace: true
      })
    } else {
      message.error('登录失败：' + res.data.message)
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.title {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 16px;
}

.desc {
  text-align: center;
  margin-bottom: 16px;
}

#userEmailLoginPage {
  max-width: 360px;
  margin: 0 auto;
}

.tips {
  font-size: 13px;
  margin: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.account-login {
  color: #1890ff;
}
</style>
