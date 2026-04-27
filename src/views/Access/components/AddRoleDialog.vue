<template>
  <ElDrawer v-model="drawerShow" title="角色" :before-close="() => close(false)">
    <div class="drawer-box">
      <ElTabs v-model="curTabs" @tab-click="handleClick">
        <el-tab-pane label="基础信息" name="role">
          <ElForm
            :model="ruleForm"
            :rules="rules"
            ref="ruleFormRef"
            label-position="right"
            label-width="80px"
          >
            <el-row :gutter="30">
              <el-col :span="14">
                <el-form-item label="角色名称" prop="name">
                  <el-input
                    v-model="ruleForm.name"
                    class="h-[30px] text-12px"
                    placeholder="请输入角色名称"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="30">
              <el-col :span="14">
                <el-col :span="5">
                  <el-form-item label="角色编码" class="w-50" prop="code">
                    <el-input v-model="ruleForm.code" placeholder="输入角色编码" />
                  </el-form-item>
                </el-col>
              </el-col>
            </el-row>
            <el-row :gutter="30">
              <el-col :span="14">
                <el-form-item label="排序">
                  <el-input
                    v-model="ruleForm.seq"
                    class="h-[30px] text-12px"
                    placeholder="排序序号"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="30">
              <el-col :span="10">
                <el-form-item label="角色状态">
                  <el-switch
                    v-model="ruleForm.status"
                    inline-prompt
                    active-text="开启"
                    inactive-text="禁用"
                  ></el-switch>
                </el-form-item>
              </el-col>
            </el-row>
          </ElForm>
        </el-tab-pane>
        <el-tab-pane label="分配权限" name="auth">
          <ElCard class="" shadow="never">
            <el-row :gutter="20">
              <el-col :span="24">
                <ElTree
                  ref="treeRef"
                  :data="menuList"
                  show-checkbox
                  :default-expand-all="true"
                  node-key="id"
                  highlight-current
                  :props="defaultProps"
                  :check-strictly="isCheck"
                  v-model="checkedKeyValue"
                />
              </el-col>
            </el-row>
          </ElCard>
        </el-tab-pane>
      </ElTabs>
    </div>
    <template #footer>
      <div>
        <el-button class="ml-4" size="large" type="primary" @click="add">确认</el-button>
        <el-button class="ml-4" size="large" plain type="primary" @click="cancel">取消</el-button>
      </div>
    </template>
  </ElDrawer>
</template>

<script setup lang="ts">
import { ElDrawer, ElMessage, ElTabs, ElTree, TabsPaneContext } from 'element-plus'
import { ref, reactive, watch, nextTick } from 'vue'
import { roleCreate, roleUpdate } from '../service'

const props = defineProps({
  isType: {
    type: Number,
    default: 1
  },
  dialogVisible: {
    type: Boolean,
    default: false
  },
  // 菜单列表
  menuData: {
    type: Array,
    default: []
  },
  // 当前角色
  curRole: {
    type: Object,
    default: {}
  },
  // 当前角色权限
  curRoleAccess: {
    type: Array,
    default: []
  },
})
const emit = defineEmits(['close'])

const drawerShow = ref<boolean>(false)

const curTabs = ref<string>('role')

const ruleForm = reactive({
  id: '',
  name: '',
  remark: '',
  seq: '',
  code: '',
  orgId: '',
  status: true
})

const menuList = ref<any>([])

// 默认键值
const defaultProps = {
  children: 'children',
  label: 'name'
}
// 树组件的ref
const treeRef = ref()
// form组件ref
const ruleFormRef = ref()
// 选中的树
const checkedKeyValue = ref([] as number[])
const isCheck = ref(false)

watch(
  () => props.menuData,
  (newVal) => {
    if (newVal) {
      menuList.value = newVal
    }
  },
  { immediate: true, deep: true }
)

watch(
  () => props.dialogVisible,
  (newVal, _) => {
    drawerShow.value = newVal
    if (!newVal) {
      clearForm()
    }
    nextTick(() => {
      treeRef.value.setCheckedKeys([])
    })
  }
)

// 赋值权限
watch([() => props.curRoleAccess, () => props.isType, () => props.curRole], (newData: any, _) => {
  if (newData[1] == 2) {
    isCheck.value = true
    ruleForm.id = newData[2].id
    ruleForm.orgId = newData[2].orgId
    ruleForm.name = newData[2].name
    ruleForm.status = newData[2].status
    ruleForm.seq = newData[2].seq
    ruleForm.code = newData[2].code
    const checkedKeys: number[] = []
    menuList.value = []
    props.menuData.forEach((item: any) => {
      if (ruleForm.orgId == '1' && item.path == 'platform') {
        menuList.value.push(item)
      }
      if (ruleForm.orgId !== '1' && item.path !== 'platform') {
        menuList.value.push(item)
      }
    })

    newData[0].forEach((menuId) => {
      const node = findNodeById(props.menuData, menuId)

      if (node) {
        node.setChecked(true, false)
        checkedKeys.push(node.data.id)
      }
    })
    checkedKeyValue.value = checkedKeys
    // newData[0].forEach(item => {
    //     if (treeRef.value.getNode(item) && (!treeRef.value.getNode(item).childNodes || !treeRef.value.getNode(item).childNodes.length)) {
    //         checkedKeys.value.push(item)
    //     }
    // })
    // nextTick(()=>{
    //     treeRef.value.setChecked(checkedKeys.value,true,false)
    //     isCheck.value = false
    // })
  } else {
    console.log(newData)
  }
})

const rules = reactive({
  name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }],
  code: [{ required: true, message: '角色编码不能为空', trigger: 'blur' }],
  orgId: [{ required: true, message: '商户不能为空', trigger: 'blur' }]
})

// tabs页面
const handleClick = (tab: TabsPaneContext) => {
  if (props.isType === 2 && tab.index == '1') {
    if (checkedKeyValue.value.length > 0) {
      checkedKeyValue.value.forEach((value) => {
        treeRef.value.setChecked(value, true, false)
      })
    } else {
      treeRef.value.setCheckedKeys([])
    }
  }
}
// 递归查找节点
const findNodeById = (nodes, id) => {
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i]
    if (node.id === id) {
      return treeRef.value.getNode(node.id)
    }
    if (node.children && node.children.length > 0) {
      const result = findNodeById(node.children, id)
      if (result) {
        return result
      }
    }
  }
  return null
}
// 回显处理
// const checked=(id,data,newArr)=>{
//     data.forEach(item => {
//         if(item.id == id){
//             if(item.children.length == 0 ){
//                 newArr.push(item.id)
//             }
//         }else{
//             if( item.children.length !=0 ){
//                 checked(id,item.children,newArr)
//             }
//         }
//     });
// }

const close = (flag: boolean) => {
  emit('close', flag)
  curTabs.value = 'role'
}
const add = async () => {
  try {
    let listF = treeRef.value.getHalfCheckedKeys()
    let listC = treeRef.value.getCheckedKeys()
    checkedKeyValue.value = listF.concat(listC)
    // treeRef.value.getCheckedKeys()
    let data: any = {
      status: ruleForm.status,
      seq: ruleForm.seq,
      name: ruleForm.name,
      code: ruleForm.code,
      menuIdList: checkedKeyValue.value,
      orgId: ruleForm.orgId
    }

    let roleApi
    if (props.isType != 1) {
      Object.assign(data, {
        id: props.curRole.id
      })
      roleApi = roleUpdate
    } else {
      roleApi = roleCreate
    }
    ruleFormRef.value.validate(async (vali) => {
      if (!vali) {
        ElMessage({
          message: '必填内容不能为空',
          type: 'error'
        })
      } else {
        const ret = await roleApi(data)
        if (ret.success) {
          ElMessage.success('操作成功')
          close(true)
        }
      }
    })
  } catch (e) {}
}
// 清空
const clearForm = () => {
  ruleForm.code = ''
  ruleForm.seq = ''
  ruleForm.name = ''
  ruleForm.orgId = ''
}
// 取消
const cancel = () => {
  emit('close')
  curTabs.value = 'role'
}
</script>
