import Vue from 'vue'
import App from './App.vue'

// 引入路由器
import router from './router'
// // 引入swiper
// import VueAwesomeSwiper from 'vue-awesome-swiper'
// import 'swiper/css/swiper.css'

// // 使用插件
// Vue.use(VueAwesomeSwiper);
 
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  // 配置router
  router
}).$mount('#app')
