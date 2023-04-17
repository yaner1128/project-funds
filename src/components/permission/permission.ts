import store from '@/store'

function checkPermission(el: { parentNode: { removeChild: (arg0: any) => any } }, binding: { value: any }) {
  const { value } = binding

  const roles = store.getters && store.getters.roles
  // 所有权限不对超级管理员限制
  if (roles && roles.includes('ROLE_ADMIN')) {
    return true
  }

  if (value && value instanceof Array) {
    if (value.length > 0) {
      const permissionRoles = value
      const hasPermission = roles.some((role: any) => {
        return permissionRoles.includes(role)
      })

      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    }
  } else {
    throw new Error(`need roles! Like v-permission="['admin','editor']"`)
  }
}

// vue2和vue3中指令对比https://jishuin.proginn.com/p/763bfbd29cb7
export default {
  mounted(el: any, binding: any) {
    checkPermission(el, binding)
  },
  componentUpdated(el: any, binding: any) {
    checkPermission(el, binding)
  }
}
