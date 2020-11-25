import request from '@/utils/request'

export function getMenuList(query) {
  return request({
    url: '/Menu/GetMenuList',
    method: 'get',
    params: query
  })
}

export function getMenuComboxData(query) {
  return request({
    url: '/Menu/GetMenuComboxList',
    method: 'get',
    params: query
  })
}

export function createMenu(data) {
  return request({
    url: '/Menu/CreateMenu',
    method: 'post',
    data
  })
}

export function deleteMenu(data) {
  return request({
    url: '/Menu/DeleteMenu',
    method: 'post',
    data
  })
}

export function updateMenu(data) {
  return request({
    url: '/Menu/UpdateMenu',
    method: 'post',
    data
  })
}

