import { createStore } from 'vuex'

import app from './modules/app'
import user from './modules/user'
import tagsView from './modules/tagsView'
import permission from './modules/permission'


import getters from './getters'

export default createStore({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    app,
    user,
    tagsView,
    permission
  },
  getters
})
