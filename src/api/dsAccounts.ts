import request from '@/utils/request'
import qs from 'qs'

// 专户管理
// 分页
export function getDsAccountsPage(params: any, data: any) {
  return request({
    url: '/ds-cz-datacenter-special-funds/dsAccounts/page',
    method: 'post',
    params,
    data
  })
}
// 新增
export function addDsAccounts(data: any) {
  return request({
    url: '/ds-cz-datacenter-special-funds/dsAccounts/add',
    method: 'post',
    data
  })
}
// 编辑
export function updateDsAccounts(data: any) {
  return request({
    url: '/ds-cz-datacenter-special-funds/dsAccounts/update',
    method: 'post',
    data
  })
}
// 删除
export function deleteDsAccounts(params: any) {
  return request({
    url: '/ds-cz-datacenter-special-funds/dsAccounts/delete',
    method: 'post',
    params,
    paramsSerializer: {
      serialize: (params) => qs.stringify(params, { arrayFormat: 'repeat' })
    }
  })
}

// 获取开户银行下拉数据
export function specialFundsEleUnionTree() {
  return request({
    url: '/ds-cz-datacenter-special-funds/specialFundsEleUnion/tree',
    method: 'get'
  })
}

// 获取股室数据
export function basMofDepTree() {
  return request({
    url: '/ds-cz-datacenter-user/basMofDep/tree',
    method: 'get'
  })
}

