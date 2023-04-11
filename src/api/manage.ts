import request from '@/utils/request'

export function getProject() {
  return request({
    url: 'project/data',
    method: 'get'
  })
}
