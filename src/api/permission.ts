import request from '@/utils/request'

export function getPermissions(params: any) {
  return request({
    url: '/ds-cz-datacenter-user/permissions',
    method: 'get',
    params
  })
}

// 获取所有的权限树
export function getPermissionTree() {
  return request({
    url: '/ds-cz-datacenter-user/permissions/tree',
    method: 'get'
  })
}

export function add(data: any) {
  return request({
    url: '/ds-cz-datacenter-user/permissions',
    method: 'post',
    data
  })
}

export function del(id: string) {
  return request({
    url: `/ds-cz-datacenter-user/permissions/${id}`,
    method: 'delete'
  })
}

export function edit(data: any) {
  return request({
    url: '/ds-cz-datacenter-user/permissions',
    method: 'put',
    data
  })
}
