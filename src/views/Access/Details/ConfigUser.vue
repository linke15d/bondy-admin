<template>
  <div>
    <splitpanes style="min-height: calc(100vh - 150px)">
      <pane min-size="15" max-size="20" size="15" style="height: 100%">
        <ElCard class="" shadow="never" :body-style="{ height: '100%' }">
          <h2 class="pl-20px pr-20px">角色列表</h2>
          <el-divider />
          <div class="max-h-270 overflow-y-auto">
            <div class="cell">
              <div
                class="flex mb-10px"
                v-for="item in roleListData"
                :key="`item-${item.id}`"
                v-show="item.status"
              >
                <el-button
                  class="flex-1 leading-10"
                  :type="item.id == curRoleId ? 'primary' : ''"
                  size="large"
                  :text="true"
                  :bg="item.id == curRoleId ?? true"
                  @click="handlerItem(item)"
                >
                  {{ item.name }}
                </el-button>
              </div>
            </div>
          </div>
        </ElCard>
      </pane>
      <pane>
        <ElCard class="" shadow="never">
          <template #header>
            <div class="card-header flex justify-between">
              <span>角色『{{ curRole?.name }}』的授权用户列表</span>
              <div class="right-btn">
                <el-button
                  class="button"
                  :icon="Plus"
                  type="primary"
                  size="default"
                  @click="handlerAuthUser"
                >
                  分配授权用户
                </el-button>
                <el-button class="button" :icon="Delete" plain size="default" @click="batchAuth">
                  批量解除授权
                </el-button>
              </div>
            </div>
          </template>
          <ElTable
            :data="userListData"
            ref="multipleTable"
            style="width: 100%"
            @selection-change="selectionLineChangeHandler"
          >
            <ElTableColumn type="selection" />
            <ElTableColumn prop="username" label="用户名" align="center" />
            <ElTableColumn prop="orgName" label="商户" align="center" />
            <ElTableColumn prop="status" label="状态" align="center">
              <template #default="header">
                <el-tag :type="header.row.status ? 'success' : 'warning'">
                  {{ header.row.status ? '启用' : '禁用' }}
                </el-tag>
              </template>
            </ElTableColumn>
            <ElTableColumn label="操作" align="center">
              <template #default="scope">
                <el-popconfirm
                  confirm-button-text="确定"
                  cancel-button-text="取消"
                  icon-color="#626AEF"
                  title="您确定操作么?"
                  @confirm="confirmEvent(scope.row)"
                >
                  <template #reference>
                    <ElButton size="small" type="warning">解除授权</ElButton>
                  </template>
                </el-popconfirm>
              </template>
            </ElTableColumn>
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
        </ElCard>
      </pane>
    </splitpanes>
    <ConfigUserDialog
      :drawerShow="show"
      :curRole="curRole"
      :notJoinedListData="notJoinedListData"
      @close="handlerClose"
    />
  </div>
</template>

<script lang="ts" setup>
import { Splitpanes, Pane } from 'splitpanes'
import { Plus, Delete } from '@element-plus/icons-vue'
import 'splitpanes/dist/splitpanes.css'
import { roleList, roleUserList, saveRoleUser } from '../service'
import { onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import ConfigUserDialog from '../components/ConfigUserDialog.vue'
interface RoleProps {
  code: string
  createTime: string
  id: number
  name: string
  seq: number
  status: boolean
  updateTime: string
}
const form = reactive({
  username: '',
  status: '',
  pageNum: 0,
  pageSize: 10
})
// 路由元信息
const { query } = useRoute()
// 角色列表
const roleListData = ref<Array<RoleProps>>([] as RoleProps[])
// 已加入用户列表
const userListData: any = ref([])
//未加入用户列表
const notJoinedListData: any = ref([])
// 当前角色ID
const curRoleId = ref<any>(0)
const curRole = ref<RoleProps>({} as RoleProps)
// 用户ID
const userId = ref<any>([])
// 表格ref
const multipleTable = ref<any>(null)
// 显示分配信息
const show = ref<boolean>(false)
const totalPage = ref(0)

// 页码控制
const handleSizeChange = (val: number) => {
  form.pageSize = val
  getRoleUserList(curRoleId.value)
}
const handleCurrentChange = (val: number) => {
  form.pageNum = val - 1
  getRoleUserList(curRoleId.value)
}

onMounted(() => {
  if (query.id) {
    const num = query.id as string
    curRoleId.value = num
    getRoleList()
    getRoleUserList(curRoleId.value)
  }
})
// 批量解除授权
const batchAuth = async () => {
  let arr: any = []
  let idArr = userId.value
  for (let i = 0; i < idArr.length; i++) {
    let id = idArr[i].id as string
    arr.push({
      id,
      checked: false
    })
  }
  if (!arr.length) {
    ElMessage({
      message: '暂无选择用户',
      type: 'warning'
    })
    return
  }
  ElMessageBox.confirm('您确定执行此操作吗?', 'Warning', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      let data = {
        id: curRole.value.id,
        userList: arr
      }
      const ret = await saveRoleUser(data)
      if (ret.success) {
        ElMessage({
          message: '操作成功',
          type: 'success'
        })
        getRoleUserList(curRoleId.value)
      }
    })
    .catch(() => {
      console.log('取消')
    })
}
// 选择当前角色
const handlerItem = (item: RoleProps) => {
  userListData.value = []
  notJoinedListData.value = []
  curRoleId.value = item.id
  getRoleUserList(item.id)
  curRole.value = item
}
// 获取角色列表
const getRoleList = async () => {
  try {
    const params = Object.assign({}, form)
    for (const i in params) {
      if (params[i] === '') {
        delete params[i]
      }
    }

    const ret = await roleList(params)
    if (ret.success) {
      roleListData.value = ret.data.list
      if (!curRole.value.id) {
        curRole.value = ret.data.list.filter((item) => item.id === curRoleId.value)[0]
      }
    }
  } catch (e) {}
}
// 根据角色获取用户
const getRoleUserList = async (id: number) => {
  try {
    const params = {
      id,
      pageNum: form.pageNum,
      pageSize: form.pageSize,
      checked: true
    }
    const res = await roleUserList(params)
    if (res.success) {
      userListData.value = res.data.list
      totalPage.value = res.data.totalCount
    }
  } catch (e) {}
}

const selectionLineChangeHandler = (val) => {
  userId.value = val
}

const handlerAuthUser = async () => {
  show.value = true
}
// 单个解除授权
const confirmEvent = async (item) => {
  let data = {
    id: curRole.value.id,
    userList: [
      {
        id: item.id,
        checked: false
      }
    ]
  }
  const ret = await saveRoleUser(data)
  if (ret.success) {
    ElMessage({
      message: '操作成功',
      type: 'success'
    })
    getRoleUserList(curRoleId.value)
  }
}

// 关闭
const handlerClose = (bool: boolean) => {
  if (bool) {
    setTimeout(() => {
      getRoleUserList(curRoleId.value)
    }, 1000)
  }
  show.value = false
}
</script>
