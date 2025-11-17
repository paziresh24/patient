import localFont from 'next/font/local';

export const iranSansFont = localFont({
  src: [
    { path: '../../public/fonts/IRANSansXV.woff2', weight: '100 900', style: 'normal' },
    { path: '../../public/fonts/IRANSansXFaNum-Thin.woff2', weight: '100', style: 'normal' },
    { path: '../../public/fonts/IRANSansXFaNum-UltraLight.woff2', weight: '200', style: 'normal' },
    { path: '../../public/fonts/IRANSansXFaNum-Light.woff2', weight: '300', style: 'normal' },
    { path: '../../public/fonts/IRANSansXFaNum-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../../public/fonts/IRANSansXFaNum-Medium.woff2', weight: '500', style: 'normal' },
    { path: '../../public/fonts/IRANSansXFaNum-DemiBold.woff2', weight: '600', style: 'normal' },
    { path: '../../public/fonts/IRANSansXFaNum-Bold.woff2', weight: '700', style: 'normal' },
    { path: '../../public/fonts/IRANSansXFaNum-ExtraBold.woff2', weight: '800', style: 'normal' },
    { path: '../../public/fonts/IRANSansXFaNum-Black.woff2', weight: '900', style: 'normal' },
  ],
  display: 'swap',
  variable: '--font-iran-sans',
  fallback: ['Tahoma', 'sans-serif'],
});
