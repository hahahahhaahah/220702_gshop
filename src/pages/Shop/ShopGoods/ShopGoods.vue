<template>
  <div>
    <div class="goods" >
      <div class="menu-wrapper">
        <ul style="padding-left: 0; margin-top: 0">
          <!--当前分类的类名： current-->
          <!-- 动态控制类名显示，利用计算属性currentIndex -->
          <li class="menu-item"  v-for="(good,index) in goods" :key="index" 
              :class="{current: index === currentIndex}" 
              @click="clickMenuItem(index)">
            <span class="text bottom-border-1px">
              <img class="icon" v-if="good.icon" :src="good.icon"/>
              {{good.name}}
            </span>
          </li>
        </ul>
      </div>
      <div class="foods-wrapper">
        <ul ref="foodsUl" style="padding-left: 0; margin-top: 0">
          <li class="food-list-hook" style="list-style: none"  v-for="(good,index) in goods" :key="index" >
            <!-- 代表分类的标题 -->
            <h1 class="title">{{good.name}}</h1>
            <ul style="padding-left: 0"> 
              <!--食物列表 -->
              <li class="food-item bottom-border-1px" v-for="(food, index) in good.foods" 
                  :key="index" @click="showFood(food)">
                <div class="icon">
                  <img width="57" height="57" :src="food.icon"/>
                </div>
                <div class="content">
                  <h2 class="name">{{food.name}}</h2>
                  <p class="desc">{{food.description}}</p>
                  <div class="extra">
                    <span class="count">月售{{food.sellCount}}份</span>
                    <span>好评率{{food.rating}}%</span>
                  </div>
                  <div class="price">
                    <span class="now" >￥{{food.price}}</span>
                    <span class="old"  v-if="food.oldPrice">￥{{food.oldPrice}}</span>
                  </div>
                  <div class="cartcontrol-wrapper">
                    <!-- 通过props，向子组件传递数据 -->
                    <CartControl :food="food" />
                  </div>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <ShopCart />
    </div>
    <FoodImg :food="food"  ref="food"/>
  </div>
</template>

<script>
import {mapState} from 'vuex'
// 引入滑动效果的第三方库
import BScroll from 'better-scroll'
import CartControl from '../../../components/CartControl/CartControl.vue'
// 引入food展示的图片
import FoodImg from '../../../components/FoodImg/FoodImg.vue'
// 引入购物车组件
import ShopCart from '../../../components/ShopCart/ShopCart.vue'

export default {
  data() {
    return {
      scrollY: 0, //右侧滑动的Y轴坐标
      tops:[],//所有右侧分类li的top组成的数组
      food: {}, //需要显示的food
    }
  },
  mounted() {
    // 1.用来获取mockjs的数据
    // this.$store.dispatch('getShopGoods'),
    // 用于滑动的时候，可以在获取异步数据的时候，传递一个回调函数；其中，回调函数是在数据更新之后执行
    this.$store.dispatch('getShopGoods', () => {//数据更新后执行该函数
      this.$nextTick(()=> { //列表数据更新显示后才执行，页面刷新完之后，再执行回调函数中的方法
        this._initScroll()
        this._iniTops()
      })
    })
    
  },
  computed : {
    // 2.读取数据
    ...mapState(['goods']),

    // 计算当前分类的下标
    currentIndex() {
      // 先得到条件数据
      const {scrollY, tops} = this;
      // 根据条件计算产生一个结果
      const index = tops.findIndex((top, index) => {
         return scrollY>= top && scrollY < tops[index+1]
      })
      // // 返回结果
      return index
    }
  },
  methods: {
    // 初始化滚动条
    _initScroll() {
        // 在列表显示之后，才创建滑动
        // const menuScroll = 
        new BScroll('.menu-wrapper', {
          scrollY: true,
          click: true,
        });
         this.foodScroll = new BScroll('.foods-wrapper',{
           scrollY: true,
           click: true,
           probeType: 3
         });

        // 给右侧列表绑定scroll监听,一滑动则不断更新
         this.foodScroll.on('scroll', ({x,y}) => {
           if(x> 0){
            console.log(x)
          }
          //  收集滑动的Y值
           this.scrollY = Math.abs(y);
         });

         // 给右侧列表绑定scrollEnd，当滑动停止的时候触发
         this.foodScroll.on('scrollEnd', ({x,y}) => {
          //  console.log('scrollEnd',x,y);
          if(x> 0){
            console.log(x)
          }
          //  收集滑动的Y值
           this.scrollY = Math.abs(y);
         })

    },
    _iniTops() {
      // 收集右侧 li的tops
      // 1.初始化tops
      const tops = [];
      let top = 0;
      tops.push(top);
      // 2.收集
      // 获取右侧分类
      const lis = this.$refs.foodsUl.getElementsByClassName('food-list-hook');
      Array.prototype.slice.call(lis).forEach(li => {
        top += li.clientHeight;
        tops.push(top);
      });
      // 3.更新数据
      this.tops = tops;
    },

    // 给左侧的分类列表，添加点击事件，右侧滑动到指定位置
    clickMenuItem(index) {
      // console.log(index);
      // 1.使右侧列表滑动到指定位置

      // 首先，得到位置的scrollY
      const scrollY = this.tops[index];
      // 立即更新scrollY（让点击的分类项成为当前的分类）
      this.scrollY = scrollY;
      // 平滑滚动右侧列表
      this.foodScroll.scrollTo(0, -scrollY, 200);     
    },

    // 显示food
    showFood(food) {
      // 首先，设置food
      this.food =food;
      // 显示food组件(父组件中调用子组件的方法)
      this.$refs.food.toggleShow();
    }
  },
  components: {
    CartControl,
    FoodImg,
    ShopCart
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../../common/stylus/mixins.styl';

.goods {
  display: flex;
  position: relative;
  top: 1px
  // top: 195px;
  // bottom: 46px;
  width: 100%;
  background: #fff;
  overflow: hidden;

  .menu-wrapper {
    flex: 0 0 80px;
    width: 80px;
    margin-top 0
    background: #f3f5f7;
    height: 420px
    .menu-item {
      display: table;
      height: 54px;
      width: 56px;
      padding: 0 12px;
      line-height: 14px;

      &.current {
        position: relative;
        z-index: 10;
        margin-top: -1px;
        background: #fff;
        color: $green;
        font-weight: 700;

        .text {
          border-none();
        }
      }

      .icon {
        display: inline-block;
        vertical-align: top;
        width: 12px;
        height: 12px;
        margin-right: 2px;
        background-size: 12px 12px;
        background-repeat: no-repeat;
      }

      .text {
        display: table-cell;
        width: 56px;
        vertical-align: middle;
        bottom-border-1px(rgba(7, 17, 27, 0.1));
        font-size: 12px;
      }
    }
  }

  .foods-wrapper {
    flex: 1;
    height: 420px
    .title {
      padding-left: 14px;
      margin 0
      height: 26px;
      line-height: 26px;
      border-left: 2px solid #d9dde1;
      font-size: 12px;
      color: rgb(147, 153, 159);
      background: #f3f5f7;
    }

    .food-item {
      display: flex;
      margin: 18px;
      padding-bottom: 18px;
      bottom-border-1px(rgba(7, 17, 27, 0.1));

      &:last-child {
        border-none();
        margin-bottom: 0;
      }

      .icon {
        flex: 0 0 57px;
        margin-right: 10px;
      }

      .content {
        flex: 1;

        .name {
          margin: 2px 0 8px 0;
          height: 14px;
          line-height: 14px;
          font-size: 14px;
          color: rgb(7, 17, 27);
        }

        .desc, .extra {
          line-height: 10px;
          font-size: 10px;
          color: rgb(147, 153, 159);
        }

        .desc {
          line-height: 12px;
          margin-bottom: 8px;
        }

        .extra {
          .count {
            margin-right: 12px;
          }
        }

        .price {
          font-weight: 700;
          line-height: 24px;

          .now {
            margin-right: 8px;
            font-size: 14px;
            color: rgb(240, 20, 20);
          }

          .old {
            text-decoration: line-through;
            font-size: 10px;
            color: rgb(147, 153, 159);
          }
        }

        .cartcontrol-wrapper {
          position: absolute;
          right: 0;
          bottom: 12px;
        }
      }
    }
  }
}
</style>