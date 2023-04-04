import { createRouter, createWebHistory } from 'vue-router'

/* Layout */
import Layout from '../views/layout/index.vue'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/

export const constantRouterMap = [
  // 404页面 匹配不到路由时跳转到该页面
  {
    path: '/:catchAll(.*)',
    hidden: true,
    component: () => import('@/views/errorPage/Page404.vue')
  },
  {
    path: '/Page404',
    component: () => import('@/views/errorPage/Page404.vue'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: 'dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/Home.vue'),
        name: '首页',
        meta: { title: '首页', icon: 'index', noCache: true, affix: true }
      }
    ]
  },
  {
    path: '/login',
    meta: { title: '登录', noCache: true },
    component: () => import('@/views/login/index.vue'),
    hidden: true
  },
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index.vue')
      }
    ]
  },
  {
    path: '/system',
    component: Layout,
    redirect: '/system/role',
    meta: {
      title: '系统管理'
    },
    name: '系统管理',
    children: [
      {
        path: 'role',
        meta: {
          title: '角色管理'
        },
        name: '角色管理',
        component: () => import('@/views/system/role/index.vue')
      },
      {
        path: 'menu',
        meta: {
          title: '菜单管理'
        },
        name: '菜单管理',
        component: () => import('@/views/system/menu/index.vue')
      }
    ]
  }
]

export default createRouter({
  history: createWebHistory(process.env.NODE_ENV === 'production' ? '/project/' : '/'),
  routes: constantRouterMap
})
