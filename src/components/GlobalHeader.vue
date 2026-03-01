<template>
  <!-- 顶部通栏容器，作为全局头部 -->
  <div id="global-header">
    <!-- 使用 Ant Design Vue 的栅格系统：Row + Col 分成三块 -->
    <a-row :wrap="false">
      <!-- 左侧：LOGO 与标题 -->
      <a-col flex="200px">
        <!-- 使用 vue-router 的 RouterLink 跳转到首页 -->
        <router-link to="/">
          <div class="title-bar">
            <!-- LOGO 图片，@ 别名由 vite.config.ts 的 alias 指向 src -->
            <img class="logo" src="@/assets/logo.png" alt="logo" />
            <div class="title">狐仙云图</div>
          </div>
        </router-link>
      </a-col>

      <!-- 中间：水平菜单 -->
      <a-col flex="auto">
        <!--
          Ant Design Vue Menu 组件：
          - v-model:selectedKeys 双向绑定当前选中项（数组形式）
          - mode="horizontal" 指定水平模式
          - :items 传入菜单数据（见 script 部分 items）
          - @click 绑定点击事件（参数通常为 { key }）
        -->
        <a-menu v-model:selectedKeys="current" mode="horizontal" :items="items" @click="doMenuClick" />
      </a-col>

      <!-- 右侧：登录按钮（跳转到用户登录页面） -->
      <!-- 用户信息展示 -->
      <a-col flex="120px">
        <div class="user-login-status">
          <div v-if="loginUserStore.loginUser.id">
            <a-dropdown>
              <a-avatar v-if="loginUserStore.loginUser.userAvatar" :src="loginUserStore.loginUser.userAvatar"
                size="large"><template #icon>
                  <AntDesignOutlined />
                </template></a-avatar>
              <a-avatar v-else size="large"><template #icon>
                  {{ loginUserStore.loginUser.userName?.[0] ?? 'momo' }}
                  <AntDesignOutlined />
                </template></a-avatar>
              <template #overlay>
                <a-menu>
                  <a-menu-item>
                    <router-link to="/user/mainPage">
                      <UserOutlined />
                      个人中心
                    </router-link>
                  </a-menu-item>
                  <a-menu-item>
                    <HeartOutlined />
                    <a href="javascript:;">我的订阅</a>
                  </a-menu-item>
                  <a-menu-item>
                    <router-link to="/my_space">
                      <UserOutlined />
                      我的空间
                    </router-link>
                  </a-menu-item>
                  <a-menu-item>
                    <BellOutlined />
                    <a href="javascript:;">我的通知</a>
                  </a-menu-item>
                  <a-menu-item>
                    <ProjectOutlined />
                    <a href="javascript:;">我的项目</a>
                  </a-menu-item>
                  <a-menu-item>
                    <UsergroupAddOutlined />
                    <a href="javascript:;">我的团队</a>
                  </a-menu-item>
                  <a-menu-item @click="doLogout">
                    <LogoutOutlined />
                    <a href="javascript:;">退出登录</a>
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
            {{ loginUserStore.loginUser.userName ?? '游客' }}
          </div>
          <div v-else>
            <a-button type="primary" href="/user/login">登录/注册</a-button>
          </div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts" setup>
/**
 * 说明：
 * - 使用 <script setup> 简化组件书写。
 * - 这里用到了 Ant Design Vue 的图标与 Menu 类型、Vue Router 的 router。
 * - current 为选中菜单项 key 的数组，适配 Ant Menu 的 selectedKeys。
 */

import { computed, h, ref } from 'vue'
import {
  HomeOutlined,
  LogoutOutlined,
  UserOutlined,
  UsergroupAddOutlined,
  BellOutlined,
  ProjectOutlined,
  HeartOutlined,
} from '@ant-design/icons-vue'
import type { MenuProps } from 'ant-design-vue'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import { useLoginUserStore } from '../stores/useLoginUserStore'
import { AntDesignOutlined } from '@ant-design/icons-vue'
import { userLogout } from '../api/UserController'
import menu from 'ant-design-vue/es/menu'
const loginUserStore = useLoginUserStore()

loginUserStore.loginUser
/**
 * 当前选中的菜单项 keys
 * - AntD Menu 的 selectedKeys 是 string[]，此处用 ref<string[]>。
 * - 初始值为空数组，之后通过路由变化更新它。
 */
const current = ref<string[]>([])

/**
 * 路由实例：
 * - useRouter() 提供导航方法（push/replace 等）
 * - 注意：useRoute() 返回的是只读的当前路由对象，没有 push 方法。
 */
const router = useRouter()

/**
 * 菜单点击事件：
 * - AntD Menu 会传入形如 { key } 的对象，key 为 items 中定义的路径。
 * - 这里根据 key 做路由跳转。
 * - 提示：在 TS 下为避免隐式 any，可以显式标注类型：({ key }: { key: string })
 */
const doMenuClick = ({ key }: { key: string }) => {
  router.push({
    path: key,
  })
}

/**
 * 路由后置钩子：
 * - 在每次路由切换后更新 `current`，保证菜单高亮与当前路径一致。
 * - 典型签名为 (to, from) => void；此处多写了 next 参数也不影响运行，但并不需要。
 */
router.afterEach((to) => {
  current.value = [to.path]
})

/**
 * 菜单项数据：
 * - AntD Menu 支持通过 items 传入结构化的菜单配置。
 * - key 用作唯一标识，同时在这里用于路由路径。
 * - icon 使用函数返回 VNode：`icon: () => h(HomeOutlined)`
 * - 提示：在 TS 下 items 的类型可写为 `ref<MenuProps['items']>([ ... ])`；
 *   若启用了 verbatimModuleSyntax，`MenuProps` 需要使用 `import type` 进行仅类型导入。
 */
// const items = ref<MenuProps['items']>([)
const originItems = [
  {
    key: '/',
    icon: () => h(HomeOutlined),
    label: '主页',
    title: '主页',
  },
  {
    key: '/admin/userManage',
    label: '用户管理',
    title: '用户管理',
  },
  {
    key: '/add_picture',
    label: '创建图片',
    title: '创建图片',
  },
  {
    key: '/admin/pictureManage',
    label: '图片管理',
    title: '图片管理',
  },
  {
    key: '/admin/spaceManage',
    label: '空间管理',
    title: '空间管理',
  },
  {
    key: '/ai/generate',
    label: 'AI图片生成',
    title: 'AI图片生成',
  },
  {
    key: 'others',
    label: h('a', { href: 'https://github.com/wardbit', target: '_blank' }, 'GitHub'),
    title: '关于作者',
  },
]
// 统一过滤菜单：管理员权限 + AI功能登录要求
const filterMenus = (menus = [] as MenuProps['items']) => {
  return menus?.filter((menu) => {
    const key = menu?.key
    if (typeof key !== 'string') return true

    // 过滤管理员菜单
    if (key.startsWith('/admin') && loginUserStore.loginUser.userRole !== 'admin') {
      return false
    }
    // 过滤AI功能菜单（需要登录）
    if (key.startsWith('/ai') && !loginUserStore.loginUser.id) {
      return false
    }
    return true
  })
}

const items = computed(() => filterMenus(originItems))
/**
 * 用户退出
 */
const doLogout = async () => {
  try {
    const res = await userLogout()
    const { data } = res || {}
    if (data && data.code === 0) {
      loginUserStore.setLoginUser({
        userName: '游客',
      })
      message.success('退出成功')
      await router.push('/user/login')
    } else {
      message.error('退出失败' + (data?.message ?? '未知错误'))
    }
  } catch (e) {
    message.error('退出异常')
  }
}
</script>

<style scoped>
/**
 * 样式说明：
 * - 使用 scoped，样式默认只作用于当前组件模板。
 * - 标准 Flex 布局用于 logo 与标题的横向排列。
 */

.title-bar {
  display: flex;
  align-items: center;
}

.logo {
  width: 40px;
  height: 40px;
  margin-right: 10px;
}

.title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}
</style>
