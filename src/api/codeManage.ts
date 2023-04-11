import request from '@/utils/request'
import qs from 'qs'

// 基础值集维护
export function getProjectEleUnion(params: any) {
  return request({
    url: '/ds-cz-datacenter-special-funds/specialFundsEleUnion/page',
    method: 'post',
    params
  })
}
// 新增
export function addProjectEleUnion(data: any) {
  return request({
    url: '/ds-cz-datacenter-special-funds/specialFundsEleUnion/add',
    method: 'post',
    data
  })
}
// 编辑
export function updateProjectEleUnion(data: any) {
  return request({
    url: '/ds-cz-datacenter-special-funds/specialFundsEleUnion/update',
    method: 'post',
    data
  })
}
// 删除
export function deleteProjectEleUnion(params: any) {
  return request({
    url: '/ds-cz-datacenter-special-funds/specialFundsEleUnion/delete',
    method: 'post',
    params,
    paramsSerializer: {
      serialize: (params) => qs.stringify(params, { arrayFormat: 'repeat' })
    }
  })
}
// 基础值集
export function getProjectEleUnionTree(params?: any) {
  return request({
    url: '/ds-cz-datacenter-special-funds/specialFundsEleUnion/tree',
    method: 'get',
    params
  })
}

