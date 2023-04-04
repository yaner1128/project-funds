import request from '@/utils/request'
import config from '@/config'

export function getAgencys(params?: any) {
  return request({
    url: `api/simpleAgencyInfo`,
    method: 'get',
    params
  })
}

export function getRoles(params: any) {
  params = Object.assign({
    serviceId: config.serviceId
  }, params)
  return request({
    url: '/ds-cz-datacenter-user/roles',
    method: 'get',
    params
  })
}

// 获取所有的Role
export function getAll() {
  return request({
    url: '/ds-cz-datacenter-user/roles/all',
    method: 'get'
  })
}

export function add(data: any) {
  return request({
    url: '/ds-cz-datacenter-user/roles',
    method: 'post',
    data
  })
}
export function addPerRole(data: any) {
  return request({
    url: '/ds-cz-datacenter-user/api/basPersonInfo/role',
    method: 'post',
    data
  })
}

export function delPerRole(perId: string, roleId: string) {
  return request({
    url: `/ds-cz-datacenter-user/basPersonInfo/role/${perId}/${roleId}`,
    method: 'delete'
  })
}

export function get(id: any) {
  return request({
    url: '/ds-cz-datacenter-user/roles/' + id,
    method: 'get'
  })
}

export function getLevel() {
  return request({
    url: '/ds-cz-datacenter-user/roles/level',
    method: 'get'
  })
}

export function del(id: string) {
  return request({
    url: 'api/roles/' + id,
    method: 'delete'
  })
}

export function edit(data: any) {
  return request({
    url: 'api/roles',
    method: 'put',
    data
  })
}

export function editPermission(data: any) {
  return request({
    url: '/ds-cz-datacenter-user/roles/permission',
    method: 'put',
    data
  })
}

export function editMenu(data: any) {
  data = Object.assign({ serverId: config.serverId }, data)
  return request({
    url: '/ds-cz-datacenter-user/roles/menu',
    method: 'put',
    data
  })
}
