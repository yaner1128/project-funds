import request from '@/utils/request'

// 账套树
export function getAccountSetsList(params?: any) {
  return request({
    url: '/ds-cz-datacenter-special-funds/dsAccountSets/list',
    method: 'get',
    params
  })
}

// 获取会计分录列表 分页
export function getAccountJournal(params: any, data: any) {
  return request({
    url: '/ds-cz-datacenter-special-funds/dsAccountJournal/page',
    method: 'post',
    params,
    data
  })
}

// 获取最新分录号
export function getLastJournalNumber(params: any) {
  return request({
    url: '/ds-cz-datacenter-special-funds/dsAccountJournal/selectLastJournalNumber',
    method: 'get',
    params
  })
}

// 根据账套ID 获取会计科目
export function getLedgerAccountsList(params: any) {
  return request({
    url: '/ds-cz-datacenter-special-funds/dsLedgerAccounts/list',
    method: 'get',
    params
  })
}

// 结转方式一
export function addByTypeOne(data: any) {
  return request({
    url: '/ds-cz-datacenter-special-funds/dsAccountJournal/addByTypeOne',
    method: 'post',
    data
  })
}
// 方式一详情
export function detailByTypeOne(data: any) {
  return request({
    url: '/ds-cz-datacenter-special-funds/dsAccountJournal/detailByTypeOne',
    method: 'post',
    data
  })
}
// 方式一编辑
export function updateByTypeOne(data: any) {
  return request({
    url: '/ds-cz-datacenter-special-funds/dsAccountJournal/updateByTypeOne',
    method: 'post',
    data
  })
}

// 结转方式二
export function addByTypeTwo(data: any) {
  return request({
    url: '/ds-cz-datacenter-special-funds/dsAccountJournal/addByTypeTwo',
    method: 'post',
    data
  })
}
// 详情
export function detailByTypeTwo(data: any) {
  return request({
    url: '/ds-cz-datacenter-special-funds/dsAccountJournal/detailByTypeTwo',
    method: 'post',
    data
  })
}
// 编辑
export function updateByTypeTwo(data: any) {
  return request({
    url: '/ds-cz-datacenter-special-funds/dsAccountJournal/updateByTypeTwo',
    method: 'post',
    data
  })
}

// 结转方式三
export function addByTypeThree(data: any) {
  return request({
    url: '/ds-cz-datacenter-special-funds/dsAccountJournal/addByTypeThree',
    method: 'post',
    data
  })
}
// 详情
export function detailByTypeThree(data: any) {
  return request({
    url: '/ds-cz-datacenter-special-funds/dsAccountJournal/detailByTypeThree',
    method: 'post',
    data
  })
}
// 编辑
export function updateByTypeThree(data: any) {
  return request({
    url: '/ds-cz-datacenter-special-funds/dsAccountJournal/updateByTypeThree',
    method: 'post',
    data
  })
}
// 删除
export function deleteAccountJournal(params: any) {
  return request({
    url: '/ds-cz-datacenter-special-funds/dsAccountJournal/delete',
    method: 'post',
    params
  })
}
