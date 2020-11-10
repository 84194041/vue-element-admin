/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const tableRouter = {
  path: '/system',
  component: Layout,
  name: '系统设置',
  meta: {
    title: '系统设置',
    icon: 'table'
  },
  children: [
    {
      path: 'tenant',
      component: () => import('@/views/system/tenant/index'),
      name: '租户管理',
      meta: { title: '租户管理' }
    },
    {
      path: 'payment',
      component: () => import('@/views/system/payment'),
      name: '支付宝支付',
      meta: { title: '支付宝支付' }
    }
  ]
}
export default tableRouter
