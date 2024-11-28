const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: [],
  productionSourceMap: false,
  publicPath: '/',
  outputDir: 'dist',
  assetsDir: 'static',
  indexPath: 'index.html',
  filenameHashing: true,

  chainWebpack: config => {
    // Split vendor chunks
    config.optimization.splitChunks({
      cacheGroups: {
        // Split Chart.js into its own chunk
        charts: {
          test: /[\\/]node_modules[\\/](chart\.js|vue-chartjs)[\\/]/,
          name: 'charts',
          chunks: 'all',
          priority: 20
        },
        vendors: {
          name: 'chunk-vendors',
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          chunks: 'initial'
        },
        common: {
          name: 'chunk-common',
          minChunks: 2,
          priority: -20,
          chunks: 'initial',
          reuseExistingChunk: true
        }
      }
    })
  }
})
