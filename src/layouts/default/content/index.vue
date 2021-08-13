<template>
    <LayoutContent class="admin-layout-content" :style="`min-height: ${minHeight}px;`">
        <slot></slot>
    </LayoutContent>
</template>

<script>
import { Layout } from "ant-design-vue"
import { mapMutations } from "vuex"

export default {
    components: { LayoutContent: Layout.Content },
    data () {
        return {
            minHeight: window.innerHeight - 64 - 122,
        }
    },
    created() {
        this.correctPageMinHeight(this.minHeight - 24)
        
    },
    methods:{
        ...mapMutations('setting', ['correctPageMinHeight']),

    },
     beforeDestroy () {
        this.correctPageMinHeight(-this.minHeight + 24)
    }
}
</script>

<style>
</style>