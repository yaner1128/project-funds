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
export function specialFundsEleUnionTree(params: any) {
  return request({
    url: '/ds-cz-datacenter-special-funds/specialFundsEleUnion/tree',
    method: 'get',
    params
  })
}

// 获取股室数据
export function basMofDepTree(params: any) {
  return request({
    url: '/ds-cz-datacenter-user/basMofDep/tree',
    method: 'get',
    params
  })
}

// 获取专户
export function getAccountsStatus() {
  return request({
    url: '/ds-cz-datacenter-special-funds/dsAccounts/getAccountsStatus',
    method: 'get'
  })
}

// 修改余额
export function addAccountLog(data: any) {
  return request({
    url: '/ds-cz-datacenter-special-funds/dsAccountLog/add',
    method: 'post',
    data
  })
}

// 获取所有银行账号
export function getAccountsPage(data: any) {
  return request({
    url: '/ds-cz-datacenter-special-funds/dsAccounts/page',
    method: 'post'
  })
}

// 新增专户付款申请生成单号
export function getMaxAllocationCode(params: any) {
  return request({
    url: '/ds-cz-datacenter-special-funds/dsAllocationReques/getMaxAllocationCode',
    method: 'post',
    params
  })
}

// 新增专户付款申请
export function dsAllocationRequesAdd(data: any) {
  return request({
    url: '/ds-cz-datacenter-special-funds/dsAllocationReques/add',
    method: 'post',
    data
  })
}

// 获取专户付款申请分页
export function getDsAllocationReques(params: any) {
  return request({
    url: '/ds-cz-datacenter-special-funds/dsAllocationReques/page',
    method: 'post',
    params
  })
}
// 编辑
export function updateDsAllocationReques(data: any) {
  return request({
    url: '/ds-cz-datacenter-special-funds/dsAllocationReques/update',
    method: 'post',
    data
  })
}
// 详情
export function dsAllocationDetail(params: any) {
  return request({
    url: '/ds-cz-datacenter-special-funds/dsAllocationReques/detail',
    method: 'get',
    params
  })
}
// 删除
export function deleteDsAllocation(params: any) {
  return request({
    url: '/ds-cz-datacenter-special-funds/dsAllocationReques/delete',
    method: 'post',
    params
  })
}
