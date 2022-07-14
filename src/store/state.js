/* 
状态对象
 */
export default {
    latitude: 40.10038, //纬度
    longitude: 116.36867, //经度
    address: {}, //地址相关信息对象
    categorys: [], //食品分类数组
    shops: [], //商家数组
    userInfo: {}, //用户信息

    goods:[], //店铺食品信息
    ratings: [], //评价信息
    info: {}, //店铺信息

    cartFoods: [], //购物车中食品的列表，并且每个食物的count1必须大于0

    // 搜索商家列表的结果
    searchShops: [], //搜索得到的商家列表
}