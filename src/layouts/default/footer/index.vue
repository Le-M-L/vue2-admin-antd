<template>
    <LayoutFooter style="padding: 0px" >
        <div class="footer">
            <div class="links">
                <a
                    target="_blank"
                    :key="index"
                    :href="item.link ? item.link : 'javascript: void(0)'"
                    v-for="(item, index) in footerLinks"
                >
                    <a-icon v-if="item.icon" :type="item.icon" />{{ item.name }}
                </a>
            </div>
            <div class="copyright"> Copyright<a-icon type="copyright" />{{ copyright }} </div>
        </div>
    </LayoutFooter>
</template>

<script>
import { Layout } from "ant-design-vue"
import { mapState } from 'vuex'

export default {
    name: 'PageFooter',
    components: {
        LayoutFooter: Layout.Footer
    },
    computed:{
        ...mapState('setting',['footerLinks','copyright'])
    }
}
</script>

<style lang="less" scoped>
.footer {
    padding: 48px 16px 24px;
    /*margin: 48px 0 24px;*/
    text-align: center;
    .copyright {
        color: @text-color-second;
        font-size: 14px;
        i {
            margin: 0 4px;
        }
    }
    .links {
        margin-bottom: 8px;
        a:not(:last-child) {
            margin-right: 40px;
        }
        a {
            color: @text-color-second;
            -webkit-transition: all 0.3s;
            transition: all 0.3s;
        }
    }
}
</style>
