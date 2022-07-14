/* 
通过mutations更新state的多个方法对象
 */

import {
    RECEIVE_ADDRESS,
    RECEIVE_CATEGORYS,
    RECEIVE_SHOPS,
    RECEIVE_USER_INFO,
    RESET_USER_INFO,

    // 用于接收每个商家的信息
    RECEIVE_GOODS,
    RECEIVE_RATINGS,
    RECEIVE_INFO,

    // 用于更新food
    INCREMENTt_FOOD_COUNT,
    DECREMENTt_FOOD_COUNT,

    // 清空购物车
    CLEAR_CART,

    // 搜索得到的商家列表
    RECEIVE_SEARCH_SHOPS
} from './mutations-types'
// 引入api接口函数
import {
    reqAddress,
    reqFoodCategorys,
    reqShops,
    reqUserInfo,
    reqLogout,
    reqShopGoods,
    reqShopInfo,
    reqShopRatings,
    reqSearchShop
} from '../api'

export default {
    //  异步获取地址：发送ajax获取数据，其中reqAddress是提前定义好的接口函数，查看接口函数是否需要传输参数
    async getAddress({ commit, state }) {
        //发送异步ajax请求
        const geohash = state.latitude + ',' + state.longitude;
        // 获取响应数据,有两种方法:promise.then;或者 async,await接收数据
        const result = await reqAddress(geohash);
        // 提交一个mutation
        if (result.code === 0) {
            const address = result.data;
            commit(RECEIVE_ADDRESS, { address });
        }
    },
    //  异步获取食品分类列表
    async getCategorys({ commit }) {
        //发送异步ajax请求
        // 获取响应数据,有两种方法:promise.then;或者 async,await接收数据
        const result = await reqFoodCategorys();
        // 提交一个mutation
        if (result.code === 0) {
            const categorys = result.data;
            commit(RECEIVE_CATEGORYS, { categorys });
        }
    },
    //  异步获取商家列表
    async getShops({ commit, state }) {
        //发送异步ajax请求
        const { longitude, latitude } = state;
        // 获取响应数据,有两种方法:promise.then;或者 async,await接收数据
        const result = await reqShops(longitude, latitude);
        // 提交一个mutation
        if (result.code === 0) {
            const shops = result.data;
            commit(RECEIVE_SHOPS, { shops });
        }
    },

    // 同步获取用户信息
    recordUser({ commit }, userInfo) {
        commit(RECEIVE_USER_INFO, { userInfo });
    },

    // 异步获取用户的信息
    async getUserInfo({ commit }) {
        // 获取用户信息
        const result = await reqUserInfo();
        // 然后判断是否获取成功
        if (result.code === 0) {
            // 取出获得的数据
            const userInfo = result.data;
            // 则利用commit更新state的信息
            commit(RECEIVE_USER_INFO, { userInfo });
        }
    },

    // 异步请求退出
    async logOut({ commit }, userInfo) {
        const result = await reqLogout();
        if (result.code === 0) {
            commit(RESET_USER_INFO, { userInfo });
        }
    },

    // 异步获取商家食品信息
    async getShopGoods({ commit }, callback) {
        const result = await reqShopGoods();
        if (result.code === 0) {
            const goods = result.data;
            // 更新
            commit(RECEIVE_GOODS, { goods });
            // 数据更新了，通知组件。
            // 同时在数据更新之后，执行回调函数
            // 只有传递了回调函数的才会执行
            callback && callback();
        }
    },

    // 异步获取商家评价信息
    async getShopRatings({ commit }, callback) {
        const result = await reqShopRatings();
        if (result.code === 0) {
            const ratings = result.data;
            // 更新
            commit(RECEIVE_RATINGS, { ratings });
            // 数据更新了，通知组件。
            // 同时在数据更新之后，执行回调函数
            // 只有传递了回调函数的才会执行
            callback && callback();
        }
    },

    // 异步获取商家信息
    async getShopInfo({ commit }) {
        const result = await reqShopInfo();
        if (result.code === 0) {
            const info = result.data;
            // 更新
            commit(RECEIVE_INFO, { info });
        }
    },

    // 同步修改food中的值
    updateFoodCount({commit}, {isAdd, food}) {
        if(isAdd) {//如果点击加号
            commit(INCREMENTt_FOOD_COUNT, {food})
        }else {
            commit(DECREMENTt_FOOD_COUNT, {food})
        }
    },

    // 同步清空CartFoods里面的内容
    clearCart({commit}) {
        commit(CLEAR_CART)
    },

    // 异步接收搜索得到的商家信息列表
    async searchShops({commit, state}, keyword) {
        // 由于接口函数传入的参数，geohash在state中，所以需要接收ustate参数
        const geohash = state.latitude + ',' + state.longitude;
        const result = await reqSearchShop(geohash, keyword)
        if(result.code === 0) {
            const searchShops = result.data
            commit(RECEIVE_SEARCH_SHOPS, {searchShops})
        }
    }
}