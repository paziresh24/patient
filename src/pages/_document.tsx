import classNames from '@/common/utils/classNames';
import type { NextComponentType } from 'next';
import { Head, Html, Main, NextScript } from 'next/document';
import Script from 'next/script';

const CustomDocument: NextComponentType = (props: any) => {
  const { locale } = props.__NEXT_DATA__;
  const dir = locale === 'fa' ? 'rtl' : 'ltr';
  return (
    <Html lang="fa-IR" dir={dir} className="scroll-smooth">
      <Head>
        <link rel="icon" type="image/x-icon" href="/logos/favicon.ico" />
        <link rel="preconnect" href="https://api.paziresh24.com" />
        <link rel="preconnect" href="https://apigw.paziresh24.com" />
        <meta name="theme-color" content="#FFFFFF" />
        <meta name="msapplication-TileColor" content="#FFFFFF" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="format-detection" content="telephone=no" />
        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
        <meta name="google" content="notranslate" />
        <Script strategy="afterInteractive" src="https://gozargah.paziresh24.com/assets/js/gozar.js" />
        <Script strategy="afterInteractive" src="https://accounts.google.com/gsi/client" />
      </Head>
      <body
        className={classNames('bg-[#f2f3f5] antialiased  pwa:select-none', {
          'dont-fa-number-font': dir === 'ltr',
        })}
        style={{ direction: dir }}
      >
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};
export default CustomDocument;
