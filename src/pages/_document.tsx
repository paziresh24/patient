import classNames from '@/common/utils/classNames';
import type { NextComponentType } from 'next';
import { Head, Html, Main, NextScript } from 'next/document';
import Script from 'next/script';
import { DocumentContext } from 'next/document';

const CustomDocument: NextComponentType = (props: any) => {
  const { locale, xSid } = props.__NEXT_DATA__;
  const dir = locale === 'fa' ? 'rtl' : 'ltr';
  ''.includes;
  return (
    <Html lang="fa-IR" dir={dir} className="scroll-smooth">
      <Head>
        <link rel="icon" type="image/x-icon" href="/logos/favicon.ico" />
        <link rel="dns-prefetch" href="https://apigw.paziresh24.com" />
        <link rel="dns-prefetch" href="https://gozargah.paziresh24.com" />
        <link rel="dns-prefetch" href="https://accounts.google.com" />
        <link rel="preconnect" href="https://api.paziresh24.com" />
        <link rel="preconnect" href="https://apigw.paziresh24.com" />
        <link 
          rel="preload" 
          href="/fonts/IRANSansXFaNum-Medium.woff2" 
          as="font" 
          type="font/woff2" 
          crossOrigin="anonymous" 
        />
        <link 
          rel="preload" 
          href="/fonts/IRANSansXFaNum-Regular.woff2" 
          as="font" 
          type="font/woff2" 
          crossOrigin="anonymous" 
        />
        <meta name="theme-color" content="#FFFFFF" />
        <meta name="msapplication-TileColor" content="#FFFFFF" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="format-detection" content="telephone=no" />
        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
        <meta name="google" content="notranslate" />
        {xSid && <meta name="x-sid" content={xSid} />}
        <Script strategy="lazyOnload" src="https://gozargah.paziresh24.com/assets/js/gozar.js" />
        <Script strategy="lazyOnload" src="https://accounts.google.com/gsi/client" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
                window.addEventListener('error', function (e) {
                  const tgt = e.target || e.srcElement;
                  if (tgt.tagName === 'LINK' || tgt.tagName === 'SCRIPT') {
                    const url = tgt.href || tgt.src;
                    if(url.includes('_next')){
                      // Get x-sid from meta tag
                      const xSid = document.querySelector('meta[name="x-sid"]')?.getAttribute('content');
                      
                      navigator.sendBeacon('https://apigw.paziresh24.com/api/log-resource-error', JSON.stringify({
                        url,
                        type: tgt.tagName,
                        current_url: window.location.href,
                        referer: window.document.referrer,
                        x_sid: xSid
                      }));
                    }
                  }
                }, true);
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

CustomDocument.getInitialProps = async (ctx: DocumentContext) => {
  const initialProps = await ctx.defaultGetInitialProps(ctx);
  const xSid = ctx.req?.headers['x-sid'] as string;
  
  return {
    ...initialProps,
    xSid
  };
};

export default CustomDocument;
