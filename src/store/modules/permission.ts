import { constantRouterMap } from '@/router/routers'
import Layout from '@/views/layout/index.vue'

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state: any, routers: any) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateRoutes({ commit }: any, asyncRouter: any) {
      commit('SET_ROUTERS', asyncRouter)
    }
  }
}

export const filterAsyncRouter = (routers: any[], parent?: any) => { // 遍历后台传来的路由字符串，转换为组件对象
  const accessedRouters = routers.filter((router: any) => {
    const component = router.component
    if (component) {
      if (component+'' === 'Layout') { // Layout组件特殊处理
        router.component = Layout
      } else {
        if (router.path === 'index') {
          router.name = parent.path.substr(1)
        } else if (router.path === 'baTrbgtinfo' && parent.path === '/dataAnalysis') {
          router.name = parent.path.substr(1) + router.path
        }
        else {
          router.name = router.path
        }
        router.component = loadView(component)
      }
    }
    if (router.children && router.children.length) {
      router.children = filterAsyncRouter(router.children, router)
    }
    return true
  })
  return accessedRouters
}


export const loadView = (view: any) => { // 路由懒加载
  return () => Promise.resolve(require(`@/views/${view}`).default)
}

export default permission
