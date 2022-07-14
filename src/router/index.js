/* 
路由器模块
 */
// 1.引入vue和vue-router
import Vue from 'vue'
import VueRouter from 'vue-router'

// 4.引入路由组件
// // import Msite from '../pages/MsiteGuide/MsiteGuide.vue'
// import Order from '../pages/OrderGuide/OrderGuide.vue'
// import Search from '../pages/SearchGuide/SearchGuide.vue'
// import Profile from '../pages/ProfileGuide/ProfileGuide.vue'

import Login from '../pages/LoginGuide/LoginGuide.vue'
import ShopGuide from '../pages/Shop/ShopGuide.vue'
import ShopGoods from '../pages/Shop/ShopGoods/ShopGoods.vue'
import ShopRatings from '../pages/Shop/ShopRatings/ShopRatings.vue'
import ShopInfo from '../pages/Shop/ShopInfo/ShopInfo.vue'


// 路由组件懒加载：将路由的引入方式转换成函数引入的方式
const Msite = () => import('../pages/MsiteGuide/MsiteGuide.vue')
const Order = () => import('../pages/OrderGuide/OrderGuide.vue')
const Search = () => import('../pages/SearchGuide/SearchGuide.vue')
const Profile = () => import('../pages/ProfileGuide/ProfileGuide.vue')

// 2.声明使用插件
Vue.use(VueRouter);

export default new VueRouter ({
    // 3。配置所有路由，用routers数组
    routes: [
        {
            path:'/msite',
            component: Msite, // 返回路由组件的函数， 只有执行此函数才会加载路由组件。这个函数在请求对应的路由路径的时候才会执行
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
        },
        // 商家店铺路由组件
        {
            path: '/shop',
            component: ShopGuide,
            // 里面包含三个子路由
            children: [
                {
                    // 子路由路径不加 /
                    path: 'goods',
                    component: ShopGoods
                },
                {
                    // 子路由路径不加 /
                    path: 'ratings',
                    component: ShopRatings
                },
                {
                    // 子路由路径不加 /
                    path: 'info',
                    component: ShopInfo
                },
                //设置一个默认的子路由
                {
                    path:'',
                    redirect:'goods'
                }
            ]
        }
    ]
})