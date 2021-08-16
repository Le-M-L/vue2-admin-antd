<template>
    <div>
        <!-- 屏幕小于 769测侧边栏 显示 -->
        <Drawer v-if="isMobile" v-model="drawerOpen">
            <SideMenu
                :theme="theme.mode"
                :menuData="menuData"
                :collapsed="false"
                :collapsible="false"
                @menuSelect="onMenuSelect"
            />
        </Drawer>
        <!-- 正常侧边栏 -->
        <SideMenu
            :class="[fixedSideBar ? 'fixed-side' : '']"
            :theme="theme.mode"
            v-else-if="layout === 'side' || layout === 'mix'"
            :menuData="sideMenuData"
            :collapsed="collapsed"
            :collapsible="true"
        />
        <div
            v-if="fixedSideBar && !isMobile"
            :style="`width: ${sideMenuWidth}; min-width: ${sideMenuWidth};max-width: ${sideMenuWidth};`"
            class="virtual-side"
        ></div>
    </div>
</template>

<script>
import Drawer from '@/components/tool/Drawer';
import SideMenu from '@/components/menu/SideMenu' //侧边栏
import { mapState, mapGetters, mapMutations } from 'vuex'

export default {
    components: { SideMenu, Drawer },
    props: ['collapsed', 'sideMenuWidth'],
    computed: {
        ...mapState('setting', ['theme', 'layout', 'fixedSideBar', 'isMobile']),
        ...mapGetters('setting', ['firstMenu', 'subMenu', 'menuData']),
        sideMenuData () {
            const { layout, menuData, subMenu } = this
            return layout === 'mix' ? subMenu : menuData
        }
    },
    data () {
        return {
            drawerOpen: false,
        }
    },
    watch: {
        $route (val) {
            this.setActivated(val)
        },
        layout () {
            this.setActivated(this.$route)
        },
        isMobile (val) {
            if (!val) {
                this.drawerOpen = false
            }
        },
    },
    created () {
        this.setActivated(this.$route)
    },
    methods: {
        ...mapMutations('setting', ['setActivatedFirst']),
        onMenuSelect () {
            this.$emit('toggleCollapse')
        },
        setActivated (route) {
            if (this.layout === 'mix') {
                let matched = route.meta.openKeys;
                const { firstMenu } = this
                for (let menu of firstMenu) {
                    if (matched.findIndex(item => item === menu.fullPath) !== -1) {
                        console.log(menu.fullPath);
                        this.setActivatedFirst(menu.fullPath)
                        break
                    }
                }
            }
        }
    }
}
</script>

<style lang="less" scoped>

</style>