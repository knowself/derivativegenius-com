const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');
const tailwindcss = require('tailwindcss');
const postcssNesting = require('postcss-nesting');

module.exports = {
  plugins: [
    postcssNesting(),
    tailwindcss(),
    autoprefixer(),
    process.env.NODE_ENV === 'production' && cssnano({
      preset: ['default', {
        discardComments: {
          removeAll: true,
        },
        normalizeWhitespace: false,
      }]
    })
  ].filter(Boolean)
}
