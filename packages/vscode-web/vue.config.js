// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  lintOnSave: false,
  publicPath: '/',
  outputDir: '../vscode/media/html',
  assetsDir: '_assets',
  productionSourceMap: false,
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          javascriptEnabled: true
        }
      }
    }
  },
  chainWebpack(config) {
    config.resolve.alias
      .set('@', resolve('src'))
      .set('@types', resolve('src/@types'))
    config.resolve.symlinks(false)
    const types = ['vue-modules', 'vue', 'normal-modules', 'normal']

    types.forEach((type) =>
      addStyleResource(config.module.rule('less').oneOf(type))
    )
  },
  devServer: {
    host: '0.0.0.0',
    port: 3000,
    overlay: {
      warnings: false,
      errors: false // 显示error
    },
    proxy: {
      '/yapi': {
        target: 'http://yapi.dev.ztosys.com', //API服务器的地址
        ws: true, //代理websockets
        changeOrigin: true, // 虚拟的站点需要更管origin
        pathRewrite: {
          //重写路径 比如'/api/aaa/ccc'重写为'/aaa/ccc'
          '^/yapi': ''
        }
      }
    }
  }
}

function addStyleResource(rule) {
  rule
    .use('style-resource')
    .loader('style-resources-loader')
    .options({
      patterns: [resolve('src/styles/theme.less')]
    })
}
