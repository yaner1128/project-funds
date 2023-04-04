import request from '@/utils/request'

export function login(params:any) {
  return request({
    url: '/ds-cz-datacenter-auth/oauth/token',
    method: 'post',
    params
  })
}
export function logout() {
  return request({
    url: '/ds-cz-datacenter-user/auth/logout',
    method: 'post',
    data: {}
  })
}

export function casLogout() {
  return request({
    url: 'auth/cas/logout',
    method: 'post',
    data: {}
  })
}

export function getInfo() {
  return request({
    url: '/ds-cz-datacenter-user/auth/info',
    method: 'get'
  })
}

export function getCodeImg() {
  return request({
    url: 'auth/vCode',
    method: 'get'
  })
}
