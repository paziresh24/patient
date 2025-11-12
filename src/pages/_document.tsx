import classNames from '@/common/utils/classNames';
import { Head, Html, Main, NextScript } from 'next/document';
import Script from 'next/script';
import { iranSansFont } from '../fonts/iransans';

const CustomDocument = (props: any) => {
  const { locale } = props.__NEXT_DATA__;
  const dir = locale === 'fa' ? 'rtl' : 'ltr';
  ''.includes;
  return (
    <Html lang="fa-IR" dir={dir} className={classNames('scroll-smooth', iranSansFont.variable)}>
      <Head>
        <link rel="icon" type="image/x-icon" href="/logos/favicon.ico" />
        <link rel="dns-prefetch" href="https://apigw.paziresh24.com" />
        <link rel="preconnect" href="https://apigw.paziresh24.com" />
        <link rel="preconnect" href="https://growthbook-api.paziresh24.com" />
        <meta name="theme-color" content="#FFFFFF" />
        <meta name="msapplication-TileColor" content="#FFFFFF" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="format-detection" content="telephone=no" />
        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
        <meta name="google" content="notranslate" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
                window.addEventListener('error', function (e) {
                  const tgt = e.target || e.srcElement;
                  if (tgt.tagName === 'LINK' || tgt.tagName === 'SCRIPT') {
                    const url = tgt.href || tgt.src;
                    if(url.includes('_next')){
                      navigator.sendBeacon('https://apigw.paziresh24.com/api/log-resource-error', JSON.stringify({
                        url,
                        type: tgt.tagName,
                        current_url: window.location.href,
                        referer: window.document.referrer
                      }));referrer
                    }
                  }
                }, true);
              `,
          }}
        />
        <Script
          id="add-manifest-link"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              window.addEventListener('load', function () {
                var manifest = document.createElement('link');
                manifest.rel = 'manifest';
                manifest.href = '/manifest.json';
                document.head.appendChild(manifest);
              });
            `,
          }}
        />
      </Head>
      <body
        className={classNames(iranSansFont.className, 'bg-[#f2f3f5] antialiased  pwa:select-none', {
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
