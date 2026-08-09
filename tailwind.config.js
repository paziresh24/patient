const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  safelist: [
    'rtl',
    'ltr',
    'scroll-smooth',
    'antialiased',
    'pwa:select-none',
    'dont-fa-number-font',
  ],
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
        'insight-glass-sweep': {
          '0%': { transform: 'translateX(-130%) skewX(-16deg)' },
          '100%': { transform: 'translateX(240%) skewX(-16deg)' },
        },
        'doctor-fade-up': {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'doctor-sheet-in': {
          from: { opacity: '0', transform: 'scale(0.97) translateY(8px)' },
          to: { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        'doctor-backdrop-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'doctor-scale-in': {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        'doctor-content-in': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'doctor-content-fade': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'doctor-content-slide': {
          from: { opacity: '0', transform: 'translateX(10px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        'doctor-pop': {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '70%': { opacity: '1', transform: 'scale(1.03)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'doctor-sheet-out': {
          from: { opacity: '1', transform: 'scale(1) translateY(0)' },
          to: { opacity: '0', transform: 'scale(0.97) translateY(8px)' },
        },
        'doctor-backdrop-out': {
          from: { opacity: '1' },
          to: { opacity: '0' },
        },
        'doctor-wallet-swap': {
          from: { opacity: '0', filter: 'blur(8px)', transform: 'translateY(5px) scale(0.96)' },
          to: { opacity: '1', filter: 'blur(0px)', transform: 'translateY(0) scale(1)' },
        },
      },
      animation: {
        'progress': 'progress 2s linear infinite',
        'bounce-slow': 'bounce 3s infinite',
        'insight-glass-sweep': 'insight-glass-sweep 0.85s ease-out forwards',
        'doctor-fade-up': 'doctor-fade-up 0.42s ease-out forwards',
        'doctor-sheet-in': 'doctor-sheet-in 0.24s ease-out forwards',
        'doctor-backdrop-in': 'doctor-backdrop-in 0.2s ease-out forwards',
        'doctor-scale-in': 'doctor-scale-in 0.28s ease-out forwards',
        'doctor-content-in': 'doctor-content-in 0.28s cubic-bezier(0.32,0.72,0,1) forwards',
        'doctor-content-fade': 'doctor-content-fade 0.22s ease-out forwards',
        'doctor-content-slide': 'doctor-content-slide 0.28s cubic-bezier(0.32,0.72,0,1) forwards',
        'doctor-pop': 'doctor-pop 0.32s cubic-bezier(0.32,0.72,0,1) forwards',
        'doctor-sheet-out': 'doctor-sheet-out 0.2s ease-in forwards',
        'doctor-backdrop-out': 'doctor-backdrop-out 0.18s ease-in forwards',
        'doctor-wallet-swap': 'doctor-wallet-swap 0.34s cubic-bezier(0.32,0.72,0,1) forwards',
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
