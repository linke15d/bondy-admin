<script setup lang="ts">
import { reactive, ref, watch, onMounted } from 'vue'
import { Form } from '@/components/Form'
import { ElButton, ElInput, ElMessage } from 'element-plus'
import { usePermissionStore } from '@/store/modules/permission'
import { useRouter } from 'vue-router'
import type { RouteLocationNormalizedLoaded, RouteRecordRaw } from 'vue-router'
import { FormSchema } from '@/types/form'
import Cookies from 'js-cookie'
import { encrypt, decrypt } from '@/utils/jsencrypt.util'
import { setToken } from '@/utils/auth.util'
import userInfoStore from '@/store/modules/user'
import { login } from '../service'

const userStore = userInfoStore()
const permissionStore = usePermissionStore()
const { currentRoute, addRoute, push } = useRouter()

const loginForm: any = ref({
  username: '',
  password: '',
  remember: false
})

const schema = reactive<FormSchema[]>([
  {
    field: 'title',
    colProps: {
      span: 24
    }
  },
  {
    field: 'username',
    label: '',
    colProps: {
      span: 24
    }
  },
  {
    field: 'password',
    label: '',
    colProps: {
      span: 24
    }
  },
  {
    field: 'vcode',
    label: '',
    colProps: {
      span: 24
    }
  },
  {
    field: 'tool',
    colProps: {
      span: 24
    }
  },
  {
    field: 'login',
    colProps: {
      span: 24
    }
  },
  {
    field: 'otherIcon',
    colProps: {
      span: 24
    }
  }
])

const loading = ref<boolean>(false)

const redirect = ref<string>('')

// 谷歌验证弹窗
// const verifyModal = ref()

watch(
  () => currentRoute.value,
  (route: RouteLocationNormalizedLoaded) => {
    redirect.value = route?.query?.redirect as string
  },
  {
    immediate: true
  }
)

//记住密码
const getCookie = () => {
  const username = Cookies.get('username')
  const password = Cookies.get('password')
  const remember = Cookies.get('remember')
  loginForm.value = {
    username: username === undefined ? loginForm.value.username : username,
    password: password === undefined ? loginForm.value.password : decrypt(password),
    remember: remember === undefined ? false : Boolean(remember)
  }
}

// 登录
const signIn = async () => {
  if (loginForm.value.remember) {
    Cookies.set('username', loginForm.value.username, { expires: 30 })
    Cookies.set('password', encrypt(loginForm.value.password), {
      expires: 30
    })
    Cookies.set('remember', loginForm.value.remember, {
      expires: 30
    })
  } else {
    Cookies.remove('username')
    Cookies.remove('password')
    Cookies.remove('remember')
  }

  try {
    if (!loginForm.value.username) {
      ElMessage.error('请输入用户名')
      return
    }
    if (!loginForm.value.password) {
      ElMessage.error('请输入密码')
      return
    }

    const params = {
      username: loginForm.value.username,
      password: loginForm.value.password,
    }

    const res = await login(params)
    if (res.code === 0) {
      ElMessage({
        message: '登录成功',
        type: 'success'
      })
      setToken(res.data.access_token)
      userStore.setUserInfo(res.data)
      await permissionStore.generateRoutes('admin').catch(() => { })
      permissionStore.getAddRouters.forEach((route) => {
        addRoute(route as RouteRecordRaw) // 动态添加可访问路由表
      })
      permissionStore.setIsAddRouters(true)
      push('/dashboard/analysis')
    }
  } catch (error: any) {
    console.log(error)
  }
}

// 按回车
const onSubmitKeyup = (e) => {
  if (e.keyCode === 13) {
    signIn()
  }
}

onMounted(() => {
  getCookie()
})
</script>

<template>
  <div class="w-109.5 max-w-[100vw] bg-white h-132 p-7 _form">
    <div class="pt-2 pb-4.5 border-b border-[#ECEDEF]">
      <p class="text-xl font-medium"> 欢迎登陆<span class="text-[#007AFF]">Bondy</span>后台管理系统 </p>
    </div>
    <Form :schema="schema" label-position="top" hide-required-asterisk size="large">
      <template #username>
        <div class="w-full">
          <ElInput v-model="loginForm.username" placeholder="请输入用户名">
            <template #prefix>
              <img src="../../../assets/imgs/user.png" class="w-5 h-5" />
            </template>
          </ElInput>
        </div>
      </template>

      <template #password>
        <div class="w-full">
          <ElInput v-model="loginForm.password" type="password" show-password placeholder="请输入密码"
            v-on:keyup.enter.native="onSubmitKeyup">
            <template #prefix>
              <img src="../../../assets/imgs/password.png" class="w-5 h-5" />
            </template>
          </ElInput>
        </div>
      </template>

      <template #tool>
        <div class="flex justify-between items-center w-[100%]">
          <ElCheckbox v-model="loginForm.remember" label="记住我" />
        </div>
      </template>

      <template #login>
        <div class="w-[100%]">
          <ElButton :loading="loading" type="primary" class="w-[100%] !h-12.5" @click="signIn()">
            登录
          </ElButton>
        </div>
        <div class="w-[100%] mt-15px"></div>
      </template>

      <template #otherIcon>
        <div class="flex justify-between w-[100%]"></div>
      </template>
    </Form>
  </div>
</template>

<style lang="less" scoped>
:deep(.anticon) {
  &:hover {
    color: var(--el-color-primary) !important;
  }
}
</style>

<style>
._form {
  .el-col {
    padding: 0 !important;
  }

  .el-input__wrapper {
    height: 48px;
    background-color: #ecedef;
  }
}
</style>
