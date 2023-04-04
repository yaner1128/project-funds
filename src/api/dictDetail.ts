import request from '@/utils/request'

export function buildDict(query: any) {
  return request({
    url: 'api/buildDict',
    method: 'post',
    data: query
  })
}

export function get(dictName: string, dictId?: string) {
  const params = {
    dictName,
    dictId,
    currentPageIndex: 0,
    pageSize: 9999
  }
  return request({
    url: '/ds-cz-datacenter-user/dictDetail/page',
    method: 'get',
    params
  })
}
export function getDetail(params: any) {
  return request({
    url: '/ds-cz-datacenter-user/dictDetail/page',
    method: 'get',
    params
  })
}

export function add(data: any) {
  return request({
    url: '/ds-cz-datacenter-user/dictDetail',
    method: 'post',
    data
  })
}

export function del(id: string) {
  return request({
    url: `/ds-cz-datacenter-user/dictDetail/${id}`,
    method: 'post'
  })
}

export function edit(data: any) {
  return request({
    url: '/ds-cz-datacenter-user/dictDetail/update',
    method: 'post',
    data
  })
}
