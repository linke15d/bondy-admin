import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import type { App } from 'vue'
import {
  Layout
  // getParentLayout
} from '@/utils/routerHelper'

export const constantRouterMap: AppRouteRecordRaw[] = [
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard/analysis',
    name: 'Root',
    meta: {
      hidden: true
    }
  },
  {
    path: '/redirect',
    component: Layout,
    name: 'Redirect',
    children: [
      {
        path: '/redirect/:path(.*)',
        name: 'Redirecta',
        component: () => import('@/views/Redirect/Redirect.vue'),
        meta: {}
      }
    ],
    meta: {
      hidden: true,
      noTagsView: true
    }
  },
  {
    path: '/login',
    component: () => import('@/views/Login/Login.vue'),
    name: 'Login',
    meta: {
      hidden: true,
      title: '登陆',
      noTagsView: true
    }
  },
  {
    path: '/404',
    component: () => import('@/views/Error/404.vue'),
    name: 'NoFind',
    meta: {
      hidden: true,
      title: '404',
      noTagsView: true
    }
  }
]

export const asyncRouterMap: AppRouteRecordRaw[] = [
  {
    path: '/dashboard',
    component: Layout,
    redirect: '/dashboard',
    name: 'Dashboard',
    meta: {
      title: '首页',
      icon: 'tabler:home-filled',
      alwaysShow: true
    },
    children: [
      {
        path: 'analysis',
        component: () => import('@/views/Dashboard/Analysis.vue'),
        name: 'Analysis',
        meta: {
          title: '仪表台',
          icon: '',
          noCache: true,
          affix: true
        }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    redirect: '/user',
    name: 'User',
    meta: {
      title: '用户管理',
      icon: 'solar:user-bold',
      alwaysShow: true
    },
    children: [
      {
        path: 'userList',
        component: () => import('@/views/User/UserList.vue'),
        name: 'UserList',
        meta: {
          title: '用户列表',
          icon: '',
          noCache: true,
          affix: true
        },
        children: [
          {
            path: 'userDetails',
            component: () => import('@/views/User/Deatils/UserDetails.vue'),
            name: 'UserDetails',
            meta: {
              title: '用户详情',
              icon: '',
              noCache: true,
              affix: true
            }
          }
        ]
      }
    ]
  },
  {
    path: '/lang',
    component: Layout,
    redirect: '/lang',
    name: 'Lang',
    meta: {
      title: '语言管理',
      icon: 'lucide:languages',
      alwaysShow: true
    },
    children: [
      {
        path: 'langList',
        component: () => import('@/views/Lang/LangList.vue'),
        name: 'LangList',
        meta: {
          title: '语言列表',
          icon: '',
          noCache: true,
          affix: true
        },
      },
    ]
  },
  {
    path: '/content',
    component: Layout,
    redirect: '/content',
    name: 'Content',
    meta: {
      title: '内容管理',
      icon: 'fluent:content-view-24-filled',
      alwaysShow: true
    },
    children: [
      {
        path: 'position',
        component: () => import('@/views/Content/Position.vue'),
        name: 'Position',
        meta: {
          title: '姿势列表',
          icon: '',
          noCache: true,
          affix: true
        },
      },
      {
        path: 'tags',
        component: () => import('@/views/Content/Tags.vue'),
        name: 'Tags',
        meta: {
          title: '标签列表',
          icon: '',
          noCache: true,
          affix: true
        },
      },
    ]
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  strict: true,
  routes: constantRouterMap as RouteRecordRaw[],
  scrollBehavior: () => ({ left: 0, top: 0 })
})

export const resetRouter = (): void => {
  const resetWhiteNameList = ['Redirect', 'Login', 'NoFind', 'Root']
  router.getRoutes().forEach((route) => {
    const { name } = route
    if (name && !resetWhiteNameList.includes(name as string)) {
      router.hasRoute(name) && router.removeRoute(name)
    }
  })
}

export const setupRouter = (app: App<Element>) => {
  app.use(router)
}

export default router
