<template>
    <div>
        <BasicForm :formItems="schemas" :formModel="formModel" />
    </div>
</template>

<script>
import { BasicForm } from "@/components/Form"
import { mapState } from 'vuex'
import { formSchema } from "./config"
export default {
    name: 'WorkPlace',
    components: { BasicForm },
    data () {
        return {
            projects: [],
            loading: true,
            activities: [],
            teams: [],
            welcome: {
                timeFix: '',
                message: ''
            },
            registerForm: null,
            methods: null,
            schemas:formSchema,
            formModel:{}
        }
    },
    computed: {
        ...mapState('account', { currUser: 'user' }),
    },
    created () {
    },
    methods: {

    },
}
</script>

<style scoped lang="less">
@import 'index';
</style>
