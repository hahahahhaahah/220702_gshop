<template>
    <section class="search">
      <!-- 搜索首页 -->
      <HeaderTop title="搜索"> </HeaderTop>
      <!-- 搜索 -->
      <form class="search_form" @submit.prevent="search">
        <!-- 搜索展示的列表需要通过vuex管理 -->
        <input type="search" name="search" placeholder="请输入商家或美食名称" class="search_input" v-model="keyword">
        <input type="submit" name="submit" class="search_submit">
      </form>

      <section class="list" v-if="!noSearchShops">
        <ul class="list_container">
          <!--:to="'/shop?id='+item.id"-->
          <!-- router-link默认生成的使a标签，tag: li，用来指示生成的使li标签 -->
          <!-- 
            1.path, query
           -->
          <router-link :to="{path:'/shop', query:{id:item.id}}" tag="li"
                      v-for="item in searchShops" :key="item.id" class="list_li">
            <section class="item_left">
              <img :src="imgBaseUrl + item.image_path" class="restaurant_img">
            </section>
            <section class="item_right">
              <div class="item_right_text">
                <p>
                  <span>{{item.name}}</span>
                </p>
                <p>月售 {{item.month_sales||item.recent_order_num}} 单</p>
                <p>{{item.delivery_fee||item.float_minimum_order_amount}} 元起送 / 距离{{item.distance}}</p>
              </div>
            </section>
          </router-link>
        </ul>
      </section>

      <div class="search_none" v-else>很抱歉！无搜索结果</div>
    </section>
</template>

<script>
import HeaderTop from '../../components/HeaderTop/HeaderTop.vue'
import {mapState} from 'vuex'


export default {
  data() {
    return {
      keyword: '',
      imgBaseUrl: 'http://cangdu.org:8001/img/',
      noSearchShops: false, //标识搜索的商家
    }
  },
  components: {
    HeaderTop
  },
  computed: {
    ...mapState(['searchShops'])
  },
  methods: {
    // 搜索商家
    search() {
      // 得到的搜索关键字
      const keyword = this.keyword.trim()

      if(keyword) {//如果搜索的值不为空
        // 进行搜索
        this.$store.dispatch('searchShops', keyword)
      } 
    }
  },

  // 监视
  watch: {
    searchShops(value) {
      if(!value.length){//没有数据
        this.noSearchShops = true
      } else {
        this.noSearchShops =true
      }
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixins.styl"
  .search
    width 100%
    height 100%
    overflow hidden
    .search_form
      clearFix()
      margin-top 45px
      background-color #fff
      padding 12px 8px
      input
        height 35px
        padding 0 4px
        border-radius 2px
        font-weight bold
        outline none
        &.search_input
          float left
          width 79%
          border 4px solid #f2f2f2
          font-size 14px
          color #333
          background-color #f2f2f2
        &.search_submit
          float right
          width 18%
          border 4px solid #02a774
          font-size 16px
          color #fff
          background-color #02a774

    .list
      .list_container
        background-color: #fff;
        .list_li
          display: flex;
          justify-content: center;
          padding: 10px
          border-bottom: 1px solid $bc;
          .item_left
            margin-right: 10px
            .restaurant_img
              width 50px
              height 50px
              display block
          .item_right
            font-size 12px
            flex 1
            .item_right_text
              p
                line-height 12px
                margin-bottom 6px
                &:last-child
                  margin-bottom 0
    .search_none
      margin: 0 auto
      color: #333
      background-color: #fff
      text-align: center
      margin-top: 0.125rem


</style>
