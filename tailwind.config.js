/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#0077DB',
        gray: '#F8FAFB',
        secondary: '#0077DB',
        brand: '#3F3F79',
      },
      boxShadow: {
        card: '0px 7px 25px #98a1a925',
      },
      zIndex: {
        infinity: '999',
      },
    },
  },
  plugins: [require('@tailwindcss/line-clamp'), require('tailwindcss-rtl')],
};
