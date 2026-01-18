<template>
  <h2 class="title">狐仙云图库-用户登录</h2>
  <div class="desc">
    企业级智能协同云图库
  </div>
  <div id="userLoginPage">
    <a-form :model="formState" name="basic" autocomplete="off" @finish="handleSubmit" @finishFailed="onFinishFailed">
      <a-form-item name="userAccount" :rules="[{ required: true, message: '请输入用户名!' }]">
        <a-input v-model:value="formState.userAccount" placeholder="请输入用户名" />
      </a-form-item>

      <a-form-item name="userPassword"
        :rules="[{ required: true, message: '请输入密码!' }, { min: 8, message: '密码长度不能小于8位' }]">
        <a-input-password v-model:value="formState.userPassword" placeholder="请输入密码" />
      </a-form-item>
      <div class="tips">
        <router-link to="/user/email-login" class="email-login">邮箱登录</router-link>
        <span>没有账号？<router-link to="/user/register">去注册</router-link></span>
      </div>
      <a-form-item :wrapper-col="{ span: 24 }">
        <a-button type="primary" html-type="submit" style="width: 100%;">登录</a-button>
      </a-form-item>

    </a-form>
  </div>
</template>
<script lang="ts" setup>
import { reactive } from 'vue';
import { userLogin } from '@/api/UserController';
import { useLoginUserStore } from '@/stores/useLoginUserStore';
import { message } from 'ant-design-vue';
import router from '@/router';

const formState = reactive<API.UserLoginRequest>({
  userAccount: '',
  userPassword: ''
});
const loginUserStore = useLoginUserStore();
const handleSubmit = async (values: any) => {
  const res = await userLogin(values);
  if (res.data.code === 0 && res.data.data) {
    await loginUserStore.fetchLoginUser();
    message.success('登录成功');
    router.push({
      path: "/",
      replace: true
    });
  } else {
    message.error('登录失败' + res.data.message);
  }

};

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo);
};
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

#userLoginPage {
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

.email-login {
  color: #1890ff;
}
</style>
