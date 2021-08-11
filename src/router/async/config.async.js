import routerMap from './router.map'
import {parseRoutes} from '@/utils/routerUtil'

// 异步路由配置  //不需要权限的路由
const routesConfig = [
  'login',
  'root',
  {
    router: 'exp404',
    path: '*',
    name: '404',
    pkId:'12'
  },
  {
    router: 'exp403',
    path: '/403',
    name: '403',
    pkId:'45'
  }
]

//默认赋予权限 *  基础路由
const options = {
  routes: parseRoutes(routesConfig, routerMap)
}
export default options
