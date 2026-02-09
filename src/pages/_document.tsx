import classNames from '@/common/utils/classNames';
import type { NextComponentType } from 'next';
import { Head, Html, Main, NextScript } from 'next/document';
import Script from 'next/script';

const CustomDocument: NextComponentType = (props: any) => {
  const { locale } = props.__NEXT_DATA__;
  const dir = locale === 'fa' ? 'rtl' : 'ltr';
  ''.includes;
  return (
    <Html lang="fa-IR" dir={dir} className="scroll-smooth">
      <Head>
        <link rel="icon" type="image/x-icon" href="/logos/favicon.ico" />
        <link rel="dns-prefetch" href="https://apigw.paziresh24.com" />
        <link rel="preconnect" href="https://apigw.paziresh24.com" />
        <link rel="preconnect" href="https://growthbook-api.paziresh24.com" />
        <link rel="preload" href="/fonts/IRANSansXFaNum-Medium.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/IRANSansXFaNum-Regular.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <meta name="theme-color" content="#FFFFFF" />
        <meta name="msapplication-TileColor" content="#FFFFFF" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="format-detection" content="telephone=no" />
        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
        <meta name="google" content="notranslate" />
        <Script id="ping-loader" strategy="afterInteractive">
          {`
            (function() {
              function initPing() {
                if (window.ping && window.ping.init) {
                  window.ping.init({appId: "6bf2755a-6613-4344-be4e-f5de4b422828"});
                  return true;
                }
                return false;
              }
              
              window.PING = window.PING || { queue: [] };
              window.ping = function() { window.PING.queue.push(arguments); };
              
              // اگر ping از قبل لود شده بود
              if (initPing()) {
                return;
              }
              
              var s = document.createElement("script");
              s.src = "https://ping.darkube.app/sdk.js";
              s.async = true;
              s.onload = function() {
                initPing();
              };
              document.head.appendChild(s);
            })();
          `}
        </Script>
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
          strategy="afterInteractive"
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
