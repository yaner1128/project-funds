import request from '@/utils/request'

// 账套管理
// 分页
export function getAccountSets(params: any) {
  return request({
    url: '/ds-cz-datacenter-special-funds/dsAccountSets/page',
    method: 'post',
    params
  })
}

// 新增
export function addAccountSets(data: any) {
  return request({
    url: '/ds-cz-datacenter-special-funds/dsAccountSets/add',
    method: 'post',
    data
  })
}

// 会计科目
export function simpleAccountingSubject(params: any) {
  return request({
    url: '/ds-cz-datacenter-special-funds/dsLedgerAccounts/simpleAccountingSubject',
    method: 'get',
    params
  })
}

