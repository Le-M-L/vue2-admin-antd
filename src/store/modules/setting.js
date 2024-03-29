import config from '@/config'
import {ADMIN} from '@/config/default'
import {formatFullPath} from '@/utils/routerUtil'
import {filterMenu} from '@/utils/authority-utils'
import {getLocalSetting} from '@/utils/themeUtil' //样式配置

const localSetting = getLocalSetting(true)
const customTitlesStr = sessionStorage.getItem(process.env.VUE_APP_TBAS_TITLES_KEY)
const customTitles = (customTitlesStr && JSON.parse(customTitlesStr)) || []

export default {
  namespaced: true,
  state: {
    isMobile: false,
    animates: ADMIN.animates,
    palettes: ADMIN.palettes,
    pageMinHeight: 0,
    menuData: [], //菜单栏
    activatedFirst: undefined,
    customTitles,
    ...config,
    ...localSetting
  },
  getters: {
    //获取菜单栏 是否进行权限过滤菜单 
    menuData(state, getters, rootState) {
      if (state.filterMenu) {
        const {permissions, roles} = rootState.account
        return filterMenu(state.menuData, permissions, roles)
      }
      return state.menuData
    },
    firstMenu(state, getters) {
      const {menuData} = getters
      if (menuData.length > 0 && !menuData[0].fullPath) {
        formatFullPath(menuData)
      }
      return menuData.map(item => {
        const menuItem = {...item}
        delete menuItem.children
        return menuItem
      })
    },
    subMenu(state) {
      const {menuData, activatedFirst} = state
      if (menuData.length > 0 && !menuData[0].fullPath) {
        formatFullPath(menuData)
      }
      const current = menuData.find(menu => menu.fullPath === activatedFirst)
      return current && current.children || []
    }
  },
  mutations: {
    setDevice (state, isMobile) {
      state.isMobile = isMobile
    },
    setTheme (state, theme) {
      state.theme = theme
    },
    setLayout (state, layout) {
      state.layout = layout
    },
    setMultiPage (state, multiPage) {
      state.multiPage = multiPage
    },
    setAnimate (state, animate) {
      state.animate = animate
    },
    setWeekMode(state, weekMode) {
      state.weekMode = weekMode
    },
    setFixedHeader(state, fixedHeader) {
      state.fixedHeader = fixedHeader
    },
    setFixedSideBar(state, fixedSideBar) {
      state.fixedSideBar = fixedSideBar
    },
    setHideSetting(state, hideSetting) {
      state.hideSetting = hideSetting
    },
    //设置页面高度
    correctPageMinHeight(state, minHeight) {
      state.pageMinHeight += minHeight
    },
    //设置菜单栏
    setMenuData(state, menuData) {
      state.menuData = menuData
    },
    setAsyncRoutes(state, asyncRoutes) {
      state.asyncRoutes = asyncRoutes
    },
    setPageWidth(state, pageWidth) {
      state.pageWidth = pageWidth
    },
    setActivatedFirst(state, activatedFirst) {
      state.activatedFirst = activatedFirst
    },
    setFixedTabs(state, fixedTabs) {
      state.fixedTabs = fixedTabs
    },
    setCustomTitle(state, {path, title}) {
      if (title) {
        const obj = state.customTitles.find(item => item.path === path)
        if (obj) {
          obj.title = title
        } else {
          state.customTitles.push({path, title})
        }
        sessionStorage.setItem(process.env.VUE_APP_TBAS_TITLES_KEY, JSON.stringify(state.customTitles))
      }
    }
  }
}
