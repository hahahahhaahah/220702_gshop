const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  // 开启代理服务器
  devServer: {
    proxy: {
      '/api': {// '/api'是请求前缀
        target: 'http://localhost:4000', // 代理目标的基础路径
        ws: true,
        changeOrigin: true,
        pathRewrite: {// 重写路径: 去掉路径中开头的'/api'
          '^/api': ''
        }
      }
    }
  }
}
)
