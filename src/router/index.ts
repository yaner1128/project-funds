import router from './routers'
import store from '@/store'
import Config from '@/config'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'// progress bar style
import { getToken, setToken } from '@/utils/auth' // getToken from cookie
import { buildMenus } from '@/api/menu'
import { filterAsyncRouter } from '@/store/modules/permission'

NProgress.configure({ showSpinner: false })

const whiteList = ['/login']// no redirect whitelist
router.beforeEach((to: any, from: any, next: any) => {
  if (to.path === '/InsideAutoLogin') {
    InsideAutoLogin(to, from, next)
    return
  }
  if (to.meta.title) {
    document.title = to.meta.title + ' - ' + Config.webName
  }
  NProgress.start() // start progress bar
  if (getToken()) {
    // 已登录且要跳转的页面是登录页
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      if (store.getters.roles.length === 0) { // 判断当前用户是否已拉取完user_info信息
        store.dispatch('GetInfo').then((res: any) => { // 拉取user_info
          // 动态路由，拉取菜单
          loadMenus(next, to)
        }).catch(() => {
          store.dispatch('LogOut').then(() => {
            location.reload() // 为了重新实例化vue-router对象 避免bug
          }).catch(() => {
            location.reload() // 为了重新实例化vue-router对象 避免bug
          })
        })
        // 登录时未拉取 菜单，在此处拉取
      } else if (store.getters.loadMenus) {
        // 修改成false，防止死循环
        store.dispatch('updateLoadMenus').then((res: any) => { })
        loadMenus(next, to)
      } else {
        next()
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      next()
    } else if (process.env.AUTH_MODE === 'CAS') { // cas 认证方式
      // router.push({ redirect: process.env.VUE_APP_BASE_API })
      window.location.href = process.env.VUE_APP_BASE_API || ''
      return
    } else {
      // 测试环境
      // window.location.href = 'http://192.168.1.7:3265/';
      // 正式环境
      // window.location.href = window.location.origin
      next(`/login`) // 否则全部重定向到登录页
      // next()
      NProgress.done()
    }
  }
})

export const loadMenus = (next: (arg0: any) => void, to: any) => {
  buildMenus().then((res: any) => {
    const asyncRouter = filterAsyncRouter(res.data)
    asyncRouter.push({ path: '*', redirect: '/404', hidden: true })
    store.dispatch('GenerateRoutes', asyncRouter).then(() => { // 存储路由
      asyncRouter.forEach((item: any) => {
        if (item.path.indexOf('/') !== -1) {
          router.addRoute(item)
        }
      })
      next({ ...to, replace: true })// hack方法 确保addRoutes已完成
    })
  })
}

router.afterEach(() => {
  NProgress.done() // finish progress bar
})

// 处理内部登陆
function InsideAutoLogin(to: any, from: any, next: any) {
  let mode = to.query.mode
  const toPath = to.query.to
  if (!toPath) {
    console.error('未指定前往路径')
    return
  }

  if (!mode) {
    mode = process.env.AUTH_MODE
  }
  if (mode === 'CAS') {
    return CAS_AutoLogin(to, from, next)
  } else if (mode === 'TOKEN') {
    return TOKEN_AutoLogin(to, from, next)
  } else {
    return JWT_AutoLogin(to, from, next)
  }
}

function CAS_AutoLogin(to: { query: { to: any; token: any; code: any } }, from: any, next: any) {
  const toPath = to.query.to
  const token = to.query.token
  const code = to.query.code
  if (!code) {
    console.error('没有登陆CODE')
    return
  }
  setToken(token, false)
  router.replace({ path: toPath, query: {} })
}

function TOKEN_AutoLogin(to: { query: { to: any; token: any } }, from: any, next: any) {
  const toPath = to.query.to
  const token = to.query.token
  if (!token) {
    console.error('没有登陆token')
    return
  }
  setToken(token, false)
  router.replace({ path: toPath, query: {} })
}

function JWT_AutoLogin(to: { query: { to: any; code: any } }, from: any, next: any) {
  const toPath = to.query.to
  const code = to.query.code
  if (!code) {
    console.error('没有登陆CODE')
    return
  }
  getAToken(code, function (data: { data: { token: any } }) {
    setToken(data.data.token, false)
    router.replace({ path: toPath, query: {} })
  })
}

function getAToken(enConetnt: string, callback: { (data: any): void; (arg0: any): any }) {
  var baseURL = process.env.VUE_APP_BASE_API
  var login = baseURL + '/auth/directLogin4'
  var xhr = new XMLHttpRequest()
  xhr.open('post', login)
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
  xhr.send('code=' + enConetnt)
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      var json = JSON.parse(xhr.responseText)
      callback && callback(json)
    }
  }
}
