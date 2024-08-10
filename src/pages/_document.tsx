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
        <link rel="preconnect" href="https://www.googletagmanager.com" />
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
        <Script id="najva-script" strategy="beforeInteractive">{`(function(){
           var now = new Date();
           var version = now.getFullYear().toString() + "0" + now.getMonth() + "0" + now.getDate() +
               "0" + now.getHours();
           var head = document.getElementsByTagName("head")[0];
           var link = document.createElement("link");
           link.rel = "stylesheet";
           link.href = "https://van.najva.com/static/cdn/css/local-messaging.css" + "?v=" + version;
           head.appendChild(link);
           var script = document.createElement("script");
           script.type = "text/javascript";
           script.async = true;
           script.src = "https://van.najva.com/static/js/scripts/new-website387894-website-58369-ca07382e-9477-44a1-90a3-1a65b5a0557e.js" + "?v=" + version;
           head.appendChild(script);
           })()`}</Script>
      </Head>
      <body
        className={classNames('bg-slate-100 antialiased  pwa:select-none', {
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
