<template>
  <div id="app">
      <router-view />
      <FootGuide v-show="$route.meta.showFooter" />
  </div>
</template>

<script>
import FootGuide from './components/FootGuide/FootGuide.vue'
import {mapActions} from 'vuex'

export default {
  name: 'App',

  // 
  // 测试代理服务器
  mounted() {
    // this.$store.dispatch('getAddress')
    this.getAddress();
    this.getUserInfo();
  },
  components: {
    FootGuide
  },
  methods: {
    ...mapActions(['getAddress','getUserInfo'])
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  body 
    // margin-left 0
    // margin-right 0
    margin 0 0
  .app
    width 100%
</style>