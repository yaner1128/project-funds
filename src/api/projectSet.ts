import request from '@/utils/request'
import qs from 'qs'

// 删除
export function deleteDsMofProjects(params: any) {
  return request({
    url: '/ds-cz-datacenter-special-funds/DsMofProjects/delete',
    method: 'post',
    params,
    paramsSerializer: {
      serialize: (params) => qs.stringify(params, { arrayFormat: 'repeat' })
    }
  })
}

// 获取项目
export function getDsMofProjects(params: any, data: any) {
  return request({
    url: '/ds-cz-datacenter-special-funds/DsMofProjects/page',
    method: 'post',
    params,
    data
  })
}

// 编辑项目
export function updateDsMofProjects(data: any) {
  return request({
    url: '/ds-cz-datacenter-special-funds/DsMofProjects/update',
    method: 'post',
    data
  })
}

// 添加项目
export function addDsMofProjects(data: any) {
  return request({
    url: '/ds-cz-datacenter-special-funds/DsMofProjects/add',
    method: 'post',
    data
  })
}

