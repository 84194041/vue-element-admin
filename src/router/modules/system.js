/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const tableRouter = {
  path: '/system',
  component: Layout,
  name: '系统设置',
  meta: {
    title: '系统设置',
    icon: 'el-icon-setting'
  },
  children: [
    {
      path: 'tenant',
      component: () => import('@/views/system/tenant/index'),
      name: '租户管理',
      meta: { title: '租户管理', icon: 'table' }
    },
    {
      path: 'role',
      component: () => import('@/views/system/role/index'),
      name: '角色管理',
      meta: { title: '角色管理', icon: 'peoples' }
    },
    {
      path: 'menu',
      component: () => import('@/views/system/menu/index'),
      name: '菜单管理',
      meta: { title: '菜单管理', icon: 'el-icon-menu' }
    },
    {
      path: 'icons',
      component: () => import('@/views/icons/index'),
      name: '图标',
      meta: { title: 'icons', icon: 'icon' }
    }
  ]
}
export default tableRouter
