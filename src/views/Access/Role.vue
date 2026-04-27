<template>
  <div>
    <ElCard class="mb-5">
      <el-form :model="form" size="small" inline>
        <el-form-item label="角色名称" class="w-50">
          <el-input v-model.trim="form.name" placeholder="输入角色名称" />
        </el-form-item>
        <el-form-item label="状态" class="w-40">
          <el-select v-model="form.status">
            <el-option label="全部" value="" />
            <el-option label="启用" :value="true" />
            <el-option label="禁用" :value="false" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <ElButton type="primary" @click="onSubmit" size="small">搜索</ElButton>
          <ElButton size="small" @click="onReset">重置</ElButton>
        </el-form-item>
      </el-form>
    </ElCard>

    <el-row class="row-bg" justify="space-between">
      <el-col :span="24">
        <ElCard class="mb-5">
          <ElButton
            type="primary"
            class="mb-2"
            size="small"
            @click="addRole"
            :disabled="!getCurrentAuth.Add"
          >
            新增角色
          </ElButton>
          <ElTable :data="tableData" size="small" style="width: 100%">
            <ElTableColumn prop="name" label="角色">
              <template #default="header">
                <div class="roleName">
                  <p>{{ header.row.name }}</p>
                </div>
              </template>
            </ElTableColumn>
            <ElTableColumn prop="orgName" label="所属商户">
              <template #default="{ row }">
                <span>{{ row.orgName ? row.orgName : '--' }}</span>
              </template>
            </ElTableColumn>
            <ElTableColumn prop="status" label="状态">
              <template #default="header">
                <el-switch disabled size="small" v-model="header.row.status" />
              </template>
            </ElTableColumn>
            <!-- <ElTableColumn prop="remark" label="备注" /> -->
            <ElTableColumn label="操作" fixed="right" width="260" align="center">
              <template #default="scope">
                <el-button
                  type="primary"
                  size="small"
                  @click="edit(scope.row)"
                  :disabled="!getCurrentAuth.Edit"
                >
                  编辑
                </el-button>
                <el-button
                  :disabled="!getCurrentAuth.DisUser"
                  :type="scope.row.status ? 'warning' : 'info'"
                  size="small"
                  @click="toConfigUser(scope.row)"
                >
                  分配用户
                </el-button>
                <el-popconfirm
                  confirm-button-text="确定"
                  cancel-button-text="取消"
                  icon-color="#626AEF"
                  title="您确定要删除吗?"
                  @confirm="confirmEvent(scope.row)"
                >
                  <template #reference>
                    <el-button size="small" type="danger" :disabled="!getCurrentAuth.Delete">
                      删除
                    </el-button>
                  </template>
                </el-popconfirm>
              </template>
            </ElTableColumn>
          </ElTable>
        </ElCard>

        <ElCard class="">
          <el-pagination
            :current-page="form.pageNum + 1"
            v-model:page-size="form.pageSize"
            small
            :page-sizes="[10, 20, 50, 100]"
            background
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalPages"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </ElCard>
      </el-col>
    </el-row>
    <AddRoleDialog
      :isType="isType"
      :dialogVisible="dialogVisible"
      :menuData="menuData"
      :curRole="curRole"
      :curRoleAccess="curRoleAccess"
      @close="close"
    />
  </div>
</template>

<script lang="ts" setup>
import { ElButton, ElMessage } from 'element-plus'
import { reactive, ref, onMounted, computed } from 'vue'
import { roleList, roleIdDetail, removeRole } from './service'
import { menuList } from './service'
import AddRoleDialog from './components/AddRoleDialog.vue'
import userStore from '@/store/modules/user'
import { useRouter } from 'vue-router'

interface Tree {
  id: number
  label: string
  children?: Tree[]
}

interface RoleInfo {
  code: string
  createTime: string
  id: number
  name: string
  seq: number
  status: boolean
  updateTime: string
}

// 新增角色弹窗
const dialogVisible = ref(false)
// 角色列表
const tableData = ref([])
// 菜单列表
const menuData = ref<Array<Tree>>([] as Tree[])
// 当前角色
const curRole = ref<RoleInfo>({} as RoleInfo)
// 当前角色菜单
let curRoleAccess = ref<Array<number>>([] as number[])
// 是新增或修改 1新增，2修改
const isType = ref<number>(1)
// 总页数
const totalPages = ref(0)
// 路由
const { push } = useRouter()
// 搜索参数
const form = reactive({
  name: '',
  status: '',
  code: '',
  pageNum: 0,
  pageSize: 10
})
// 截流
const flag = ref<boolean>(true)
// 谷歌验证码信息
// const googleVerifyShow = ref<boolean>(false)
// const verifyInfo=ref<RoleSpace.GoogleKey>({} as RoleSpace.GoogleKey)
const userStores = userStore()

// 每页几条
const handleSizeChange = (val: number) => {
  form.pageSize = val
  getRoleItem()
}
const handleCurrentChange = (val: number) => {
  form.pageNum = val - 1
  getRoleItem()
}

// 初始化
onMounted(() => {
  getRoleItem()
  getMenuList()
})
// 取当前权限隐藏或显示按钮
const getCurrentAuth = computed(() => userStores.$state.currAccess)

// 角色列表
const getRoleItem = async () => {
  try {
    const params = Object.assign({}, form)

    for (const i in params) {
      if (params[i] === '') {
        delete params[i]
      }
    }

    const ret = await roleList(params)
    if (ret.success) {
      tableData.value = ret.data.list
      totalPages.value = ret.data.totalCount
    }
  } catch (e) {}
}

// 菜单列表
const getMenuList = async () => {
  try {
    const ret = await menuList({})
    if (ret.success) {
      menuData.value = ret.data.list
    }
  } catch (e) {}
}

// 显示权限
const edit = (item: RoleInfo) => {
  isType.value = 2
  dialogVisible.value = true
  curRole.value = item
  getCurRoleAuth(item.id)
}
// 确定删除
const confirmEvent = (item: RoleInfo) => {
  delRole(item)
}

// 删除角色
const delRole = async (item: RoleInfo) => {
  try {
    const ret = await removeRole({ id: item.id })
    if (ret.success) {
      ElMessage({
        message: '删除成功',
        type: 'success'
      })
      await getRoleItem()
    }
  } catch (e) {}
}

// 获取当前角色权限
const getCurRoleAuth = async (id: number) => {
  try {
    const ret = await roleIdDetail({ id })
    if (ret.success) {
      curRoleAccess.value = ret.data.menuIdList
    }
  } catch (e) {}
}

// 搜索
const onSubmit = () => {
  if (flag.value) {
    flag.value = false
    getRoleItem()
    setTimeout(() => {
      flag.value = true
    }, 1000)
  }
}
// 重置
const onReset = () => {
  form.name = ''
  form.status = ''
  form.pageNum = 0
  form.pageSize = 10
  getRoleItem()
}
// 添加角色
const addRole = () => {
  isType.value = 1
  dialogVisible.value = true
  curRoleAccess.value = []
}
// 分配用户
const toConfigUser = (item: RoleInfo) => {
  if (!item.status) {
    return
  }
  push({ path: '/access/role/configUser', query: { id: item.id } })
}
// 关闭
const close = (bool: boolean) => {
  if (bool) {
    getRoleItem()
  }
  dialogVisible.value = false
}
</script>
