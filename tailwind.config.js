/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public/index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f9ff',
          100: '#ccf3ff',
          200: '#99e6ff',
          300: '#66daff',
          400: '#33cdff',
          500: '#00c0ff',
          600: '#009aff',
          700: '#0077ff',
          800: '#0055ff',
          900: '#0033ff',
        },
        accent: {
          50: '#f9f0ff',
          100: '#f3e0ff',
          200: '#e7c2ff',
          300: '#da94ff',
          400: '#ce66ff',
          500: '#c238ff',
          600: '#b60aff',
          700: '#9900e6',
          800: '#7700b3',
          900: '#550080',
        },
        secondary: {
          50: '#fff0f0',
          100: '#ffe0e0',
          200: '#ffc2c2',
          300: '#ff9494',
          400: '#ff6666',
          500: '#ff3838',
          600: '#ff0a0a',
          700: '#e60000',
          800: '#b30000',
          900: '#800000',
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
}
