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
        },
        // Common chunk for frequently used components
        common: {
          name: 'chunk-common',
          minChunks: 2,
          priority: 5,
          chunks: 'initial',
          reuseExistingChunk: true
        }
      }
    })

    // Optimize images
    config.module
      .rule('images')
      .use('image-webpack-loader')
      .loader('image-webpack-loader')
      .options({
        bypassOnDebug: true
      })
      .end()

    // Generate gzip files for larger chunks
    if (process.env.NODE_ENV === 'production') {
      config.plugin('compression').use(require('compression-webpack-plugin'), [{
        filename: '[path][base].gz',
        algorithm: 'gzip',
        test: /\.(js|css|html|svg)$/,
        threshold: 10240,
        minRatio: 0.8
      }])
    }
  },

  // Configure development server proxy
  devServer: {
    port: 8080,
    host: 'localhost',
    proxy: {
      '/health/': {
        target: 'http://localhost:8000',
        changeOrigin: false,
        secure: false,
        withCredentials: true,
        cookieDomainRewrite: 'localhost',
        headers: {
          'Origin': 'http://localhost:8080'
        }
      },
      '/firebase/': {
        target: 'http://localhost:8000',
        changeOrigin: false,
        secure: false,
        withCredentials: true,
        cookieDomainRewrite: 'localhost',
        headers: {
          'Origin': 'http://localhost:8080'
        }
      },
      '/api/': {
        target: 'http://localhost:8000',
        changeOrigin: false,
        secure: false,
        withCredentials: true,
        cookieDomainRewrite: 'localhost',
        headers: {
          'Origin': 'http://localhost:8080'
        }
      }
    },
    client: {
      overlay: {
        errors: true,
        warnings: false
      }
    }
  },

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
          defaultVendors: false,
          default: false,
          styles: {
            name: 'styles',
            test: /\.(s?css|vue)$/,
            chunks: 'all',
            enforce: true,
            priority: 10
          },
          common: {
            name: 'common',
            test(module) {
              if (!module.context) return false
              return module.context.includes('node_modules')
            },
            chunks: 'initial',
            priority: 2,
            minChunks: 2
          }
        }
      }
    }
  }
})
