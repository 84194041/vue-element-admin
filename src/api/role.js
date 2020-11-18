import request from '@/utils/request'

export function getPagedList(query) {
  return request({
    url: '/Role/GetPagedList',
    method: 'get',
    params: query
  })
}

export function createRole(data) {
  return request({
    url: '/Role/CreateRole',
    method: 'post',
    data
  })
}

export function deleteRole(data) {
  return request({
    url: '/Role/DeleteRole',
    method: 'post',
    data
  })
}

export function updateRole(data) {
  return request({
    url: '/Role/UpdateRole',
    method: 'post',
    data
  })
}

export function getTenantComboxData(query) {
  return request({
    url: '/Tenant/GetPagedList',
    method: 'get',
    params: query
  })
}