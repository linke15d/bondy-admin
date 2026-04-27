<template>
  <ElDrawer
    v-model="drawerShow"
    :title="`选择待分配『角色：${curRole?.name}』权限的用户`"
    :size="'55%'"
    :before-close="() => close(false)"
  >
    <div class="drawer-box">
      <el-form :model="form" size="small">
        <el-row :gutter="30">
          <el-col :span="5">
            <el-form-item label="用户名">
              <el-input v-model="username" placeholder="输入用户名" />
            </el-form-item>
          </el-col>

          <el-col :span="4">
            <el-form-item label="状态">
              <el-select v-model="form.status">
                <el-option label="全部" value="" />
                <el-option label="启用" :value="true" />
                <el-option label="禁用" :value="false" />
              </el-select>
            </el-form-item>
          </el-col>

          <!-- <el-col :span="4">
                <el-form-item label="角色">
                    <el-select v-model="form.role">
                        <el-option label="全部" :value="0" />
                        <el-option label="管理员" :value="1" />
                        <el-option label="超级管理员" :value="2" />
                        <el-option label="运营、财务" :value="3" />
                        <el-option label="运营" :value="4" />
                    </el-select>
                </el-form-item>
            </el-col> -->

          <!-- <el-col :span="7">
                <el-form-item label="注册时间">
                    <el-date-picker v-model="value1" type="daterange" range-separator="至" :clearable="false"
                        start-placeholder="开始日期" end-placeholder="结束日期" value-format="YYYY-MM-DD"
                        format="YYYY-MM-DD" :disabled-date="pickerStartDisable" @change="getDatePicker" />
                </el-form-item>
            </el-col> -->
        </el-row>
        <el-form-item>
          <ElButton type="primary" size="small" @click="onSearch">搜索</ElButton>
          <ElButton @click="onReset" size="small">重置</ElButton>
        </el-form-item>
      </el-form>
      <ElTable
        ref="multipleTableRef"
        :data="tableData"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <ElTableColumn type="selection" />
        <ElTableColumn prop="username" label="用户名" align="center" />
        <ElTableColumn prop="orgName" label="商户" align="center" />
        <ElTableColumn prop="status" label="状态" align="center">
          <template #default="header">
            <el-tag class="ml-2" :type="stateFun(header.row.status).type">
              {{ stateFun(header.row.status).text }}
            </el-tag>
          </template>
        </ElTableColumn>
        <ElTableColumn prop="createTime" label="创建时间" align="center" />
      </ElTable>
      <div class="mt-20px flex flex-row justify-center">
        <el-pagination
          :current-page="form.pageNum + 1"
          v-model:page-size="form.pageSize"
          small
          :page-sizes="[10, 20, 50, 100]"
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalPage"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
    <template #footer>
      <div>
        <el-button class="ml-4" size="large" type="primary" @click="confirm">确认</el-button>
        <el-button class="ml-4" size="large" plain type="primary" @click="cancel">取消</el-button>
      </div>
    </template>
  </ElDrawer>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { ElDrawer, ElMessageBox, ElMessage } from 'element-plus'
import { saveRoleUser, roleUserList } from '../service'

const props = defineProps({
  // 用户权限
  drawerShow: {
    type: Boolean,
    default: false
  },
  // 角色id
  curRole: {
    type: Object
  }
})

const drawerShow = ref<boolean>(false)

// 表格数据
const tableData = ref([])
// 日期
const value1 = ref([])
// 用户数据
const userArr = ref<any>([])
// 总页数
const totalPage = ref(0)
// 用户名
const username = ref<String>('')
// 截流
const boolFLag = ref<boolean>(true)
// 获取用户列表参数
const form = reactive<any>({
  id: '',
  userName: '',
  status: true,
  checked: false,
  pageNum: 0,
  pageSize: 10
})

watch(
  () => props.curRole,
  (val) => {
    if (val) form.id = val.id
  },
  { immediate: true, deep: true }
)

// 暴露回调方法
const emits = defineEmits(['close'])

watch(
  () => props.drawerShow,
  (newVal, _) => {
    drawerShow.value = newVal
    if (newVal) {
      userList()
    }
  }
)

// 选择用户
const handleSelectionChange = (val) => {
  userArr.value = val
}
// 获取用户
const userList = async () => {
  try {
    const params = Object.assign({}, form)
    for (const i in params) {
      if (params[i] === '') {
        delete params[i]
      }
    }

    const ret = await roleUserList(params)
    if (ret.success) {
      tableData.value = ret.data.list
      totalPage.value = ret.data.totalCount
    }
  } catch (e) {}
}
// 页码控制
const handleSizeChange = (val: number) => {
  form.pageSize = val
  userList()
}
const handleCurrentChange = (val: number) => {
  form.pageNum = val - 1
  userList()
}

// 状态
const stateFun = (type: boolean) => {
  switch (type) {
    case true:
      return {
        type: 'success',
        text: '正常'
      }
    default:
      return {
        type: 'danger',
        text: '禁用'
      }
  }
}
// 确认
const confirm = () => {
  let arr: any = []
  let idArr = userArr.value
  for (let i = 0; i < idArr.length; i++) {
    let id = idArr[i].id as number
    arr.push({
      id,
      checked: true
    })
  }
  if (!arr.length) {
    ElMessage({
      message: '暂无选择用户',
      type: 'warning'
    })
    return
  }
  ElMessageBox.confirm('您确定执行此操作吗?', '警告', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      let data = {
        id: props.curRole?.id as number,
        userList: arr
      }
      const ret = await saveRoleUser(data)
      if (ret.success) {
        ElMessage({
          message: '操作成功',
          type: 'success'
        })
        close(true)
      }
    })
    .catch(() => {
      console.log('取消')
    })
}
// 搜索
const onSearch = () => {
  if (boolFLag.value) {
    boolFLag.value = false
    userList()
    setTimeout(() => {
      boolFLag.value = true
    }, 1000)
  }
}
// 重置
const onReset = () => {
  form.pageNum = 0
  form.pageSize = 10
  form.userName = ''
  form.email = ''
  form.status = ''
  username.value = ''
  value1.value = []
  onSearch()
}
// 关闭
const close = (bool: boolean) => {
  emits('close', bool)
}
const cancel = () => {
  close(false)
}
</script>
