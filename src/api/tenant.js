import request from '@/utils/request'

export function getPagedList(query) {
  return request({
    url: '/Tenant/GetPagedList',
    method: 'get',
    params: query
  })
}

export function createTenant(data) {
  return request({
    url: '/Tenant/CreateTenant',
    method: 'post',
    data
  })
}

export function deleteTenant(data) {
  return request({
    url: '/Tenant/DeleteTenant',
    method: 'post',
    data
  })
}

export function updateTenant(data) {
  return request({
    url: '/Tenant/UpdateTenant',
    method: 'post',
    data
  })
}
