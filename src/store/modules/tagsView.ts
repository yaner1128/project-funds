const tagsView = {
  state: {
    visitedViews: [],
    cachedViews: []
  },
  mutations: {
    ADD_VISITED_VIEW: (state: { visitedViews: any[] }, view: { path: any; meta: { title: any } }) => {
      if (state.visitedViews.some((v: { path: any }) => v.path === view.path)) return
      state.visitedViews.push(
        Object.assign({}, view, {
          title: view.meta.title || 'no-name'
        })
      )
    },
    ADD_CACHED_VIEW: (state: { cachedViews: any[] }, view: { matched: any; name: any; meta: { noCache: any } }) => {
      // js 获取需要缓存的路由名称
      let nameArr =[]
      let matched = view.matched
      let name = view.name
      // 如果路由以index结尾就获取上一级路由名称
      if(name=='index'){
        let str = matched[matched.length-2].path
        let index = str.lastIndexOf("\/");
        name = str.substring(index + 1, str.length);
      }
      nameArr.push(name)
      // 如果是三级路由需要将上一级路由加入缓存
      if(matched.length>2){
        nameArr.push( matched[matched.length-2].name)
      }
      // 数组遍历存储
      nameArr.forEach(item=>{
        if (state.cachedViews.includes(item)) return
        if (!view.meta.noCache) {
          state.cachedViews.push(item)
        }
      })
    },

    DEL_VISITED_VIEW: (state: { visitedViews: any[] }, view: { path: any }) => {
      for (const [i, v] of state.visitedViews.entries()) {
        if (v.path === view.path) {
          state.visitedViews.splice(i, 1)
          break
        }
      }
    },
    DEL_CACHED_VIEW: (state: { cachedViews: any[] }, view: { matched: any; name: any }) => {
      let matched = view.matched
      let name = view.name
      // 如果路由以index结尾就获取上一级路由名称
      if(name=='index'){
        let str = matched[matched.length-2].path
        let index = str.lastIndexOf("\/");
        name = str.substring(index + 1, str.length);
      }
      for (const i of state.cachedViews) {
        if (i === name) {
          const index = state.cachedViews.indexOf(i)
          state.cachedViews.splice(index, 1)
          break
        }
      }
    },

    DEL_OTHERS_VISITED_VIEWS: (state: { visitedViews: any[] }, view: { path: any }) => {
      for (const [i, v] of state.visitedViews.entries()) {
        if (v.path === view.path) {
          state.visitedViews = state.visitedViews.slice(i, i + 1)
          break
        }
      }
    },
    DEL_OTHERS_CACHED_VIEWS: (state: { cachedViews: any[] }, view: { matched: any; name: any }) => {
      // js 获取当前路由名称
      let nameArr: any[] =[]
      let matched = view.matched
      let name = view.name
      // 如果路由以index结尾就获取上一级路由名称
      if(name=='index'){
        let str = matched[matched.length-2].path
        let index = str.lastIndexOf("\/");
        name = str.substring(index + 1, str.length);
      }
      nameArr.push(name)
      // 如果是三级路由需要保留上一级的路由名称
      if(matched.length>2){
        nameArr.push( matched[matched.length-2].name)
      }
      if(nameArr.length>1){
        state.cachedViews = state.cachedViews.filter((item: any) => item == nameArr[0]||item == nameArr[1])
      }else{
        state.cachedViews = state.cachedViews.filter((item: any) => item == nameArr[0])
      }
    },

    DEL_ALL_VISITED_VIEWS: (state: { visitedViews: any[] }) => {
      const affixTags = state.visitedViews.filter((tag: { meta: { affix: any } }) => tag.meta.affix)
      state.visitedViews = affixTags
    },
    DEL_ALL_CACHED_VIEWS: (state: { cachedViews: never[] }) => {
      state.cachedViews = []
    },

    UPDATE_VISITED_VIEW: (state: { visitedViews: any }, view: { path: any }) => {
      for (let v of state.visitedViews) {
        if (v.path === view.path) {
          v = Object.assign(v, view)
          break
        }
      }
    }

  },
  actions: {
    addView({ dispatch }: any, view: any) {
      dispatch('addVisitedView', view)
      dispatch('addCachedView', view)
    },
    addVisitedView({ commit }: any, view: any) {
      commit('ADD_VISITED_VIEW', view)
    },
    addCachedView({ commit }: any, view: any) {
      commit('ADD_CACHED_VIEW', view)
    },

    delView({ dispatch, state }: any, view: any) {
      return new Promise(resolve => {
        dispatch('delVisitedView', view)
        dispatch('delCachedView', view)
        resolve({
          visitedViews: [...state.visitedViews],
          cachedViews: [...state.cachedViews]
        })
      })
    },
    delVisitedView({ commit, state }: any, view: any) {
      return new Promise(resolve => {
        commit('DEL_VISITED_VIEW', view)
        resolve([...state.visitedViews])
      })
    },
    delCachedView({ commit, state }: any, view: any) {
      return new Promise(resolve => {
        commit('DEL_CACHED_VIEW', view)
        resolve([...state.cachedViews])
      })
    },

    delOthersViews({ dispatch, state }: any, view: any) {
      return new Promise(resolve => {
        dispatch('delOthersVisitedViews', view)
        dispatch('delOthersCachedViews', view)
        resolve({
          visitedViews: [...state.visitedViews],
          cachedViews: [...state.cachedViews]
        })
      })
    },
    delOthersVisitedViews({ commit, state }: any, view: any) {
      return new Promise(resolve => {
        commit('DEL_OTHERS_VISITED_VIEWS', view)
        resolve([...state.visitedViews])
      })
    },
    delOthersCachedViews({ commit, state }: any, view: any) {
      return new Promise(resolve => {
        commit('DEL_OTHERS_CACHED_VIEWS', view)
        resolve([...state.cachedViews])
      })
    },
    delAllViews({ dispatch, state }: any, view: any) {
      return new Promise(resolve => {
        dispatch('delAllVisitedViews', view)
        dispatch('delAllCachedViews', view)
        resolve({
          visitedViews: [...state.visitedViews],
          cachedViews: [...state.cachedViews]
        })
      })
    },
    delAllVisitedViews({ commit, state }: any) {
      return new Promise(resolve => {
        commit('DEL_ALL_VISITED_VIEWS')
        resolve([...state.visitedViews])
      })
    },
    delAllCachedViews({ commit, state }: any) {
      return new Promise(resolve => {
        commit('DEL_ALL_CACHED_VIEWS')
        resolve([...state.cachedViews])
      })
    },

    updateVisitedView({ commit }: any, view: any) {
      commit('UPDATE_VISITED_VIEW', view)
    }
  }
}

export default tagsView
