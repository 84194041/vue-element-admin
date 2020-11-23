import request from '@/utils/request'

export function getMenuList(query) {
  return request({
    url: '/Menu/GetMenuList',
    method: 'get',
    params: query
  })
}