const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  purge: {
    enabled: process.env.NODE_ENV === 'production',
    content: ['./src/**/*.{js,ts,jsx,tsx}'],
    options: {
      safelist: [
        'rtl',
        'ltr',
        'scroll-smooth',
        'antialiased',
        'pwa:select-none',
        'dont-fa-number-font',
      ],
    },
  },
  theme: {
    extend: {
      screens: {
        pwa: { raw: '(display-mode: standalone)' },
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
        'progress': 'progress 2s linear infinite',
        'bounce-slow': 'bounce 3s infinite',
      },
      maxHeight: theme => ({
        0: '0',
        ...theme('spacing'),
        full: '100%',
        screen: '100vh',
      }),
      minHeight: theme => ({
        0: '0',
        ...theme('spacing'),
        full: '100%',
        screen: '100vh',
      }),
      minWidth: theme => ({
        0: '0',
        ...theme('spacing'),
        full: '100%',
        screen: '100vw',
      }),
      maxWidth: (theme, { breakpoints }) => ({
        0: '0',
        ...theme('spacing'),
        ...breakpoints(theme('screens')),
        full: '100%',
        screen: '100vw',
      }),
    },
  },
  plugins: [require('tailwindcss-rtl')],
};
