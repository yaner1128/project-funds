import request from '@/utils/request'

// 新增账目
export function addDsLedger(data: any) {
  return request({
    url: '/ds-cz-datacenter-special-funds/dsLedger/add',
    method: 'post',
    data
  })
}

// 查询
export function getDsLedgerPage(params: any) {
  return request({
    url: '/ds-cz-datacenter-special-funds/dsLedger/page',
    method: 'post',
    params
  })
}

// 详情
export function getDsLedgerDetail(params: any) {
  return request({
    url: '/ds-cz-datacenter-special-funds/dsLedger/detail',
    method: 'get',
    params
  })
}

// 修改
export function updateDsLedger(data: any) {
  return request({
    url: '/ds-cz-datacenter-special-funds/dsLedger/update',
    method: 'post',
    data
  })
}

// 删除
export function deleteDsLedger(params: any) {
  return request({
    url: '/ds-cz-datacenter-special-funds/dsLedger/delete',
    method: 'post',
    params
  })
}
