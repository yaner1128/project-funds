import { login, getInfo, casLogout, logout } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    user: {},
    roles: [],
    // 第一次加载菜单时用到
    loadMenus: false,
    mofDepCode: null,
    mofDivInfo: [],
    agencyInfo: []
  },

  mutations: {
    SET_TOKEN: (state: { token: any }, token: any) => {
      state.token = token
    },
    SET_USER: (state: { user: any }, user: any) => {
      state.user = user
    },
    SET_ROLES: (state: { roles: any }, roles: any) => {
      state.roles = roles
    },
    SET_LOAD_MENUS: (state: { loadMenus: any }, loadMenus: any) => {
      state.loadMenus = loadMenus
    },
    SET_MOF_DEP_CODE: (state: {
      mofDivInfo: any; user: any
    }, mofDivInfo: any) => {
      state.mofDivInfo = mofDivInfo
    },
    SET_AGENCY_INFO: (state: {
      agencyInfo: any; user: any
    }, agencyInfo: any) => {
      state.agencyInfo = agencyInfo
    }
  },

  actions: {
    // 登录
    Login({ commit }: any, userInfo: { username: any; password: any; code: any; uuid: any; rememberMe: any }) {
      const username = userInfo.username
      const password = userInfo.password
      const rememberMe = userInfo.rememberMe

      const params = {
        grant_type: 'password',
        client_id: 'ds-cz-datacenter',
        username: username,
        password: password,
        client_secret: '123456'
      }
      return new Promise<void>((resolve, reject) => {
        login(params).then((res: any) => {
          setToken(res.data.token, rememberMe)
          commit('SET_TOKEN', res.data.token)
          // setUserInfo(res.user, commit)
          // console.log(res);

          // 第一次加载菜单时用到， 具体见 src 目录下的 permission.js
          commit('SET_LOAD_MENUS', true)
          resolve()
        }).catch((error: any) => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit }: any) {
      return new Promise((resolve, reject) => {
        getInfo().then((res: any) => {
          setUserInfo(res.data, commit)
          getUserInfo(res.data, commit)
          resolve(res)
        }).catch((error: any) => {
          reject(error)
        })
      })
    },
    // 登出
    LogOut({ commit }: any) {
      return new Promise<void>((resolve, reject) => {
        logout().then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          resolve()
        }).catch((error: any) => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          reject(error)
        })
      })
    },
    logoutCas({ commit }: any) {
      return new Promise((resolve, reject) => {
        casLogout().then((res: any) => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          resolve(res)
        }).catch((error: any) => {
          reject(error)
        })
      })
    },
    updateLoadMenus({ commit }: any) {
      return new Promise((resolve, reject) => {
        commit('SET_LOAD_MENUS', false)
      })
    }
  }
}

export const setUserInfo = (res: any, commit: any) => {
  const roleInfo = res.jwtUser.roleInfo.roles || []
  // 如果没有任何权限，则赋予一个默认的权限，避免请求死循环
  if (roleInfo && Array.isArray(roleInfo) && roleInfo.length > 0) {
    const curRoles = roleInfo.map((item: any) => {
      return item.code
    })
    // 当前用户所有角色code
    commit('SET_ROLES', curRoles)
  } else {
    commit('SET_ROLES', ['ROLE_SYSTEM_DEFAULT'])
  }
  // 头像路径
  var prefix = process.env.STATIC_RESOURCE_PREFIX
  res.avatar = prefix + res.jwtUser.avatar
  commit('SET_USER', res)
}

export const getUserInfo = (res: any, commit: any) => {
  commit('SET_MOF_DEP_CODE', res.mofDepCode)
}

export default user
