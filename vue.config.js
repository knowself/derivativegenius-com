const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: [],
  productionSourceMap: false,
  publicPath: '/',
  outputDir: 'dist',
  assetsDir: 'static',
  indexPath: 'index.html',
  filenameHashing: true,

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
