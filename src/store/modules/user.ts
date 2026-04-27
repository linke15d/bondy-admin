import { toRefs, reactive } from 'vue'
import { defineStore } from 'pinia'
import { accessItem } from '@/config/config'
import { setStorage } from '@/utils/auth.util'

interface UerInfoProp {
  roles: Array<string>
  permissions: Array<string>
  token: string
  user: UserProp
  currAccess: CurrProps
}

// 权限对象
interface CurrProps {
  [propsName: string]: string
}
interface UserProp {
  isAdmin: boolean
  token: string
  username: string
  nickName: string
}

const userInfoStore = defineStore(
  'user',
  () => {
    const state = reactive<UerInfoProp>({
      roles: [],
      permissions: [],
      token: '',
      user: {
        isAdmin: true,
        username: '',
        token: '',
        nickName: '',
      },
      // 当前用户所处路由权限
      currAccess: {}
    })

    // 用户信息
    const getUserInfo = (): UserProp => state.user
    // 获取token
    const getToken = (): string => state.token
    // 用户权限
    const getAccess = (): string[] => state.permissions
    // 当前页面操作权限
    const getPathAuth = (): CurrProps => state.currAccess
    // 保存信息
    const setUserInfo = (data: UserProp) => {
      state.token = data.token
      state.user = {
        isAdmin: data.isAdmin,
        username: data.username,
        token: data.token,
        nickName: data.nickName,
      }
      setStorage('userInfo', JSON.stringify(data))
    }

    // 根据路由过滤出当前页面权限
    const setRouteAuth = (path: string) => {
      const pathStr: string[] = path.split('/')
      const getPathLen: string = pathStr[pathStr.length - 1]
      const existedAccess: string[] = state.permissions
      let access: string[] = []
      existedAccess.forEach((item: string) => {
        const sp: string = item.toLocaleUpperCase()
        const pathToCase: string = getPathLen.toLocaleUpperCase()
        if (sp.indexOf(pathToCase) > -1) {
          const getAuthItem: string[] = item.split(':')
          const accessLen = getAuthItem[getAuthItem.length - 1]
          access = [...access, accessLen]
        }
      })
      // state.currAccess = accessItem.filter(item=>access.includes(item))
      const obj = {}

      accessItem.map((item) => {
        if (access.includes(item.value)) {
          obj[item.value] = true
        } else {
          obj[item.value] = false
        }
      })
      state.currAccess = obj
    }
    return {
      ...toRefs(state),
      getUserInfo,
      getToken,
      getAccess,
      setRouteAuth,
      getPathAuth,
      setUserInfo
    }
  },
  {
    persist: true
  }
)

export default userInfoStore
