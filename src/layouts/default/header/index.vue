<template>
      <LayoutHeader :class="[headerTheme, 'admin-header']">
    <div :class="['admin-header-wide', layout, pageWidth]">
      <router-link v-if="isMobile || layout === 'head'" to="/" :class="['logo', isMobile ? null : 'pc', headerTheme]">
        <img width="32" src="@/assets/img/logo.png" />
        <h1 v-if="!isMobile">{{systemName}}</h1>
      </router-link>
      <a-divider v-if="isMobile" type="vertical" />
      <a-icon v-if="layout !== 'head'" class="trigger" :type="collapsed ? 'menu-unfold' : 'menu-fold'" @click="toggleCollapse"/>
      <div v-if="layout !== 'side' && !isMobile" class="admin-header-menu" :style="`width: ${menuWidth};`">
        <i-menu class="head-menu" :theme="headerTheme" mode="horizontal" :options="menuData" @select="onSelect"/>
      </div>
      <div :class="['admin-header-right', headerTheme]">
          <header-search class="header-item" @active="val => searchActive = val" />
          <header-notice class="header-item"/>
          <header-avatar class="header-item"/>
      </div>
    </div>
  </LayoutHeader>
</template>

<script>
import { Layout } from "ant-design-vue"
import HeaderSearch from './components/HeaderSearch'
import HeaderNotice from './components/HeaderNotice'
import HeaderAvatar from './components/HeaderAvatar'
import IMenu from '@/components/menu/menu'
import {mapState} from 'vuex'

export default {
  name: 'AdminHeader',
  components: {IMenu, HeaderAvatar, HeaderNotice, HeaderSearch ,LayoutHeader:Layout.Header},
  props: ['collapsed', 'menuData'],
  data() {
    return {
      searchActive: false
    }
  },
  computed: {
    ...mapState('setting', ['theme', 'isMobile', 'layout', 'systemName', 'lang', 'pageWidth']),
    headerTheme () {
      if (this.layout == 'side' && this.theme.mode == 'dark' && !this.isMobile) {
        return 'light'
      }
      return this.theme.mode
    },
    menuWidth() {
      const {layout, searchActive} = this
      const headWidth = layout === 'head' ? '100% - 188px' : '100%'
      const extraWidth = searchActive ? '600px' : '400px'
      return `calc(${headWidth} - ${extraWidth})`
    }
  },
  methods: {
    toggleCollapse () {
      this.$emit('toggleCollapse')
    },
    onSelect (obj) {
      this.$emit('menuSelect', obj)
    },
  }
}
</script>

<style lang="less" scoped>
@import "index";
</style>
