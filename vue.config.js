const path = require('path')
// HardSourceWebpackPlugin是webpack的插件，为模块提供中间缓存步骤。为了查看结果，您需要使用此插件运行webpack两次：第一次构建将花费正常的时间。第二次构建将显着加快（大概提升90%的构建速度）。
// 安装 npm install --save-dev hard-source-webpack-plugin
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')
// DllPlugin插件能够快速打包，能把第三方依赖的文件能提前进行预编译打包到一个文件里面去。
// 安装 npm install --save-dev autodll-webpack-plugin
const AutoDllPlugin = require('autodll-webpack-plugin')

const port = process.env.VUE_PORT || process.env.npm_config_port || 80 // 端口
const appBasePort = process.env.VUE_APP_BASE_PORT || 8080 // 后端端口

function resolve(dir) {
  return path.join(__dirname, dir)
}
module.exports = {
  // assetsDir: "web",

  // 部署生产环境和开发环境下的URL。
  // 默认情况下，Vue CLI 会假设你的应用是被部署在一个域名的根路径上
  // 如果应用被部署在一个子路径上，你就需要用这个选项指定这个子路径。例如，如果你的应用被部署在 https://*****/admin/，则设置 baseUrl 为 /admin/。
  publicPath: process.env.NODE_ENV === 'production' ? '/funds/' : '/',
  // 在npm run build 或 yarn build 时 ，生成文件的目录名称（要和baseUrl的生产环境路径一致）（默认dist）
  outputDir: 'dist',
  // 用于放置生成的静态资源 (js、css、img、fonts) 的；（项目打包之后，静态资源会放在这个文件夹下）
  assetsDir: 'public',
  lintOnSave: false,
  // 如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建。
  productionSourceMap: false,

  devServer: {
    host: '0.0.0.0',
    port: port,
    open: true,
    overlay: {
      warning: false,
      errors: false
    },
    // 接口代理
    proxy: {
      [process.env.VUE_APP_BASE_API]: {
        target: 'http://192.168.1.189:' + '8201',
        // target: 'http://feature.data-center.product.dev.deshuixx.com/admin',
        // target: 'http://feature-datacenter-linwu-wide.product.dev.deshuixx.com/admin',
        changeOrigin: true,
        // pathRewrite: {
        //   ['^' + process.env.VUE_APP_BASE_API]: ''
        // },
        pathRewrite: (target, request) => {
          request.headers['client-request-uri'] = target
          request.headers['X-Real-IP'] = request.connection.remoteAddress
          return target.replace(new RegExp('^/backend/'), '')
        },
        ws: true,
        disableHostCheck: true
      }
    }
  },
  configureWebpack: (config) => {
    Object.assign(config, {
      // 开发与生产环境共同配置别名
      resolve: {
        alias: {
          '@': path.resolve(__dirname, './src'),
          view: '@/view',
          components: '@/components'
        },
        // 尝试按顺序解析这些后缀名。如果有多个文件有相同的名字，但后缀名不同，webpack 会解析列在数组首位的后缀的文件 并跳过其余的后缀, 引入模块时可以不带扩展
        extensions: ['.ts', '.js', '.vue', '.json']
      },
      externals: {
        './cptable': 'var cptable',
        'globalConfig': 'globalConfig'
      }
    })
    if (process.env.NODE_ENV !== 'production') {
      config.plugins.push(
        new HardSourceWebpackPlugin(),
        new AutoDllPlugin({
          inject: true,
          debug: true,
          filename: '[name]_[hash].ts',
          path: './dll' + Date.parse(new Date()),
          entry: {
            // vendor_vue: ['vue', 'vuex', 'vue-router'],
            // vendor_ui: ['vue-awesome-swiper'],
            // vendor_tools: ['axios', 'core-js']
          }
        })
      )
    }
  },
  chainWebpack(config) {
    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

    config.plugin('html').tap(args => {
      args[0].title = process.env.VUE_APP_TITLE
      return args
    })
  },
  css: {
    sourceMap: true // 开启 CSS source maps
  }
}
