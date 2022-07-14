import Vue from 'vue'
// 方法1
import moment from 'moment'
// 方法2:只引入data-fns中的format
// import {format} from 'data-fns'

// 自定义过滤器
// 方法1：利用moment，但是moment的库太大
Vue.filter('data-format', function(value) {
    return moment(value).format('YYYY-MM-DD HH:mm:ss')
})

// 方法2：data-fns代替moment
// Vue.filter('data-format', function(value, formatStr='YYYY-MM-DD HH:mm:ss') {
//     return format(value, formatStr)
// })




// 不需要向外暴露，著需要在main中加载即可执行