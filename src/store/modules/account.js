//模块化变量配置
const MODEL_KEY = {
  LOGIN_MSG_KEY: "admin.user",          //用户登录信息KEY
  PERMISSIONS_KEY:'admin.permissions',  //用户表单权限 增删改查等等
  ROLES_KEY: "admin.roles",             //用户角色权限设置
  ROUTES_KEY:"admin.routes"             //路由地址
};

export default {
  namespaced: true,
  state: {
    user: undefined,
    permissions: null,
    roles: null,
    routesConfig: null
  },
  getters: {
    user: state => {
      if (!state.user) {
        try {
          const user = localStorage.getItem(MODEL_KEY.LOGIN_MSG_KEY)
          state.user = JSON.parse(user)
        } catch (e) {
          console.error(e)
        }
      }
      return state.user
    },
    permissions: state => {
      if (!state.permissions) {
        try {
          const permissions = localStorage.getItem(MODEL_KEY.PERMISSIONS_KEY)
          state.permissions = JSON.parse(permissions)
          state.permissions = state.permissions ? state.permissions : []
        } catch (e) {
          console.error(e.message)
        }
      }
      return state.permissions
    },
    roles: state => {
      if (!state.roles) {
        try {
          const roles = localStorage.getItem(MODEL_KEY.ROLES_KEY)
          state.roles = JSON.parse(roles)
          state.roles = state.roles ? state.roles : []
        } catch (e) {
          console.error(e.message)
        }
      }
      return state.roles
    },
    routesConfig: state => {
      if (!state.routesConfig) {
        try {
          const routesConfig = localStorage.getItem(MODEL_KEY.ROUTES_KEY)
          state.routesConfig = JSON.parse(routesConfig)
          state.routesConfig = state.routesConfig ? state.routesConfig : []
        } catch (e) {
          console.error(e.message)
        }
      }
      return state.routesConfig
    }
  },
  mutations: {
    setUser (state, user) {
      state.user = user
      localStorage.setItem(MODEL_KEY.LOGIN_MSG_KEY, JSON.stringify(user))
    },
    setPermissions(state, permissions) {
      state.permissions = permissions
      localStorage.setItem(MODEL_KEY.PERMISSIONS_KEY, JSON.stringify(permissions))
    },
    setRoles(state, roles) {
      state.roles = roles
      localStorage.setItem(MODEL_KEY.ROLES_KEY, JSON.stringify(roles))
    },
    setRoutesConfig(state, routesConfig) {
      state.routesConfig = routesConfig
      localStorage.setItem(MODEL_KEY.ROUTES_KEY, JSON.stringify(routesConfig))
    }
  }
}
