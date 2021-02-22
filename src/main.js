import Vue from 'vue'
import App from './App.vue'
import {initRouter} from './router'
import './theme/index.less'
import Antd from 'ant-design-vue'
import '@/mock'
import store from './store'
import 'animate.css/source/animate.css'
import Plugins from '@/plugins'
import bootstrap from '@/bootstrap'
import 'moment/locale/zh-cn'
//是否异步加载路由  store.state.setting.asyncRoutes 初始触发一次
const router = initRouter(store.state.setting.asyncRoutes)

Vue.use(Antd)
Vue.config.productionTip = false
Vue.use(Plugins)
//加载路由 配置等等信息
console.log(Vue.prototype.$message)
bootstrap({router, store,  message: Vue.prototype.$message})

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
