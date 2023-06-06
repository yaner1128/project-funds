import request from '@/utils/request'

// 新增账目
export function getDsBalance(params: any, data: any) {
  return request({
    url: '/ds-cz-datacenter-special-funds/dsBalance/page',
    method: 'post',
    params,
    data
  })
}
