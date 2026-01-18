<template>
  <div class="update-password">
    <a-radio-group v-model:value="mode" button-style="solid" class="mode-switch">
      <a-radio-button value="password">通过旧密码修改</a-radio-button>
      <a-radio-button value="email">通过邮箱验证码</a-radio-button>
    </a-radio-group>

    <!-- 方式一：通过旧密码修改 -->
    <a-form
      v-if="mode === 'password'"
      :model="passwordForm"
      layout="vertical"
      @finish="handlePasswordSubmit"
      class="password-form"
    >
      <a-form-item
        label="旧密码"
        name="userOldPassword"
        :rules="[{ required: true, message: '请输入旧密码' }]"
      >
        <a-input-password
          v-model:value="passwordForm.userOldPassword"
          placeholder="请输入旧密码"
        />
      </a-form-item>
      <a-form-item
        label="新密码"
        name="userNewPassword"
        :rules="[
          { required: true, message: '请输入新密码' },
          { min: 8, message: '密码长度不能小于8位' },
        ]"
      >
        <a-input-password
          v-model:value="passwordForm.userNewPassword"
          placeholder="请输入新密码（至少8位）"
        />
      </a-form-item>
      <a-form-item
        label="确认密码"
        name="checkPassword"
        :rules="[
          { required: true, message: '请输入确认密码' },
          { min: 8, message: '密码长度不能小于8位' },
        ]"
      >
        <a-input-password
          v-model:value="passwordForm.checkPassword"
          placeholder="请再次输入新密码"
        />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit" :loading="loading" block>
          提交修改
        </a-button>
      </a-form-item>
    </a-form>

    <!-- 方式二：通过邮箱验证码 -->
    <a-form
      v-else
      :model="emailForm"
      layout="vertical"
      @finish="handleEmailSubmit"
      class="password-form"
    >
      <a-form-item
        label="邮箱"
        name="email"
        :rules="[
          { required: true, message: '请输入邮箱' },
          { type: 'email', message: '请输入有效的邮箱地址' },
        ]"
      >
        <a-input
          v-model:value="emailForm.email"
          placeholder="请输入绑定的邮箱"
        />
      </a-form-item>
      <a-form-item
        label="验证码"
        name="code"
        :rules="[{ required: true, message: '请输入验证码' }]"
      >
        <a-input-group compact>
          <a-input
            v-model:value="emailForm.code"
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
      <a-form-item
        label="新密码"
        name="newPassword"
        :rules="[
          { required: true, message: '请输入新密码' },
          { min: 8, message: '密码长度不能小于8位' },
        ]"
      >
        <a-input-password
          v-model:value="emailForm.newPassword"
          placeholder="请输入新密码（至少8位）"
        />
      </a-form-item>
      <a-form-item
        label="确认密码"
        name="checkPassword"
        :rules="[
          { required: true, message: '请输入确认密码' },
          { min: 8, message: '密码长度不能小于8位' },
        ]"
      >
        <a-input-password
          v-model:value="emailForm.checkPassword"
          placeholder="请再次输入新密码"
        />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit" :loading="loading" block>
          提交修改
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { message } from 'ant-design-vue'
import {
  updateUserPassword,
  sendEmailCode,
  emailResetPassword,
} from '@/api/UserController'

const mode = ref<'password' | 'email'>('password')
const loading = ref(false)
const sendingCode = ref(false)
const countdown = ref(0)

const passwordForm = reactive<API.UserUpdatePasswordRequest>({
  userOldPassword: '',
  userNewPassword: '',
  checkPassword: '',
})

const emailForm = reactive<API.EmailResetPasswordRequest>({
  email: '',
  code: '',
  newPassword: '',
  checkPassword: '',
})

const handlePasswordSubmit = async () => {
  if (passwordForm.userNewPassword !== passwordForm.checkPassword) {
    message.error('两次输入的密码不一致')
    return
  }
  loading.value = true
  try {
    const res = await updateUserPassword(passwordForm)
    if (res.data.code === 0) {
      message.success('密码修改成功')
      passwordForm.userOldPassword = ''
      passwordForm.userNewPassword = ''
      passwordForm.checkPassword = ''
    } else {
      message.error('修改失败：' + res.data.message)
    }
  } finally {
    loading.value = false
  }
}

const handleSendCode = async () => {
  if (!emailForm.email) {
    message.error('请先输入邮箱')
    return
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(emailForm.email)) {
    message.error('请输入有效的邮箱地址')
    return
  }
  sendingCode.value = true
  try {
    const res = await sendEmailCode({
      email: emailForm.email,
      codeType: 'RESET_PASSWORD',
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

const handleEmailSubmit = async () => {
  if (emailForm.newPassword !== emailForm.checkPassword) {
    message.error('两次输入的密码不一致')
    return
  }
  loading.value = true
  try {
    const res = await emailResetPassword(emailForm)
    if (res.data.code === 0) {
      message.success('密码重置成功')
      emailForm.email = ''
      emailForm.code = ''
      emailForm.newPassword = ''
      emailForm.checkPassword = ''
    } else {
      message.error('重置失败：' + res.data.message)
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.update-password {
  padding: 16px 0;
  max-width: 400px;
  margin: 0 auto;
}

.mode-switch {
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
}

.password-form {
  margin-top: 16px;
}
</style>
