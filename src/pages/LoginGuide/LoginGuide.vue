<template>
  <section class="loginContainer">
      <div class="loginInner">
        <div class="login_header">
          <h2 class="login_logo">硅谷外卖</h2>
          <div class="login_header_title">
            <a href="javascript:;" :class="{on: loginWay}" @click="loginWay = true">短信登录</a>
            <a href="javascript:;" :class="{on: !loginWay}" @click="loginWay = false">密码登录</a>
          </div>
        </div>
        <div class="login_content"  >
          <form @submit.prevent = "login">
            <div :class="{on: loginWay}">
              <section class="login_message">
                <input type="tel" maxlength="11" placeholder="手机号" v-model="phone">
                <!-- 当手机号检查正确后，获取验证码变颜色: 用类名变化实现，并且类名是由计算属性得到-->
                <button :disabled="!rightPhone" class="get_verification" 
                        :class="{right_phone: rightPhone}"
                        @click="getCode">
                        {{computeTime>0 ? `已发送(${computeTime}s)` : '获取验证码'}}
                </button>
              </section>
              <section class="login_verification">
                <input type="tel" maxlength="8" placeholder="验证码" v-model="code">
              </section>
              <section class="login_hint">
                温馨提示：未注册硅谷外卖帐号的手机号，登录时将自动注册，且代表已同意
                <a href="javascript:;">《用户服务协议》</a>
              </section>
            </div>
            <div :class="{on: !loginWay}">
              <section>
                <section class="login_message">
                  <input type="text" maxlength="11" placeholder="手机/邮箱/用户名" v-model="name">
                </section>
                <section class="login_verification">
                  <input type="text" maxlength="8" placeholder="密码" v-if="showPwd" v-model="pwd">
                  <input type="password" maxlength="8" placeholder="密码" v-else v-model="pwd">
                  <div class="switch_button" :class="showPwd ? 'on' : 'off'" @click="showPwd = !showPwd">
                    <div class="switch_circle" :class="{right: showPwd}" ></div>
                    <span class="switch_text">{{showPwd ? 'abc' : '...'}}</span>
                  </div>
                </section>
                <section class="login_message">
                  <input type="text" maxlength="11" placeholder="验证码" v-model="captcha">
                  <!-- 为了得到实时的验证码，直接将网页请求代码作为src -->
                  <img class="get_verification" src="http://localhost:4000/captcha" alt="captcha" @click="getCaptcha" ref="captcha">
                </section>
              </section>
            </div>
            <!-- 点击之后，默认提交表单 -->
            <button class="login_submit" >登录</button>
          </form>
          <a href="javascript:;" class="about_us">关于我们</a>
        </div>
        <a href="javascript:" class="go_back">
          <!-- 给字体图标添加返回的操作 -->
          <i class="iconfont icon-jiantou2" @click="$router.back()"></i>
        </a>
    </div>
    <!-- 但是这个提示框有两个状态：显示和隐藏。因此，利用属性来标识两种状态 -->
    <AlertTip :alertText="alertText"  v-show="alertShow" @closeTip = "closeTip"/>
  </section>
</template>

<script>
// 引入弹窗提示组件
import AlertTip from '../../components/AlertTip/AlertTip.vue'
// 直接引入接口函数，在组件中发送ajax请求
import {reqSendCode, reqPwdLogin, reqSmsLogin} from '../../api'

export default {
  data() {
    return {
      loginWay: true, //true代表手机号登录
      computeTime: 0,//初始化定时器
      phone: '',//初始化
      showPwd: false, //是否显示密码，flase代表是加密的密码
      // 用于跟后台的接口文档匹配，用于后续验证
      pwd:'', //密码收集
      code: '',//短信验证码
      name:'', //用户名
      captcha:'',//图片验证码
      alertText:'', //提示文本
      alertShow: false, //是否显示弹窗
    }
  },
  components: {
    AlertTip
  },
  computed: {
    rightPhone() {
      // 测试手机号的位数是不是11位
      // 利用正则表达式实现：以1开头，后面有10位数结尾
      return /^1\d{10}$/.test(this.phone);
    }
  },
  methods:{
    // 获取手机号验证码
    async getCode() {
      if (!this.computeTime){
        // 设置倒计时的秒数
       this.computeTime = 30;
        this.intervalId = setInterval(()=> {
          // 如果现在没有开启定时器，才启动定时
            // 1.启动倒计时
            this.computeTime --;
            
            if(this.computeTime <=0) {
              // 停止倒计时
              clearInterval(this.intervalId);
            }
        },1000);

        // 2.发送ajax请求（向指定手机号发送验证码短信——后台进行）
        const result = await reqSendCode(this.phone);
        // result得到的是promise返回值
        if(result.code === 1) {//如果获取失败
          // 显示失败提示
          this.showAlert(result.msg);
          // 停止倒计时
          if(this.computeTime) {//如果倒计时还在进行，则停止倒计时
            this.computeTime = 0;
            clearInterval(this.intervalId);
            this.intervalId = undefined;
          }
        }
      }
    },
    // 将弹窗提示的触发，封装成函数
    showAlert(alertText) {
      this.alertShow = true;
      this.alertText = alertText;
    },
    // 实现异步登录
    async login () {
      // result定义成
      let result
      // 1.前端表单的验证
      if(this.loginWay) {//手机验证

        // 利用解析异构的方法提取出变量
        const {rightPhone, phone, code} = this;
        if(!rightPhone) {//手机号验证不正确
            // 提示手机号不正确
            this.showAlert('手机号不正确');
            return
        } else if(!/^\d{6}$/.test(code)) {//验证手机号是否是6位数字
            // 提示验证码必须是6位数
            this.showAlert('验证码不正确');
            return
        }

        // 2.发送ajax请求，进行短信登陆
        // 首先利用await、async（在该函数的前面）用于获取结果
        result = await reqSmsLogin(phone, code);

      } else {//密码登录
        // 获取当前表单的信息
        const {name, pwd, captcha} = this;
        if (!this.name) {
          // 提示用户名必须指定
            this.showAlert('提示用户名必须指定');
            return
        } else if(!this.pwd){
          // 密码必须指定
            this.showAlert('密码必须指定');
            return 
        } else if(!this.captcha) {
          // 验证码必须指定
            this.showAlert('验证码必须指定');
            return
        }
        // 2.发送ajax请求，进行密码登录
        // 首先利用await、async（在该函数的前面）用于获取结果
        result = await reqPwdLogin({name, pwd, captcha});
      }

      // 无论成功还是失败，停止倒计时
      if(this.computeTime) {//如果倒计时还在进行，则停止倒计时
        this.computeTime = 0;
        clearInterval(this.intervalId);
        this.intervalId = undefined;
      }

      // 根据结果进行数据处理
      if(result.code === 0) {//如果获取成功
        // 成功的话，获取用户的信息
        const user = result.data;
        // （1）将user保存到vuex的state中
        this.$store.dispatch('recordUser', user);
        // (2)跳转路由：去个人中心
        this.$router.replace('/profile');

      } else {//如果失败
          
          // 刷新验证码
          this.getCaptcha()
          // 显示错误提示
          const msg = result.msg;
          this.showAlert(msg);
      }
    },
    // 关闭弹窗
    closeTip() {
      this.alertShow = false;
      this.alertText = '';
    },
    // 密码登录获取新的验证码
    getCaptcha() {
      // 点击之后，重新从网页获取一个验证码
      // 但是，只有路径改变的时候才会发送请求。因此，利用给地址＋“时间戳”的形式实现路径的变化
      // 每次指定一个src值
      this.$refs.captcha.src = 'http://localhost:4000/captcha?time' + Date.now();
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixins.styl"
  .loginContainer
    width 100%
    height 100%
    background #fff
    .loginInner
      padding-top 60px
      width 80%
      margin 0 auto
      .login_header
        .login_logo
          font-size 40px
          font-weight bold
          color #02a774
          text-align center
        .login_header_title
          padding-top 40px
          text-align center
          >a
            text-decoration none
            color #333
            font-size 14px
            padding-bottom 4px
            &:first-child
              margin-right 40px
            &.on
              color #02a774
              font-weight 700
              border-bottom 2px solid #02a774
      .login_content
        >form
          >div
            display none
            &.on
              display block
            input
              width 100%
              height 100%
              padding-left 10px
              box-sizing border-box
              border 1px solid #ddd
              border-radius 4px
              outline 0
              font 400 14px Arial
              &:focus
                border 1px solid #02a774
            .login_message
              position relative
              margin-top 16px
              height 48px
              font-size 14px
              background #fff
              .get_verification
                position absolute
                top 50%
                right 10px
                transform translateY(-50%)
                border 0
                color #ccc
                font-size 14px
                background transparent
                //验证码的样式
                &.right_phone
                  color black
            .login_verification
              position relative
              margin-top 16px
              height 48px
              font-size 14px
              background #fff
              .switch_button
                font-size 12px
                border 1px solid #ddd
                border-radius 8px
                transition background-color .3s,border-color .3s
                padding 0 6px
                width 30px
                height 16px
                line-height 16px
                color #fff
                position absolute
                top 50%
                right 10px
                transform translateY(-50%)
                &.off
                  background #fff
                  .switch_text
                    float right
                    color #ddd
                &.on
                  background #02a774
                >.switch_circle
                  position absolute
                  top -1px
                  left -1px
                  width 16px
                  height 16px
                  border 1px solid #ddd
                  border-radius 50%
                  background #fff
                  box-shadow 0 2px 4px 0 rgba(0,0,0,.1)
                  transition transform .3s
                  &.right
                    // 按钮向右移动的时候，滑动的方向
                    transform translateX(30px)
            .login_hint
              margin-top 12px
              color #999
              font-size 14px
              line-height 20px
              >a
                color #02a774
                text-decoration none
          .login_submit
            display block
            width 100%
            height 42px
            margin-top 30px
            border-radius 4px
            background #4cd96f
            color #fff
            text-align center
            font-size 16px
            line-height 42px
            border 0
        .about_us
          display block
          font-size 12px
          margin-top 20px
          text-align center
          color #999
          text-decoration none
      .go_back
        position absolute
        top 5px
        left 5px
        width 30px
        height 30px
        text-decoration none
        >.iconfont
          font-size 20px
          color #999
</style>