import { getLoginUser } from '@/api/userController'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLoginUserStore = defineStore('loginUser', () => {
  const loginUser = ref<API.LoginUserVO>({
    userName: '游客',
  })
  /**
   * 获取登录用户信息
   */
  async function fetchLoginUser() {
    const res = await getLoginUser()
    if (res.data.code === 0 && res.data.data) {
      loginUser.value = res.data.data
    }
    // //测试用户登录
    // setTimeout(() => {
    //   loginUser.value = {
    //     id: 1,
    //     userName: '测试用户',
    //   }
    // }, 3000)
  }

  function setLoginUser(newLoginUser: any) {
    loginUser.value = newLoginUser
  }

  return { loginUser, setLoginUser, fetchLoginUser }
})
