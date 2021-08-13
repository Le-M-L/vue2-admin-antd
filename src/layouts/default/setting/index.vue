<template>
    <!-- 系统配置 抽屉 -->
    <Drawer v-if="!hideSetting" v-model="showSetting" placement="right">
        <div class="setting" slot="handler">
            <a-icon :type="showSetting ? 'close' : 'setting'" />
        </div>
        <Setting />
    </Drawer>
</template>

<script>
import Drawer from '@/components/tool/Drawer';
import Setting from './components/Setting' //设置
import { mapState } from 'vuex'

export default {
    name: 'LayoutSetting',
    components: {
        Drawer,
        Setting
    },
    data () {
        return {
            showSetting: false,
        }
    },
    computed: {
        ...mapState('setting', ['hideSetting'])
    }
}
</script>

<style lang="less" scoped>

</style>