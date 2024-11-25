const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  productionSourceMap: false,
  publicPath: '/',
  outputDir: 'dist',
  assetsDir: 'static',
  indexPath: 'index.html',
  filenameHashing: true,
  pages: {
    index: {
      entry: 'src/main.js',
      template: 'public/index.html',
      filename: 'index.html',
      title: 'Derivative Genius | AI-Powered Business Intelligence',
      chunks: ['chunk-vendors', 'chunk-common', 'index']
    }
  },
  configureWebpack: {
    performance: {
      hints: process.env.NODE_ENV === 'production' ? 'warning' : false,
      maxEntrypointSize: 512000,
      maxAssetSize: 512000
    },
    optimization: {
      splitChunks: {
        chunks: 'all',
        minSize: 20000,
        maxSize: 250000,
        cacheGroups: {
          defaultVendors: {
            name: 'chunk-vendors',
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            chunks: 'initial',
            reuseExistingChunk: true
          },
          common: {
            name: 'chunk-common',
            minChunks: 2,
            priority: -20,
            chunks: 'initial',
            reuseExistingChunk: true
          },
          firebase: {
            name: 'firebase',
            test: /[\\/]node_modules[\\/](@firebase|firebase)/,
            priority: 20,
            chunks: 'async'
          },
          charts: {
            name: 'charts',
            test: /[\\/]node_modules[\\/](chart\.js|vue-chartjs)/,
            priority: 15,
            chunks: 'async'
          },
          heroicons: {
            name: 'heroicons',
            test: /[\\/]node_modules[\\/]@heroicons/,
            priority: 10,
            chunks: 'async'
          }
        }
      }
    }
  },
  chainWebpack: config => {
    // Add Vue feature flags and build info
    config.plugin('define')
      .tap(args => {
        Object.assign(args[0], {
          __VUE_OPTIONS_API__: true,
          __VUE_PROD_DEVTOOLS__: false,
          __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false,
          'process.env': {
            BASE_URL: JSON.stringify('/'),
            NODE_ENV: JSON.stringify(process.env.NODE_ENV),
            BUILD_TIME: JSON.stringify(new Date().toISOString()),
            BUILD_VERSION: JSON.stringify(require('./package.json').version)
          }
        })
        return args
      })

    // Handle static assets
    config.module
      .rule('images')
      .test(/\.(png|jpe?g|gif|webp|avif|ico)(\?.*)?$/)
      .type('asset')
      .parser({
        dataUrlCondition: {
          maxSize: 4 * 1024 // 4kb
        }
      })

    // Improve build logging
    config.stats({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false,
      assets: true
    })

    // Tree shaking for lodash
    config.resolve.alias
      .set('lodash-es', 'lodash')

    // Production optimizations
    if (process.env.NODE_ENV === 'production') {
      config.optimization
        .minimize(true)
        .splitChunks({
          chunks: 'all',
          minSize: 20000,
          maxSize: 250000
        })
    }
  },
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    },
    client: {
      overlay: {
        errors: true,
        warnings: false
      }
    }
  }
})
