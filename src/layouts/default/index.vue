<template>
    <!-- theme 主题颜色配置 -->
    <Layout :class="['admin-layout', 'beauty-scroll']">
   
        <!-- 正常侧边栏 -->
        <LayoutSider  :sideMenuWidth="sideMenuWidth" :collapsed="collapsed" @toggleCollapse="toggleCollapse" />
        <!-- 系统配置 抽屉 -->
        <LayoutSetting/>

        <Layout class="admin-layout-main beauty-scroll">
            <!-- 内容头部 部分 -->
            <AdminHeader
                :class="[{ 'fixed-tabs': fixedTabs, 'fixed-header': fixedHeader, 'multi-page': multiPage }]"
                :style="headerStyle"
                :menuData="headMenuData"
                :collapsed="collapsed"
                @toggleCollapse="toggleCollapse"
            />
            <!-- 用来计算高度 -->
            <LayoutHeader
                :class="[
                    'virtual-header',
                    { 'fixed-tabs': fixedTabs, 'fixed-header': fixedHeader, 'multi-page': multiPage },
                ]"
                v-show="fixedHeader"
            ></LayoutHeader>
            <LayoutContent>
                <div style="position: relative">
                    <slot></slot>
                </div>
            </LayoutContent>
            <!-- 登录页的页脚 -->
            <PageFooter />
        </Layout>
    </Layout>
</template>

<script>
import { Layout } from 'ant-design-vue';
import LayoutSetting from './setting' //设置
import AdminHeader from './header'
import PageFooter from './footer'
import LayoutContent from "./content"
import LayoutSider from "./sider" //侧边栏
import { mapState,  mapGetters } from 'vuex'

export default {
    name: 'AdminLayout',
    components: { Layout,  LayoutSider, LayoutSetting, AdminHeader, LayoutHeader: Layout.Header, LayoutContent, PageFooter },
    data () {
        return {
            collapsed: false,
            showSetting: false,
        }
    },
    provide () {
        return {
            adminLayout: this
        }
    },
    computed: {
        ...mapState('setting', ['isMobile', 'layout', 'fixedHeader', 
            'fixedTabs',  'multiPage']),
        ...mapGetters('setting', ['firstMenu', 'subMenu', 'menuData']),
        sideMenuWidth () {
            return this.collapsed ? '80px' : '256px'
        },
        headerStyle () {
            let width = (this.fixedHeader && this.layout !== 'head' && !this.isMobile) ? `calc(100% - ${this.sideMenuWidth})` : '100%'
            let position = this.fixedHeader ? 'fixed' : 'static'
            return `width: ${width}; position: ${position};`
        },
        headMenuData () {
            const { layout, menuData, firstMenu } = this
            return layout === 'mix' ? firstMenu : menuData
        },
    },
    methods: {
        toggleCollapse () {
            this.collapsed = !this.collapsed
        },
    },

};
</script>

<style lang="less" >
.admin-layout {
    .side-menu {
        &.fixed-side {
            position: fixed;
            height: 100vh;
            left: 0;
            top: 0;
        }
    }
    .virtual-side {
        transition: all 0.2s;
    }
    .virtual-header {
        transition: all 0.2s;
        opacity: 0;
        &.fixed-tabs.multi-page:not(.fixed-header) {
            height: 0;
        }
    }
    .admin-layout-main {
        .admin-header {
            top: 0;
            right: 0;
            overflow: hidden;
            transition: all 0.2s;
            &.fixed-tabs.multi-page:not(.fixed-header) {
                height: 0;
            }
        }
    }
    .admin-layout-content {
        padding: 24px 24px 0;
        /*overflow-x: hidden;*/
        /*min-height: calc(100vh - 64px - 122px);*/
    }
    .setting {
        background-color: @primary-color;
        color: @base-bg-color;
        border-radius: 5px 0 0 5px;
        line-height: 40px;
        font-size: 22px;
        width: 40px;
        height: 40px;
        box-shadow: -2px 0 8px @shadow-color;
    }
}
</style>
