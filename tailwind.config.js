const konstaConfig = require('konsta/config');

module.exports = konstaConfig({
  content: [
    './components/*.{js,ts,jsx,vue}',
    './pages/*.{js,ts,jsx,vue}',
    './layouts/*.{js,ts,jsx,vue}',
    './components/**/*.{js,ts,jsx,vue}',
  ],
  darkMode: 'media',
  theme: {
    fontFamily: {
      material: 'Inter, system-ui, Noto, Helvetica, Arial, sans-serif',
    }
  },
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
  konsta: {
    colors: {
      primary: '#6750a4'
    },
  },
});

