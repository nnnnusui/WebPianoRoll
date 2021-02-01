module.exports = {
  purge: ['./src/**/*.js'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      cursor: {
        'resize-v': 'ew-resize'
      },
      maxWidth: {
        'border': '.8rem' 
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
