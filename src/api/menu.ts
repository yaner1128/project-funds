import request from '@/utils/request'
import config from '@/config'

// 获取所有的菜单树
export function getMenusTree(params?: any) {
  params = Object.assign({ serviceId: config.serverId }, params)
  return request({
    url: '/ds-cz-datacenter-user/menus/tree',
    method: 'get',
    params
  })
}

export function getMenus(params: any) {
  return request({
    url: '/ds-cz-datacenter-user/menus/page',
    method: 'get',
    params
  })
}

export function buildMenus() {
  return request({
    url: '/ds-cz-datacenter-user/menus/build',
    method: 'get',
    params: {
      serviceId: config.serverId
    }
  })
}

export function add(data: any) {
  return request({
    url: '/ds-cz-datacenter-user/menus',
    method: 'post',
    params: {
      serviceId: config.serverId
    },
    data
  })
}

export function del(id: string) {
  return request({
    url: `/ds-cz-datacenter-user/${id}`,
    method: 'delete',
    params: { serviceId: config.serverId }
  })
}

export function edit(data: any) {
  return request({
    url: '/ds-cz-datacenter-user/menus',
    method: 'put',
    params: {
      serviceId: config.serverId
    },
    data
  })
}
