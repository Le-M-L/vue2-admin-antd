<template>
  <page-layout :avatar="currUser.avatar">

    <div slot="headerContent">
      <div class="title">下午好，{{currUser.name}}，准备吃点什么</div>
      <div>{{currUser.position.name}}</div>
    </div>
   <div style="background:#fff">

      <Api />
   </div>
  </page-layout>
</template>

<script>
import PageLayout from '@/layouts/PageLayout' //最外部 用于面包削
import Api from '@/pages/dashboard/workplace/Api'
import {mapState} from 'vuex'

export default {
  name: 'WorkPlace',
  components: { Api, PageLayout},
  data () {
    return {
      projects: [],
      loading: true,
      activities: [],
      teams: [],
      welcome: {
        timeFix: '',
        message: ''
      }
    }
  },
  computed: {
    ...mapState('account', {currUser: 'user'}),
  },
  created() {
    console.log(this.currUser)
  }
}
</script>

<style scoped lang="less">
@import "index";
</style>
