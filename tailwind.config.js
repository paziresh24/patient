/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [''],
      },
      colors: {
        primary: '#3861fb',
        gray: '#F8FAFB',
        secondary: '#00acac',
        brand: '#3F3F79',
      },
      boxShadow: {
        card: '0px 7px 25px #98a1a925',
      },
      zIndex: {
        infinity: '999',
      },
      backgroundSize: {
        85: '85rem',
      },
      keyframes: {
        progress: {
          '0%': { right: '-100%' },
          '100%': { right: '100%' },
        },
      },
      animation: {
        progress: 'progress 2s linear infinite',
      },
    },
  },
  plugins: [require('@tailwindcss/line-clamp'), require('tailwindcss-rtl')],
};
