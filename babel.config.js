module.exports = {
  // 预设包：解析vue相关的js
  presets: [
    '@vue/cli-plugin-babel/preset',
    // ["es2015", { "modules": false }]
  ],
  plugins: [
    [
      "component",
      {
        "libraryName": "mint-ui",
        "style": true
      }
    ]
  ]


}

