const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  productionSourceMap: false,
  publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',
  outputDir: 'dist',
  assetsDir: 'static',
  indexPath: 'index.html',
  filenameHashing: true,
  pages: {
    index: {
      entry: 'src/main.js',
      template: 'public/index.html',
      filename: 'index.html',
      title: 'Derivative Genius',
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
        maxSize: 250000
      }
    }
  },
  chainWebpack: config => {
    // Add Vue feature flags
    config.plugin('define')
      .tap(args => {
        Object.assign(args[0], {
          __VUE_OPTIONS_API__: true,
          __VUE_PROD_DEVTOOLS__: false,
          __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false,
          BUILD_TIME: JSON.stringify(new Date().toISOString()),
          BUILD_VERSION: JSON.stringify(require('./package.json').version)
        })
        return args
      })

    // Improve build logging
    config.stats({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false,
      errors: true,
      warnings: true,
      assets: true,
      performance: true
    })
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
