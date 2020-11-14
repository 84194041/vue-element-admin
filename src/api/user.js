import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/api/v1/User/Login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/User/UserInfo',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/vue-element-admin/user/logout',
    method: 'post'
  })
}
