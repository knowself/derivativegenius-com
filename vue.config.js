const { defineConfig } = require('@vue/cli-service')
const path = require('path')

module.exports = defineConfig({
  transpileDependencies: [],
  productionSourceMap: false,
  publicPath: '/',
  outputDir: 'dist',
  assetsDir: 'static',
  indexPath: 'index.html',
  filenameHashing: true,

  devServer: {
    hot: true,
    client: {
      overlay: false
    },
    static: {
      watch: false
    }
  },

  configureWebpack: config => {
    if (process.env.NODE_ENV === 'development') {
      // Remove unnecessary plugins
      config.plugins = config.plugins.filter(plugin => {
        const pluginName = plugin.constructor.name
        return ![
          'ForkTsCheckerWebpackPlugin',
          'ESLintWebpackPlugin',
          'CopyPlugin',
          'PreloadPlugin',
          'PrefetchPlugin'
        ].includes(pluginName)
      })

      // Fast cache configuration
      config.cache = {
        type: 'memory',
        maxGenerations: 1
      }

      // Disable source maps in development
      config.devtool = false
    }

    return {
      performance: {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000
      }
    }
  },

  chainWebpack: config => {
    if (process.env.NODE_ENV === 'development') {
      // Remove unnecessary plugins
      config.plugins.delete('fork-ts-checker')
      config.plugins.delete('preload')
      config.plugins.delete('prefetch')
      config.plugins.delete('progress')

      // Disable thread-loader as it adds overhead for small projects
      config.module.rules.delete('thread-loader')

      // Configure js rule to use esbuild-loader
      config.module
        .rule('js')
        .test(/\.m?js$/)
        .exclude
        .add(/node_modules/)
        .end()
        .use('esbuild-loader')
        .loader('esbuild-loader')
        .options({
          loader: 'js',
          target: 'es2015'
        })
        .end()
    }

    // Production optimizations remain unchanged
    if (process.env.NODE_ENV === 'production') {
      config.optimization.minimizer('terser').tap((args) => {
        const opts = args[0]
        opts.terserOptions.compress['drop_console'] = true
        return args
      })
    }
  }
})
