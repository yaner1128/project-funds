import Cookies from 'js-cookie'

const app = {
  state: {
    sidebar: {
      opened: !+Cookies.get('sidebarStatus'),
      withoutAnimation: false
    },
    device: 'desktop'
  },
  mutations: {
    TOGGLE_SIDEBAR: (state: { sidebar: { opened: boolean; withoutAnimation: boolean } }) => {
      if (state.sidebar.opened) {
        Cookies.set('sidebarStatus', 1)
      } else {
        Cookies.set('sidebarStatus', 0)
      }
      state.sidebar.opened = !state.sidebar.opened
      state.sidebar.withoutAnimation = false
    },
    CLOSE_SIDEBAR: (state: { sidebar: { opened: boolean; withoutAnimation: any } }, withoutAnimation: any) => {
      Cookies.set('sidebarStatus', 1)
      state.sidebar.opened = false
      state.sidebar.withoutAnimation = withoutAnimation
    },
    OPEN_SIDEBAR: (state: { sidebar: { opened: boolean; withoutAnimation: any } }, withoutAnimation: any) => {
      Cookies.set('sidebarStatus', 0)
      state.sidebar.opened = true
      state.sidebar.withoutAnimation = withoutAnimation
    },
    TOGGLE_DEVICE: (state: { device: any }, device: any) => {
      state.device = device
    }
  },
  actions: {
    ToggleSideBar: ({ commit }: any) => {
      commit('TOGGLE_SIDEBAR')
    },
    closeSideBar({ commit }: any, { withoutAnimation }: any) {
      commit('CLOSE_SIDEBAR', withoutAnimation)
    },
    openSideBar({ commit }: any, { withoutAnimation }: any) {
      commit('OPEN_SIDEBAR', withoutAnimation)
    },
    toggleDevice({ commit }: any, device: any) {
      commit('TOGGLE_DEVICE', device)
    }
  }
}

export default app
