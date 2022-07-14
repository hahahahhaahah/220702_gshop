import Vue from 'vue'
import App from './App.vue'

// 引入路由器
import router from './router'
// 引入vuex
import store from './store'
// 引入mint-ui库的Button
import {Button } from 'mint-ui'
// 引入mockserver
import './mock/mockServer' //加载mockserver
// 引入图片懒加载的插件
// import VueLazyload from 'vue-lazyload'
// 引入使用的图片
import loading from './common/images/loading.gif'

// 加载过滤器
import './filters'

import Vant, {Lazyload} from 'vant'
import 'vant/lib/index.css'

// 使用插件
Vue.use(Vant)
Vue.use(Lazyload, {
  //内部会自定义一个指令 v-lazy
  // 引入图片
  loading
})


// 注册全局组件标签
Vue.component(Button.name, Button);  //此时， <mt-button>可以全局使用

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  // 配置router
  router,
  store
}).$mount('#app')
