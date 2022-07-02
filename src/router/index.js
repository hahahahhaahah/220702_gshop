/* 
路由器模块
 */
// 1.引入vue和vue-router
import Vue from 'vue'
import VueRouter from 'vue-router'

// 4.引入路由组件
import Msite from '../pages/MsiteGuide/MsiteGuide.vue'
import Order from '../pages/OrderGuide/OrderGuide.vue'
import Search from '../pages/SearchGuide/SearchGuide.vue'
import Profile from '../pages/ProfileGuide/ProfileGuide.vue'
import Login from '../pages/LoginGuide/LoginGuide.vue'


// 2.声明使用插件
Vue.use(VueRouter);

export default new VueRouter ({
    // 3。配置所有路由，用routers数组
    routes: [
        {
            path:'/msite',
            component: Msite,
            // 为了动态显示底部
            meta:{
                showFooter: true
            }
        },
        {
            path:'/order',
            component: Order,
            meta:{
                showFooter: true
            }
        },
        {
            path:'/search',
            component: Search,
            meta:{
                showFooter: true
            }
        },
        {
            path:'/profile',
            component: Profile,
            meta:{
                showFooter: true
            }
        },
        {
            path:'/login',
            component: Login
        },
        // 默认显示
        {
            path:'/',
            redirect:'/msite'
        }
    ]
})