<template>
  <div>
    <section class="msite">
        <!--首页头部-->
        <HeaderTop :title="address.name">
          <!-- 还要将两个插槽的内容进行填充 -->
          <router-link class="header_search" slot="left" to="/search" style="text-decoration: none">
            <i class="iconfont icon-sousuo"></i>
          </router-link>
          <router-link class="header_login" style="text-decoration: none" slot="right" :to="userInfo._id ? '/userinfo' : '/profile'">
            <!-- 如果没有登录，则显示登陆|注册 -->
            <span class="header_login_text"  v-if="!userInfo._id">登录|注册</span>
            <!-- 如果登陆了，则显示一个头像 -->
            <span class="header_login_text" v-else>
              <i class="iconfont icon-person" ></i>
            </span>
            
          </router-link>
        </HeaderTop>
        <!--首页导航-->
        <nav class="msite_nav">
          <div class="swiper-container" v-if="categorys.length">
            <div class="swiper-wrapper">
              <!-- 页数需要便利食品列表的数组:每一页显示8个 -->
              <div class="swiper-slide" v-for="(categorys, index) in categorysArr" :key="index">
                <!-- 每一页要有一个数组显示食品 -->
                <a href="javascript:" class="link_to_food" v-for="(category, index) in categorys" :key="index">
                  <div class="food_container">
                    <img :src="baseImageUrl+category.image_url">
                  </div>
                  <span>{{category.title}}</span>
                </a>                
              </div>
            </div>
            <!-- Add Pagination -->
            <div class="swiper-pagination"></div>
          </div>
          <img src="./images/msite_back.svg" alt="back" v-else>
        </nav>
        <!--首页附近商家-->
        <div class="msite_shop_list">
          <div class="shop_header">
            <i class="iconfont icon-xuanxiang"></i>
            <span class="shop_header_title">附近商家</span>
          </div>
          <ShopList />
        </div>
    </section>
  </div>
</template>


<script>
import Swiper from 'swiper'
import 'swiper/css/swiper.css'
// 引入异步显示的内容
import {mapState} from 'vuex'

import HeaderTop from '../../components/HeaderTop/HeaderTop.vue'
import ShopList from '../../components/ShopList/ShopList.vue'

export default {
  data() {
    return {
      baseImageUrl: 'http://fuss10.elemecdn.com'
    }
  },
  components: {
    HeaderTop,
    ShopList
  },
  mounted(){
    //(1) 发请求获取数据显示
    this.$store.dispatch('getCategorys')
    // 获取商家列表
    this.$store.dispatch('getShops')
  },
  computed: {
    // 其中，address是为了显示头部的地址，categorys是为了获取食品分类的信息，userInfo是为了获取头部登录注册的信息
    ...mapState(['address','categorys','userInfo']),
    // 根据获得的categorys一维数组生成一个二维数组,其中小数组中的元素个数不能超过8个
    categorysArr() {
      const {categorys} = this;
      // 准备空的二维数组
      const arr =[];
      let minArr = [];
      // 遍历
      categorys.forEach(c => {
        // 如果小数组已经满了
        if(minArr.length === 8) {
          minArr =[];
        }
        // 如果minArr是空的,则将小数组保存到大数组中
        if(minArr.length === 0) {
          arr.push(minArr);
        }
        // 将当前分类保存到小数组中,并且小数组关联在大数组中
        minArr.push(c)
      });
      return arr
    }
  },
  watch: {
    categorys () {//categorys中有数据,在异步更新页面之前执行
      // 创建一个Swiper对象，利用￥nextTick当界面更新的时候触发
      this.$nextTick(() =>{
        new Swiper('.swiper-container',{
          loop: true,//可以循环播放
          // 如果需要分离器
          pagination:{
            el:'.swiper-pagination',
          }
        })
      })
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixins.styl"
    .msite  //首页
      width 100%
      .msite_nav
        bottom-border-1px(#e4e4e4)
        margin-top 45px
        height 200px
        background #fff
        .swiper-container
          width 100%
          height 100%
          .swiper-wrapper
            width 100%
            height 100%
            .swiper-slide
              display flex
              justify-content center
              align-items flex-start
              flex-wrap wrap
              .link_to_food
                text-decoration none
                width 25%
                .food_container
                  display block
                  width 100%
                  text-align center
                  padding-bottom 10px
                  font-size 0
                  img
                    display inline-block
                    width 50px
                    height 50px
                span
                  display block
                  width 100%
                  text-align center
                  font-size 13px
                  color #666
          .swiper-pagination
            >span.swiper-pagination-bullet-active
              background #02a774
      .msite_shop_list
        top-border-1px(#e4e4e4)
        margin-top 10px
        background #fff
        .shop_header
          padding 10px 10px 0
          .shop_icon
            margin-left 5px
            color #999
          .shop_header_title
            margin-left 10px
            color #999
            font-size 14px
            line-height 20px

</style>
