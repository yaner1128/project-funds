const getters = {
  sidebar: (state: any) => state.app.sidebar,
  user: (state: any) => state.user.user,
  token: (state: any) => state.user.token,
  roles: (state: any) => state.user.roles,
  loadMenus: (state: any) => state.user.loadMenus,
  visitedViews: (state: any) => state.tagsView.visitedViews,
  cachedViews: (state: any) => state.tagsView.cachedViews,
  permission_routers: (state: any) => state.permission.routers,
  addRouters: (state: any) => state.permission.addRouters,
}
export default getters
