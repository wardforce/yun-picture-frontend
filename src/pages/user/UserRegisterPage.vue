<template>
  <h2 class="title">狐仙云图库-用户注册</h2>
  <div class="desc">
    企业级智能协同云图库
  </div>
  <div id="userRegisterPage">
    <a-form :model="formState" name="basic" autocomplete="off" @finish="handleSubmit" @finishFailed="onFinishFailed">
      <a-form-item name="userAccount" :rules="[{ required: true, message: '请输入用户名!' }]">
        <a-input v-model:value="formState.userAccount" placeholder="请输入用户名" />
      </a-form-item>

      <a-form-item name="userPassword"
        :rules="[{ required: true, message: '请输入密码!' }, { min: 8, message: '密码长度不能小于8位' }]">
        <a-input-password v-model:value="formState.userPassword" placeholder="请输入密码" />
      </a-form-item>
      <a-form-item name="checkPassword"
        :rules="[{ required: true, message: '请输入确认密码!' }, { min: 8, message: '确认密码长度不能小于8位' }]">
        <a-input-password v-model:value="formState.checkPassword" placeholder="请输入确认密码" />
      </a-form-item>
      <div class="tips">
        已有账号？
        <router-link to="/user/login">去登录</router-link>
      </div>
      <a-form-item :wrapper-col="{ span: 24 }">
        <a-button type="primary" html-type="submit" style="width: 100%;">注册</a-button>
      </a-form-item>

    </a-form>
  </div>
</template>
<script lang="ts" setup>
import { reactive } from 'vue';
import { userRegister } from '@/api/UserController';
import { message } from 'ant-design-vue';
import router from '@/router';

const formState = reactive<API.UserRegisterRequest>({
  userAccount: '',
  userPassword: '',
  checkPassword: ''
});

const handleSubmit = async (values: any) => {
  if (values.userPassword !== values.checkPassword) {
    message.error('两次输入的密码不一致');
    return;
  }
  const res = await userRegister(values);
  if (res.data.code === 0 && res.data.data) {
    message.success('注册成功');
    router.push({
      path: "/user/login",
      replace: true
    });
  } else {
    message.error('注册失败' + res.data.message);
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

#userRegisterPage {
  max-width: 360px;
  margin: 0 auto;
}

.tips {
  font-size: 13px;
  margin: 16px;
  text-align: right;
}
</style>
