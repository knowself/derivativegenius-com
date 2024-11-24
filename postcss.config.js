module.exports = {
  plugins: {
    'tailwindcss/nesting': {},
    tailwindcss: {},
    autoprefixer: {
      flexbox: true,
      grid: true,
      browsers: ['> 1%', 'last 2 versions', 'not ie <= 11']
    },
    ...(process.env.NODE_ENV === 'production' ? { 
      cssnano: {
        preset: ['default', {
          discardComments: {
            removeAll: true,
          },
          normalizeWhitespace: false,
        }]
      }
    } : {})
  }
}
