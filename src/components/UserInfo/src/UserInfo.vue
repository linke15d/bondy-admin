<template>
  <ElDropdown :class="prefixCls" trigger="click">
    <div class="flex items-center pr-20px cursor-pointer">
      <img src="@/assets/imgs/avatar.jpg" alt="" class="w-[calc(var(--logo-height)-25px)] rounded-[50%]" />
      <span class="<lg:hidden text-14px pl-[5px] text-[var(--top-header-text-color)]">
        {{ !username ? '-' : username }}
      </span>
      <!-- <span class="<lg:hidden text-14px pl-[5px] text-[var(--top-header-text-color)]">{{ username }}</span> -->
    </div>
    <template #dropdown>
      <ElDropdownMenu>
        <ElDropdownItem>
          <el-popconfirm title="确定清除缓存？" @confirm="onClearCache">
            <template #reference>
              <div>清除缓存</div>
            </template>
          </el-popconfirm>
        </ElDropdownItem>
        <!-- <ElDropdownItem divided>
          <div @click="changePsd">修改密码</div>
        </ElDropdownItem> -->
        <ElDropdownItem divided>
          <div @click="loginOut">{{ t('common.loginOut') }}</div>
        </ElDropdownItem>
      </ElDropdownMenu>
    </template>
  </ElDropdown>

  <ElDialog v-model="dialogVisible" title="修改密码" center width="30%">
    <ElForm label-width="100px" label-position="left" ref="formRef" :rules="rules" :model="changeForm"
      style="max-width: 460px">
      <ElFormItem label="旧密码" prop="oldPassword">
        <ElInput v-model="changeForm.oldPassword" type="password" show-password placeholder="请输入旧密码" />
      </ElFormItem>
      <ElFormItem label="新密码" prop="newPassword">
        <ElInput v-model="changeForm.newPassword" type="password" show-password placeholder="请输入新密码" />
      </ElFormItem>
      <ElFormItem label="确认密码" prop="reNewPassword">
        <ElInput v-model="changeForm.reNewPassword" type="password" show-password placeholder="请确认新密码" />
      </ElFormItem>
      <ElFormItem>
        <div class="mt-10 flex justify-end w-[100%]">
          <ElButton @click="close">取消</ElButton>
          <ElButton type="primary" @click="submitForm(formRef)">提交</ElButton>
        </div>
      </ElFormItem>
    </ElForm>
  </ElDialog>

</template>

<script setup lang="ts">
import {
  ElDropdown,
  ElDropdownMenu,
  ElDropdownItem,
  ElDialog,
  ElForm,
  ElFormItem,
  ElInput,
  ElButton,
  ElMessage,
  ElMessageBox
} from 'element-plus'
import { onMounted, computed } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { resetRouter } from '@/router'
// import { useRouter } from 'vue-router'
import { useDesign } from '@/hooks/web/useDesign'
import { useTagsViewStore } from '@/store/modules/tagsView'
import { removeSession, clearStorage } from '@/utils/auth.util'
import { ref, reactive } from 'vue'
import type { FormRules } from 'element-plus'
import userInfoStore from '@/store/modules/user'
import { clearCache, accountUpdate } from '../service'

const tagsViewStore = useTagsViewStore()

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('user-info')

const { t } = useI18n()

const userStore = userInfoStore()

const username = computed(() => userStore.$state.user.username)

// const router = useRouter()

const dialogVisible = ref(false)

const formRef = ref()

onMounted(async () => {
  // const getInfo = getStorage('userInfo')
  // if (!getInfo) {
  //   const ret: IResp = await getUserInfo()
  //   if (ret.success) {
  //     userStore.setUserInfo(ret.data)
  //     setStorage('adminId', ret.data.user.uid)
  //   }
  // } else {
  //   const userInfo = JSON.parse(getInfo)
  //   userStore.setUserInfo(userInfo)
  // }
})

//清除缓存
const onClearCache = async () => {
  const res = await clearCache()
  if (res.code === 0) {
    ElMessage.success('缓存清除成功')
  }
}

const validatePass = (rule: any, value: any, callback: any) => {
  console.log(rule)
  if (value === '') {
    callback(new Error('请确认新密码'))
  } else if (value !== changeForm.value.newPassword) {
    callback(new Error('两次输入的密码不一致!'))
  } else {
    callback()
  }
}

const rules = reactive<FormRules>({
  oldPassword: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
  newPassword: [{ required: true, message: '请输入新密码', trigger: 'blur' }],
  reNewPassword: [{ required: true, validator: validatePass, trigger: 'blur' }]
})

const changeForm = ref({
  oldPassword: '',
  newPassword: '',
  reNewPassword: ''
})

//退登
const loginOut = () => {
  ElMessageBox.confirm(t('common.loginOutMessage'), t('common.reminder'), {
    confirmButtonText: t('common.ok'),
    cancelButtonText: t('common.cancel'),
    type: 'warning'
  })
    .then(() => {
      tagsViewStore.delAllViews()
      resetRouter() // 重置静态路由表
      clearStorage()
      removeSession('routeList')

      setTimeout(() => {
        window.location.reload()
      }, 200)
    })
    .catch(() => { })
}

//修改密码弹框
// const changePsd = () => {
//   dialogVisible.value = true
// }

//关闭弹窗
const close = () => {
  dialogVisible.value = false
  changeForm.value = {
    oldPassword: '',
    newPassword: '',
    reNewPassword: ''
  }
}

//提交修改密码
const submitForm = async (formEl) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      const params = {
        username: username.value,
        old_password: changeForm.value.oldPassword,
        password: changeForm.value.newPassword
      }
      accountUpdate(params).then((res) => {
        if (res.code === 0) {
          ElMessage({
            message: '修改成功,请重新登陆',
            type: 'success'
          })
          resetRouter() // 重置静态路由表
          clearStorage()
          removeSession('routeList')
          setTimeout(() => {
            window.location.reload()
          }, 200)
        }
      })
    } else {
      console.log('error submit!', fields)
    }
  })
}
</script>
