<template>
  <ElDrawer v-model="drawerShow" title="菜单" size="50%" :before-close="() => close(false)">
    <el-tabs v-model="ruleForm.menuType" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="根目录" name="M"></el-tab-pane>
      <el-tab-pane label="菜单" name="C"></el-tab-pane>
      <el-tab-pane label="按钮" name="F"></el-tab-pane>
    </el-tabs>
    <ElForm
      :model="ruleForm"
      :rules="rules"
      ref="formRef"
      label-position="right"
      label-width="80px"
    >
      <el-row :gutter="30">
        <el-col :span="11">
          <el-form-item label="名称" prop="name">
            <el-input
              v-model="ruleForm.name"
              class="h-[30px] text-12px"
              placeholder="请输入名称"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="菜单列表" prop="parentId">
            <el-cascader
              :options="formMenuList"
              v-model="restaurants"
              :props="limitProps"
              clearable
              @change="changeMenu"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="30" v-if="ruleForm.menuType != 'F'">
        <el-col :span="22">
          <el-form-item label="路由地址" prop="path">
            <el-input
              v-model="ruleForm.path"
              class="h-[30px] text-12px"
              placeholder="请输入路由地址"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="30" v-if="ruleForm.menuType != 'F'">
        <el-col :span="22">
          <el-form-item label="组件路径">
            <el-input
              v-model="ruleForm.component"
              class="h-[30px] text-12px"
              placeholder="请输入组件路径"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="30">
        <el-col :span="11" v-if="ruleForm.menuType != 'F'">
          <el-form-item label="路由参数">
            <el-input
              v-model="ruleForm.query"
              class="h-[30px] text-12px"
              placeholder="请输入路由参数"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="权限标识">
            <el-select v-model="ruleForm.perms" placeholder="请输入权限标识">
              <el-option label="请选择" value="" />
              <el-option
                v-for="item in accessItem"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="排序">
            <el-input
              v-model="ruleForm.seq"
              class="h-[30px] text-12px"
              placeholder="排序序号"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="30" v-if="ruleForm.menuType != 'F'">
        <el-col :span="11">
          <el-form-item label="是否显示">
            <el-switch
              v-model="ruleForm.visible"
              inline-prompt
              active-text="显示"
              inactive-text="隐藏"
            ></el-switch>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="状态">
            <el-switch
              v-model="ruleForm.status"
              inline-prompt
              active-text="启用"
              inactive-text="禁用"
            ></el-switch>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="30">
        <el-col :span="11" v-if="ruleForm.menuType != 'F'">
          <el-form-item label="图标">
            <el-input
              v-model="ruleForm.icon"
              class="h-[30px] text-12px"
              placeholder="请输入图标"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </ElForm>
    <template #footer>
      <div>
        <el-button class="ml-4" size="large" type="primary" @click="confirm">确认</el-button>
        <el-button class="ml-4" size="large" plain type="primary" @click="cancel">取消</el-button>
      </div>
    </template>
  </ElDrawer>
</template>

<script lang="ts" setup>
import { ref, watch, reactive, computed } from 'vue'
import { ElDrawer, ElMessage } from 'element-plus'
import { menuUpdate, menuCreate } from '../service'
import { accessItem } from '@/config/config'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  boxType: {
    type: String,
    default: 'add'
  },
  curMenu: {
    type: Object,
    default: {}
  },
  menuList: {
    type: Array,
    default: []
  }
})

// 限制菜单列表
const limitProps = {
  checkStrictly: true
}
const drawerShow = ref<boolean>(false)
const emits = defineEmits(['drawerClose'])
// 参数
const ruleForm = reactive<any>({
  name: '',
  parentId: '',
  seq: 0,
  path: '',
  component: '',
  query: '',
  isFrame: false,
  isCache: false,
  menuType: 'M',
  visible: false,
  status: true,
  perms: '',
  icon: ''
})
const restaurants = ref<number[]>([])
// 表单ref
const formRef = ref()
// 当前的选择菜单
// const curMenu = ref<any>({})
// 自动补全
// const inputRef=ref()
// 限制
const rules = reactive({
  name: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
  path: [{ required: true, message: '路由路径不能为空', trigger: 'blur' }],
  parentId: [{ required: true, message: '请选择父级菜单', trigger: 'blur' }]
})

// watch(
//   () => props.visible,
//   (newData, _) => {
//     drawerShow.value = newData
//     if(!newData){
//       restaurants.value = []
//     }
//   }
// )

watch([() => props.boxType, () => props.curMenu, () => props.visible], (newData, _) => {
  drawerShow.value = newData[2]

  if (!newData[2] || newData[0] == 'add') {
    restaurants.value = []
  }

  if (newData[0] === 'edit' && newData[1]) {
    if (newData[1].perms) {
      const perms = newData[1].perms.split(':')
      ruleForm.perms = perms[perms.length - 1]
    } else {
      ruleForm.perms = ''
    }
    ruleForm.name = newData[1].name
    ruleForm.component = newData[1].component
    ruleForm.path = newData[1].path
    ruleForm.isCache = newData[1].isCache
    ruleForm.isFrame = newData[1].isFrame
    ruleForm.menuType = newData[1].menuType
    ruleForm.query = newData[1].query
    ruleForm.seq = newData[1].seq
    ruleForm.status = newData[1].status
    ruleForm.visible = newData[1].visible
    ruleForm.icon = newData[1].icon
    ruleForm.parentId = newData[1].parentId
    getMenuList()
  } else {
    ruleForm.name = ''
    ruleForm.component = ''
    ruleForm.path = ''
    ruleForm.isCache = false
    ruleForm.isFrame = false
    ruleForm.menuType = 'M'
    ruleForm.parentId = ''
    ruleForm.query = ''
    ruleForm.perms = ''
    ruleForm.seq = 0
    ruleForm.status = true
    ruleForm.icon = ''
    ruleForm.visible = true
  }
})

// 存储菜单
// watch(
//   () => props.menuList,
//   (newData, _) => {
//     recursionMenu(newData)
//   }
// )

// 过滤菜单
const formMenuList = computed(() => {
  let obj = {
    id: 0,
    children: null,
    component: 'Layout',
    icon: '',
    isCache: false,
    isFrame: false,
    menuType: 'M',
    name: '顶级目录',
    parentId: 0,
    seq: 0,
    status: true,
    path: '',
    perms: '',
    query: '',
    visible: ''
  }
  let menuArr = JSON.parse(JSON.stringify(props.menuList))
  let newMenuArr = [obj, ...menuArr]
  const getMenuList = deepFilter(newMenuArr)
  return getMenuList
})

// 选择菜单
const changeMenu = (e) => {
  if (!e) {
    restaurants.value = []
    return
  }
  const getMenuId = e[e.length - 1]
  ruleForm.parentId = getMenuId
  restaurants.value = e
}

// 父级菜单
const getMenuList = async () => {
  if (props.boxType === 'edit') {
    // const list=restaurants.value.filter(item=>item.value === props.curMenu.parentId)
    // ruleForm.parentId = list[0].value
    const ret: number[] = getTreeDeepArr(props.curMenu.id, props.menuList)
    if (ret.length === 1) {
      restaurants.value = [0]
    } else if (ret.length > 1) {
      // if(props.curMenu.menuType!=='F'){
      //   ret.pop()
      // }
      ret.pop()
      restaurants.value = ret
    }
  }
}
// 递归过滤
const deepFilter = (data: any) => {
  return data.filter((item) => {
    item.value = item.id
    item.label = item.name
    if (item.children && item.children.length) {
      item.children = deepFilter(item.children)
    } else {
      item.children = null
    }
    return item.menuType != 'F'
  })
}
// 递归列表
// const recursionMenu = (data: any) => {
//   if (!data) return []
//   data.forEach((item) => {
//     item.value = item.id
//     restaurants.value = [...restaurants.value, item]
//     if (item.children && item.children.length > 0) {
//       recursionMenu(item.children)
//     }
//   })
// }
// 点击切换tabs
const handleClick = (e) => {
  ruleForm.menuType = e.props.name
}
// 选择父级菜单
// const selectMenu = (id:number) => {
// const list=restaurants.value.filter(item=>item.value===id)
// curMenu.value=list[0]
// }
const getTreeDeepArr = (key, treeData) => {
  let arr: any = [] // 在递归时操作的数组
  let returnArr = [] // 存放结果的数组
  let depth = 0 // 定义全局层级
  // 定义递归函数
  function childrenEach(childrenData, depthN) {
    for (var j = 0; j < childrenData.length; j++) {
      depth = depthN // 将执行的层级赋值 到 全局层级

      arr[depthN] = childrenData[j].id

      if (childrenData[j].id == key) {
        // returnArr = arr; // 原写法不行, 因 此赋值存在指针关系
        returnArr = arr.slice(0, depthN + 1) //将目前匹配的数组，截断并保存到结果数组，
        break
      } else {
        if (childrenData[j].children) {
          depth++
          childrenEach(childrenData[j].children, depth)
        }
      }
    }
    return returnArr
  }
  return childrenEach(treeData, depth)
}
// 确认
const confirm = () => {
  formRef.value.validate(async (vali) => {
    if (!vali) {
      console.log(123)
    } else {
      let data: any = {
        name: ruleForm.name,
        parentId: ruleForm.parentId,
        seq: ruleForm.seq,
        path: ruleForm.path,
        component: ruleForm.component,
        query: ruleForm.query,
        isFrame: ruleForm.isFrame,
        isCache: ruleForm.isCache,
        menuType: ruleForm.menuType,
        visible: ruleForm.visible,
        status: ruleForm.status,
        perms: ruleForm.perms,
        icon: ruleForm.icon,
        sysType: ruleForm.sysType
      }

      if ((data.menuType === 'F' || data.menuType === 'C') && data.perms) {
        const getParentMenu = deepData(props.menuList, data.parentId)
        const access = getParentMenu.parentId !== 0 ? getParentMenu.component.split('/') : ''
        let perms = ''
        for (let i = 0; i < access.length; i++) {
          perms += access[i] + ':'
        }
        perms += data.perms
        data.perms = perms
      }
      if (props.boxType === 'edit') {
        data.id = props.curMenu.id

        const ret = await menuUpdate(data)
        if (ret.success) {
          ElMessage.success('操作成功')
          close(true)
        }
      } else {
        delete data.id

        const ret = await menuCreate(data)
        if (ret.success) {
          ElMessage.success('操作成功')
          close(true)
        }
      }
    }
  })
}

// 递归找到父级
const deepData = (data, targetId) => {
  for (let item of data) {
    if (item.id === targetId) {
      // 找到目标数据，进行处理（这里可以根据需求进行任意操作，比如返回数据、修改数据等）
      return item
    }
    if (item.children && item.children.length > 0) {
      const result = deepData(item.children, targetId)
      if (result) {
        // 在子菜单中找到目标数据，进行处理
        return result
      }
    }
  }
  // 在整个菜单中未找到目标数据
  return null
}

// 取消
const cancel = () => {
  close(false)
}
// 关闭
const close = (bool: boolean) => {
  emits('drawerClose', bool)
}
//
</script>
