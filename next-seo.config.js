/* eslint-disable import/no-anonymous-default-export */
import logo from './public/logos/primary.svg';
export default {
  titleTemplate: '%s | پذیرش24',
  description:
    'پذیرش24، دکتر آنلاین و نوبت دهی سریع از بهترین پزشکان ، درمانگاه ها ، کلینیک ها و بیمارستان های کشور.از طریق این سایت و یا اپلیکیشن پذیرش24 اینترنتی با جستجوی دکتر مورد نظر ، مشاوره تلفنی و یا نوبت بگیرید.',
  openGraph: {
    url: 'https://www.paziresh24.com',
    images: [
      {
        url: `https://www.paziresh24.com${logo.src}`,
        alt: 'پذیرش24',
        type: 'image/svg+xml',
      },
    ],
    site_name: 'پذیرش24',
    type: 'website',
    locale: 'fa_IR',
  },
  twitter: {
    handle: 'پذیرش24',
    site: 'پذیرش24',
    cardType: 'summary',
  },
  additionalMetaTags: [
    {
      property: 'msapplication-TileColor',
      content: '#2d89ef',
    },
    {
      property: 'theme-color',
      content: '#3f4079',
    },
    {
      property: 'apple-mobile-web-app-title',
      content: 'پذیرش۲۴',
    },
    {
      property: 'application-name',
      content: 'پذیرش24',
    },
    {
      property: 'owner',
      content: 'پذیرش24',
    },
    {
      property: 'autor',
      content: 'پذیرش24',
    },
    {
      property: 'Language',
      content: 'fa',
    },
    {
      property: 'content-language',
      content: 'fa',
    },
    {
      property: 'dc.description',
      content:
        'پذیرش24، دکتر آنلاین و نوبت دهی سریع از بهترین پزشکان ، درمانگاه ها ، کلینیک ها و بیمارستان های کشور.از طریق این سایت و یا اپلیکیشن پذیرش24 اینترنتی با جستجوی دکتر مورد نظر ، مشاوره تلفنی و یا نوبت بگیرید.',
    },
    {
      property: 'dc.type',
      content: 'website',
    },
    {
      property: 'dc.language',
      content: 'fa-ir',
    },
  ],
  additionalLinkTags: [
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    {
      rel: 'icon',
      type: 'apple-touch-icon',
      sizes: '180x180',
      href: '/apple-touch-icon.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      href: '/favicon-32x32.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
      href: '/favicon-16x16.png',
    },
    {
      rel: 'mask-icon',
      href: '/safari-pinned-tab.svg',
      color: '#5bbad5',
    },
    {
      rel: 'preconnect',
      href: 'https://www.google-analytics.com',
    },
    {
      rel: 'preconnect',
      href: 'https://static.hotjar.com',
    },
  ],
};
