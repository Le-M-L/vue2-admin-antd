import TabsView from '@/layouts/default/tabs'
import BlankView from '@/layouts/BlankView'

// 路由配置
const options = [
  {
    path: '/login',
    name: '登录页',
    component: () => import('@/pages/login')
  },
  {
    path: '*',
    name: '404',
    component: () => import('@/pages/exception/404'),
  },
  {
    path: '/403',
    name: '403',
    component: () => import('@/pages/exception/403'),
  },
  {
    path: '/',
    name: '首页',
    component: TabsView,
    redirect: '/login',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        meta: {
          icon: 'dashboard'
        },
        component: BlankView,
        children: [
          {
            path: 'workplace',
            name: '工作台',
            meta: {
              page: {
                closable: false,
                breadcrumb:['首页','工作台']
              },
            },
            component: () => import('@/pages/dashboard/workplace'),
          },
          {
            path: 'table',
            name: '测试表格',
            meta: {
              page: {
                closable: false,
                breadcrumb:['首页','测试表格']
              },
            },
            component: () => import('@/pages/demo/table'),
          }
        ]
      },
      {
        path: 'exception',
        name: '异常页',
        meta: {
          icon: 'warning',
        },
        component: BlankView,
        children: [
          {
            path: '404',
            name: 'Exp404',
            component: () => import('@/pages/exception/404')
          },
          {
            path: '403',
            name: 'Exp403',
            component: () => import('@/pages/exception/403')
          },
          {
            path: '500',
            name: 'Exp500',
            component: () => import('@/pages/exception/500')
          }
        ]
      },
    ]
  },
]

export default options
