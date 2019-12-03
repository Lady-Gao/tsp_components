console.log('tag')
module.exports = {
  // 将 examples 目录添加为新的页面
  pages: {
    index: {
      // page 的入口
      entry: 'src/main.js',
      // 模板来源
      template: 'public/index.html',
      // 输出文件名
      filename: 'index2.js'
    }
  },
<<<<<<< HEAD
  publicPath: 'src/main.js'
=======
  css: {

  // 启用 CSS modules
  
          modules:false,
  
  // 是否使用css分离插件
  
          extract:false,
  
  // 开启 CSS source maps，一般不建议开启
  
          sourceMap:false,
  
  // css预设器配置项
  
      },
  publicPath:'index.js'
>>>>>>> 5069cd778017d1228fb6c2e1764369ef893d6f9d
}