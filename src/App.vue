<template>
  <div id="app">
      <router-view />
      <FootGuide v-show="$route.meta.showFooter" />
  </div>
</template>

<script>
import FootGuide from './components/FootGuide/FootGuide.vue'

export default {
  name: 'App',
  components: {
    FootGuide
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  
</style>
