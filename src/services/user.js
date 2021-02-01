import {LOGIN, ROUTES} from '@/services/api'
import {request, request1, $get, METHOD, removeAuthorization} from '@/utils/request'
console.log(request)
/**
 * 登录服务
 * @param name 账户名
 * @param password 账户密码
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function login(name, password) {
  return request(LOGIN, METHOD.POST, {
    loginName: name,
    password: password,
  })
}

export async function login1() {
  return request1('http://47.105.124.53:8888/dingdang/globalApi/userLogin', METHOD.POST, {
    loginName: 'event_jd',
    password: '7c4a8d09ca3762af61e59520943dc26494f8941b',
    loginFrom:2
  })
}
export async function getRoutesConfig() {
  return request(ROUTES, METHOD.GET)
}

//获取模块接口
export async function getModule() {
  return $get('http://47.105.124.53:8888/dingdang/globalFunction/listFunctionByMap', {
      type: 0,
      pageNow: 1,
      pageSize: 999,
      rid:'9ef64a3545fe4afe96d6fd37020a10ed',
      roleIds:'9ef64a3545fe4afe96d6fd37020a10ed',
      loginName:'event_jd',
  })
}












/**
 * 退出登录
 */
export function logout() {
  localStorage.removeItem(process.env.VUE_APP_ROUTES_KEY)
  localStorage.removeItem(process.env.VUE_APP_PERMISSIONS_KEY)
  localStorage.removeItem(process.env.VUE_APP_ROLES_KEY)
  removeAuthorization()
}
export default {
  login,
  logout,
  getRoutesConfig
}
