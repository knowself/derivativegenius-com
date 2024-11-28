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
        // Split Firebase into its own chunk
        firebase: {
          test: /[\\/]node_modules[\\/](@firebase|firebase)[\\/]/,
          name: 'firebase',
          chunks: 'all',
          priority: 30
        },
        // Split Chart.js into its own chunk
        charts: {
          test: /[\\/]node_modules[\\/](chart\.js|vue-chartjs)[\\/]/,
          name: 'charts',
          chunks: 'all',
          priority: 20
        },
        // Common vendor chunk
        vendors: {
          name: 'chunk-vendors',
          test: /[\\/]node_modules[\\/]/,
          chunks: 'initial',
          priority: 10,
          reuseExistingChunk: true
        }
      }
    })
  }
})
