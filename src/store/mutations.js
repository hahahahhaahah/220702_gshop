/* 
直接更新state的多个方法对象
 */
import Vue from 'vue'

import {
    RECEIVE_ADDRESS,
    RECEIVE_CATEGORYS,
    RECEIVE_SHOPS,
    RECEIVE_USER_INFO,
    RESET_USER_INFO,

    
    RECEIVE_GOODS,
    RECEIVE_RATINGS,
    RECEIVE_INFO,

    // 食物加减按钮
    INCREMENTt_FOOD_COUNT,
    DECREMENTt_FOOD_COUNT,

    // 清空购物车
    CLEAR_CART,

    // 搜索得到的商家信息
    RECEIVE_SEARCH_SHOPS
} from './mutations-types'

export default {
    [RECEIVE_ADDRESS](state, { address }) {
        state.address = address;
    },
    [RECEIVE_CATEGORYS](state, { categorys }) {
        state.categorys = categorys;
    },
    [RECEIVE_SHOPS](state, { shops }) {
        state.shops = shops;
    },
    [RECEIVE_USER_INFO](state, { userInfo }) {
        state.userInfo = userInfo;
    },
    [RESET_USER_INFO](state) {
        state.userInfo = {};
    },

    // 更新mockjs的数据
    [RECEIVE_GOODS](state, {goods}) {
        state.goods = goods;
    },
    [RECEIVE_RATINGS](state, {ratings}) {
        state.ratings = ratings;
    },
    [RECEIVE_INFO](state, {info}) {
        state.info = info;
    },

    // 更新购物食物的数量
    [INCREMENTt_FOOD_COUNT](state, {food}) {
        // 首先，food中没有count属性
        if(!food.count) {//第一次更新count
            // food.count =1; //不能实现数据绑定
            // 解决：利用Vue.set(对象，属性名，属性值)
            Vue.set(food, 'count', 1);

            // 第一次点击，除了新增属性外，还将改food添加到购物车列表中
            state.cartFoods.push(food)

        } else {//cartFoods可以更新
            food.count ++
        }
    },
    [DECREMENTt_FOOD_COUNT](state, {food}) {
        if(food.count) {//如果food中count > 0,即
            food.count --;

            // 当food.count == 0,则将food移除
            // 传入food的索引
            if(food.count === 0) {
                state.cartFoods.splice(state.cartFoods.indexOf(food), 1)
            }
            
        }
    },

    // 清空购物车
    [CLEAR_CART](state) {
        // 首先，应该清空每一种食物的count
        state.cartFoods.forEach(food => food.count = 0);
        // 移除购物车所有的选项
        state.cartFoods = [] //清空购物车
    },

    // 搜索得到的商家列表
    [RECEIVE_SEARCH_SHOPS](state, {searchShops}) {
        state.searchShops = searchShops
    }
}