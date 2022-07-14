<template>
  <div>
    <div class="shopcart">
      <div class="content">
        <div class="content-left" @click="toggleShow">
          <div class="logo-wrapper">
            <!-- 当totalCount大于0的时候，购物车具有高亮的类 -->
            <div class="logo" :class="{highlight: totalCount}">
              <i class="iconfont icon-shopping_cart highlight" ></i>
            </div>
            <div class="num">{{totalCount}}</div>
          </div>
          <div class="price" :class="{highlight: totalCount}">￥{{totalPrice}}</div>
          <div class="desc">另需配送费￥{{info.deliveryPrice}}元</div>
        </div>
        <div class="content-right">
          <div class="pay" :class="payClass">
            <!-- 根据不同金额，显示不同的内容 -->
            {{payText}}
          </div>
        </div>
      </div>
      
      <!-- 给购物车添加动画效果 -->
      <transition name="move">
        <div class="shopcart-list" v-show="isShow">
            <div class="list-header">
              <h1 class="title">购物车</h1>
              <span class="empty" @click="clearCart">清空</span>
            </div>
            <div class="list-content">
              <ul style="padding-left: 0">
                <li class="food" style="list-style:none " v-for="(food, index) in cartFoods" :key="index">
                  <span class="name">{{food.name}}</span>
                  <div class="price"><span>￥{{food.price}}</span></div>
                  <div class="cartcontrol-wrapper">
                    <CartControl :food="food"/>
                  </div>
                </li>
              </ul>
            </div>
        </div>
      </transition>
        

    </div>
    <!-- 遮罩也有显示和隐藏 -->
    <div class="list-mask" v-show="isShow" @click="toggleShow"></div>
  </div>
</template>

<script>
// 引入购物车的食物数据
import {mapState, mapGetters} from 'vuex'
import CartControl from '../CartControl/CartControl.vue'
// 引入滑动的第三方库
import BScroll from 'better-scroll'
// 引入mint-UI显示清楚购物车的提示操作
import {MessageBox} from 'mint-ui'


export default {
  data() {
    return {
      isShow: false
    }
  },
  computed: {
    // cartFoods管理购物车中的食物信息
    // info管理购物车中商家的信息：起送、运费
    ...mapState(['cartFoods','info']),
    // 因为这两个属性是由state中cartFoods计算得到的
    ...mapGetters(['totalCount', 'totalPrice']),
    payClass() {
      // 首先，取出两个数据
      const {totalPrice} = this;
      const {minPrice} = this.info;
      
      return totalPrice >= minPrice ? 'enough' : 'not-enough'
    },
    payText() {
      const {totalPrice} = this;
      const {minPrice} = this.info;
      if(totalPrice === 0) {
        return `￥${minPrice}元起送`
      } else if(totalPrice < minPrice) {
        return `还差￥${minPrice - totalPrice}元起送`
      }else {
        return `结算`
      }
    },
  },
  methods: {
    toggleShow() {
      // 切换显示和隐藏
      // 只有总数量大于0的时候，才切换
      if(this.totalCount > 0) {
        this.isShow = !this.isShow;
      }
    },
    // 清空购物车
    clearCart() {
      MessageBox.confirm('确认清空购物车吗？').then(
        action => {
          if(action === 'confirm') {
            // 需要经过vuex管理来清除购物车的选项
            this.$store.dispatch('clearCart');
          } else {
            // 取消
              console.log('取消清空');
          }
          
        }
      )
    }
  },
  components: {
    CartControl
  },
  watch: {
    totalCount: function() {
      // 如果总数量为0，直接不显示
      if(this.totalCount === 0){
        // 还需要先改变isShow
        // console.log('购物车的总数量为0');
        this.isShow = false
        return false
      }
    },
    isShow: function(){
      // 展示列表的时候，开启滑动效果
      if(this.isShow) {
        // 如果显示了，则启动滑动效果
        this.$nextTick(() => {//当页面刷新的时候
          // 注意！只创建一个单例对象
          // 在创建改BScroll实例之前，先判断scroll实例是否存在
          // 如果不存在，则创建一个
          if(!this.scroll) {
            this.scroll = new BScroll('.list-content', {
              scrollY: true,
              click: true,
            })
          }  else {// 如果已经存在，则让滚动条刷新一下，重新统计高度
            this.scroll.refresh()
          }
        })
      }
      // 如果不为0，则按照isShow进行
      return this.isShow
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../common/stylus/mixins.styl"

  .shopcart
    position fixed
    left 0
    bottom 0
    z-index 50
    width 100%
    height 48px
    .content
      display flex
      background #141d27
      font-size 0
      color rgba(255, 255, 255, 0.4)
      .content-left
        flex 1
        .logo-wrapper
          display inline-block
          vertical-align top
          position relative
          top -10px
          margin 0 12px
          padding 6px
          width 56px
          height 56px
          box-sizing border-box
          border-radius 50%
          background #141d27
          .logo
            width 100%
            height 100%
            border-radius 50%
            text-align center
            background #2b343c
            &.highlight
              background $green
            .icon-shopping_cart
              line-height 44px
              font-size 24px
              color #80858a
              &.highlight
                color #fff
          .num
            position absolute
            top 0
            right 0
            width 24px
            height 16px
            line-height 16px
            text-align center
            border-radius 16px
            font-size 9px
            font-weight 700
            color #ffffff
            background rgb(240, 20, 20)
            box-shadow 0 4px 8px 0 rgba(0, 0, 0, 0.4)
        .price
          display inline-block
          vertical-align top
          margin-top 5px
          line-height 24px
          padding-right 12px
          box-sizing border-box
          font-size 16px
          font-weight 700
          color #fff
          &.highlight
            color #fff
        .desc
          display inline-block
          vertical-align bottom
          margin-bottom 15px
          margin-left -45px
          font-size 10px
      .content-right
        flex 0 0 105px
        width 105px
        .pay
          height 48px
          line-height 48px
          text-align center
          font-size 12px
          font-weight 700
          color #fff
          &.not-enough
            background #2b333b
          &.enough
            background #00b43c
            color #fff
    .ball-container
      .ball
        position fixed
        left 32px
        bottom 22px
        z-index 200
        transition all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41)
        .inner
          width 16px
          height 16px
          border-radius 50%
          background $green
          transition all 0.4s linear
    .shopcart-list
      position absolute
      left 0
      top 0
      z-index -1
      width 100%
      // 让购物车列表向上移动 内容高度的距离
      transform translateY(-100%)
      &.move-enter-active, &.move-leave-active
        transition transform .3s
        // 隐藏时候的样式
      &.move-enter, &.move-leave-to
        transform translateY(0)
      .list-header
        height 40px
        line-height 40px
        padding 0 18px
        background #f3f5f7
        border-bottom 1px solid rgba(7, 17, 27, 0.1)
        .title
          float left
          font-size 14px
          line-height 20px
          color rgb(7, 17, 27)
        .empty
          float right
          font-size 12px
          color rgb(0, 160, 220)

      .list-content
        padding 0 18px
        max-height 217px
        overflow hidden
        background #fff
        .food
          position relative
          padding 12px 0
          box-sizing border-box
          bottom-border-1px(rgba(7, 17, 27, 0.1))
          .name
            line-height 24px
            font-size 14px
            color rgb(7, 17, 27)
          .price
            position absolute
            right 90px
            bottom 12px
            line-height 24px
            font-size 14px
            font-weight 700
            color rgb(240, 20, 20)
          .cartcontrol-wrapper
            position absolute
            right 0
            bottom 6px

  .list-mask
    position fixed
    top 0
    left 0
    width 100%
    height 100%
    z-index 40
    backdrop-filter blur(10px)
    opacity 1
    background rgba(7, 17, 27, 0.6)
    &.fade-enter-active, &.fade-leave-active
      transition all 0.5s
    &.fade-enter, &.fade-leave-to
      opacity 0
      background rgba(7, 17, 27, 0)
</style>