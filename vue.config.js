const { defineConfig } = require('@vue/cli-service')
const webpack = require('webpack')

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

    // Add environment variables directly
    config
      .plugin('define')
      .tap(args => {
        Object.assign(args[0]['process.env'], {
          VUE_APP_FIREBASE_API_KEY: JSON.stringify(process.env.VUE_APP_FIREBASE_API_KEY),
          VUE_APP_FIREBASE_AUTH_DOMAIN: JSON.stringify(process.env.VUE_APP_FIREBASE_AUTH_DOMAIN),
          VUE_APP_FIREBASE_PROJECT_ID: JSON.stringify(process.env.VUE_APP_FIREBASE_PROJECT_ID),
          VUE_APP_FIREBASE_STORAGE_BUCKET: JSON.stringify(process.env.VUE_APP_FIREBASE_STORAGE_BUCKET),
          VUE_APP_FIREBASE_MESSAGING_SENDER_ID: JSON.stringify(process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID),
          VUE_APP_FIREBASE_APP_ID: JSON.stringify(process.env.VUE_APP_FIREBASE_APP_ID),
          VUE_APP_API_URL: JSON.stringify(process.env.VUE_APP_API_URL)
        })
        return args
      })
  }
})
