/**
 * 该插件可根据菜单配置自动生成 ANTD menu组件
 * menuOptions示例：
 * [
 *  {
 *    name: '菜单名称',
 *    path: '菜单路由',
 *    meta: {
 *      icon: '菜单图标',
 *      invisible: 'boolean, 是否不可见, 默认 false',
 *    },
 *    children: [子菜单配置]
 *  },
 *  {
 *    name: '菜单名称',
 *    path: '菜单路由',
 *    meta: {
 *      icon: '菜单图标',
 *      invisible: 'boolean, 是否不可见, 默认 false',
 *    },
 *    children: [子菜单配置]
 *  }
 * ]
 **/
import Menu from 'ant-design-vue/es/menu'
import Icon from 'ant-design-vue/es/icon'
import fastEqual from 'fast-deep-equal'
const {Item, SubMenu} = Menu

export default {
  name: 'IMenu',
  props: {
    options: {
      type: Array,
      required: true
    },
    theme: {
      type: String,
      required: false,
      default: 'dark'
    },
    mode: {
      type: String,
      required: false,
      default: 'inline'
    },
    collapsed: {
      type: Boolean,
      required: false,
      default: false
    },
    openKeys: Array
  },
  data () {
    return {
      selectedKeys: [],
      sOpenKeys: [],
      cachedOpenKeys: []
    }
  },
  computed: {
    menuTheme() { //主题
      return this.theme == 'light' ? this.theme : 'dark'
    }
  },
  created () {
    this.updateMenu()
    if (this.options.length > 0 && !this.options[0].fullPath) {
      this.formatOptions(this.options, '')
    }
  },
  watch: {
    options(val) {
      if (val.length > 0 && !val[0].fullPath) {
        this.formatOptions(this.options, '')
      }
    },
    collapsed (val) {
      if (val) {
        this.cachedOpenKeys = this.sOpenKeys
        this.sOpenKeys = []
      } else {
        this.sOpenKeys = this.cachedOpenKeys
      }
    },
    '$route': function () {
      this.updateMenu()
    },
    sOpenKeys(val) {
      this.$emit('openChange', val)
      this.$emit('update:openKeys', val)
    }
  },
  methods: {
    renderIcon: function (h, icon, key) {
      if (this.$scopedSlots.icon && icon && icon !== 'none') {
        const vnodes = this.$scopedSlots.icon({icon, key})
        vnodes.forEach(vnode => {
          vnode.data.class = vnode.data.class ? vnode.data.class : []
          vnode.data.class.push('anticon')
        })
        return vnodes
      }
      return !icon || icon == 'none' ? null : h(Icon, {props: {type:  icon}})
    },
    renderMenuItem: function (h, menu) {
      let tag = 'router-link'
      let config = {props: {to: menu.fullPath}, attrs: {style: 'overflow:hidden;white-space:normal;text-overflow:clip;'}}
      if (menu.meta && menu.meta.link) {
        tag = 'a'
        config = {attrs: {style: 'overflow:hidden;white-space:normal;text-overflow:clip;', href: menu.meta.link, target: '_blank'}}
      }
      return h(
        Item, {key: menu.fullPath},
        [
          h(tag, config,
            [
              this.renderIcon(h, menu.meta ? menu.meta.icon : 'none', menu.fullPath),
              menu.name
            ]
          )
        ]
      )
    },
    renderSubMenu: function (h, menu) {
      let this_ = this
      let subItem = [h('span', {slot: 'title', attrs: {style: 'overflow:hidden;white-space:normal;text-overflow:clip;'}},
        [
          this.renderIcon(h, menu.meta ? menu.meta.icon : 'none', menu.fullPath),
          menu.name
        ]
      )]
      let itemArr = []
      menu.children.forEach(function (item) {
        itemArr.push(this_.renderItem(h, item))
      })
      return h(SubMenu, {key: menu.fullPath},
        subItem.concat(itemArr)
      )
    },
    renderItem: function (h, menu) {
      const meta = menu.meta
      if (!meta || !meta.invisible) { //是否显示菜单栏
        let renderChildren = false
        const children = menu.children
        if (children != undefined) {
          for (let i = 0; i < children.length; i++) {
            const childMeta = children[i].meta
            if (!childMeta || !childMeta.invisible) { //是否显示子菜单
              renderChildren = true
              break
            }
          }
        }
        return (menu.children && renderChildren) ? this.renderSubMenu(h, menu) : this.renderMenuItem(h, menu)
      }
    },
    renderMenu: function (h, menuTree) {
      let this_ = this
      let menuArr = []
      menuTree.forEach(function (menu, i) {
        menuArr.push(this_.renderItem(h, menu, '0', i))
      })
      return menuArr
    },
    //格式化路由
    formatOptions(options, parentPath) {
      options.forEach(route => {
        let isFullPath = route.path.substring(0, 1) == '/'
        route.fullPath = isFullPath ? route.path : parentPath + '/' + route.path
        if (route.children) {
          this.formatOptions(route.children, route.fullPath)
        }
      })
    },
    updateMenu () {
      const matchedRoutes = this.$route.matched.filter(item => item.path !== '')
      this.selectedKeys = this.getSelectedKey(this.$route)
      let openKeys = matchedRoutes.map(item => item.path) //获取所有地址
      openKeys = openKeys.slice(0, openKeys.length -1) //获取前两个数据
      if (!fastEqual(openKeys, this.sOpenKeys)) { //对比
        this.collapsed || this.mode === 'horizontal' ? this.cachedOpenKeys = openKeys : this.sOpenKeys = openKeys
      }
    },
    getSelectedKey (route) {
      return route.matched.map(item => item.path)
    }
  },
  render (h) {
    console.log(Menu)
    return h(
      Menu,
      {
        props: {
          theme: this.menuTheme, //主题
          mode: this.$props.mode, //菜单类型
          selectedKeys: this.selectedKeys, //当前选中的菜单项 key 数组
          openKeys: this.openKeys ? this.openKeys : this.sOpenKeys, //当前展开的 SubMenu 菜单项 key 数组
        },
        on: {
          'update:openKeys': (val) => { //监听展开key的变化重新赋值
            this.sOpenKeys = val
          },
          click: (obj,key,) => {             // 点击更新选中菜单
            console.log(obj,key)
            obj.selectedKeys = [obj.key]
            this.$emit('select', obj)
          }
        }
      }, this.renderMenu(h, this.options)
    )
  }
}
