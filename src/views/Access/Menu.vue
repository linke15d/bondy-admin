<template>
  <div class="menu-box">
    <ElCard class="box-card mb-5">
      <ElButton
        type="primary"
        class="mb-2"
        size="small"
        @click="addMenu"
        :disabled="!getCurrentAuth.Add"
      >
        新增菜单
      </ElButton>
      <ElTable
        :data="userInfoList"
        style="width: 100%; margin-bottom: 20px"
        row-key="id"
        size="small"
        border
      >
        <ElTableColumn prop="name" label="菜单名称" />
        <ElTableColumn prop="path" label="路由地址">
          <template #default="header">
            <p>{{ header.row.path ? header.row.path : '-' }}</p>
          </template>
        </ElTableColumn>
        <ElTableColumn prop="component" label="组件路径">
          <template #default="header">
            <p>{{ header.row.component ? header.row.component : '-' }}</p>
          </template>
        </ElTableColumn>
        <ElTableColumn prop="perms" label="权限标识" width="150">
          <template #default="header">
            <p>{{ header.row.perms ? header.row.perms : '-' }}</p>
          </template>
        </ElTableColumn>
        <ElTableColumn prop="seq" label="排序" width="60" align="center" />
        <ElTableColumn label="类型" width="80" align="center">
          <template #default="header">
            <ElTag class="ml-2" :type="menuType[header.row.menuType]">
              {{ menuType.getLabel(header.row.menuType) }}
            </ElTag>
          </template>
        </ElTableColumn>
        <ElTableColumn label="外链" width="80" align="center">
          <template #default="header">
            <ElTag class="ml-2" :type="header.row.isFrame ? 'success' : 'warning'">
              {{ header.row.isFrame ? '是' : '否' }}
            </ElTag>
          </template>
        </ElTableColumn>
        <ElTableColumn label="缓存" width="80" align="center">
          <template #default="header">
            <ElTag class="ml-2" :type="header.row.isCache ? 'success' : 'warning'">
              {{ header.row.isCache ? '是' : '否' }}
            </ElTag>
          </template>
        </ElTableColumn>
        <ElTableColumn prop="status" label="状态" width="80" align="center">
          <template #default="header">
            <ElTag class="ml-2" :type="header.row.status ? 'success' : 'warning'">
              {{ header.row.status ? '启用' : '禁用' }}
            </ElTag>
          </template>
        </ElTableColumn>
        <ElTableColumn prop="visible" label="是否显示" width="100" align="center">
          <template #default="header">
            <ElTag class="ml-2" :type="header.row.visible ? 'success' : 'warning'">
              {{ header.row.visible ? '是' : '否' }}
            </ElTag>
          </template>
        </ElTableColumn>
        <ElTableColumn label="操作" fixed="right" align="center" width="140">
          <template #default="scope">
            <el-button
              type="warning"
              @click="editMenu(scope.row)"
              size="small"
              :disabled="!getCurrentAuth.Edit"
            >
              编辑
            </el-button>
            <el-popconfirm
              confirm-button-text="是"
              cancel-button-text="否"
              icon-color="#626AEF"
              title="确定删除该条记录?"
              @confirm="confirmEvent(scope.row)"
              @cancel="cancelEvent"
            >
              <template #reference>
                <el-button type="danger" size="small" :disabled="!getCurrentAuth.Delete">
                  删除
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </ElTableColumn>
      </ElTable>
    </ElCard>
    <AddMenuDialog
      :visible="visible"
      :boxType="boxType"
      :curMenu="curMenu"
      :menuList="userInfoList"
      :sysType="sysType"
      @drawerClose="drawerClose"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { createEnumObject } from 'ts-enum-object'
import { menuList, deleteMenu } from './service'
import * as AddMenuDialogView from './components/AddMenuDialog.vue'

const AddMenuDialogTemplate: any = AddMenuDialogView
const AddMenuDialog = AddMenuDialogTemplate.default

import userStore from '@/store/modules/user'
interface MenuProps {
  id: number
  name: string
  seq: number | null
  path: string | null
  component: string | null
  query: string | null
  isFrame: boolean
  isCache: boolean
  menuType: string
  visible: boolean
  status: boolean
  perms: string | null
  icon: string | null
  children: string[] | null
}

// 显示新增弹窗
const visible = ref<boolean>(false)
// 数据列表
const userInfoList = ref<MenuProps[]>([])
// 弹窗类型
const boxType = ref<string>('add')
// 获取用户store
const userStores = userStore()
// 类型枚举
const menuType = createEnumObject([
  { name: 'M', value: '', label: '目录' },
  { name: 'C', value: 'success', label: '菜单' },
  { name: 'F', value: 'warning', label: '按钮' }
] as const)
// 当前菜单
const curMenu = ref<MenuProps>({} as MenuProps)

const sysType = ref('PLATFORM')

// 取当前权限隐藏或显示按钮
const getCurrentAuth = computed(() => userStores.$state.currAccess)

onMounted(() => {
  getMenuList()
})

// 获取菜单列表
const getMenuList = async () => {
  try {
    const ret = await menuList({})
    if (ret.success) {
      userInfoList.value = ret.data.list
    }
  } catch (e) {}
}
// 新增菜单
const addMenu = () => {
  curMenu.value = {} as MenuProps
  boxType.value = 'add'
  visible.value = true
}
// 编辑菜单
const editMenu = (item: MenuProps) => {
  curMenu.value = item
  boxType.value = 'edit'
  visible.value = true
}
// 确定删除
const confirmEvent = async (item: MenuProps) => {
  try {
    const ret = await deleteMenu({ id: item.id })
    if (ret.success) {
      setTimeout(() => {
        getMenuList()
      }, 100)
    }
  } catch (e) {}
}
// 取消删除
const cancelEvent = () => {}

//

const drawerClose = (flag: boolean) => {
  if (flag) {
    setTimeout(() => {
      getMenuList()
    }, 1000)
  }
  visible.value = false
}
</script>
