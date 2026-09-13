import { DOCTOR_HOME_INLINE_DEVICE_MARK_SCRIPT, DOCTOR_HOME_INLINE_REDIRECT_SCRIPT } from '@/common/utils/doctorDeviceCache';
import classNames from '@/common/utils/classNames';
import type { NextComponentType } from 'next';
import { Head, Html, Main, NextScript } from 'next/document';
import Script from 'next/script';
import { plasmicRadixBaseCss } from '../styles/plasmicRadixBaseCss';

const CustomDocument: NextComponentType = (props: any) => {
  const { locale } = props.__NEXT_DATA__;
  const dir = locale === 'fa' ? 'rtl' : 'ltr';
  ''.includes;
  return (
    <Html lang="fa-IR" dir={dir} className="scroll-smooth">
      <Head>
        <script dangerouslySetInnerHTML={{ __html: DOCTOR_HOME_INLINE_DEVICE_MARK_SCRIPT }} />
        <script dangerouslySetInnerHTML={{ __html: DOCTOR_HOME_INLINE_REDIRECT_SCRIPT }} />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" type="image/x-icon" href="/logos/favicon.ico" />
        <link rel="dns-prefetch" href="https://apigw.paziresh24.com" />
        <link rel="preconnect" href="https://apigw.paziresh24.com" />
        <link rel="preconnect" href="https://growthbook-api.paziresh24.com" />
        {/*
          DR-08 §۱۹: preload the font the page ACTUALLY renders with.
          globals.css declares two families behind feature queries: `IRANSansXV` (variable) inside
          `@supports (font-variation-settings: normal)`, and the static `IRANSansX` FaNum weights
          inside `@supports not (...)`. Every browser with variable-font support — i.e. effectively
          all of them — renders with IRANSansXV. The two preloads that used to live here pointed at
          the *legacy* family, so every modern visitor eagerly downloaded 61KB it would never use,
          while IRANSansXV was left to be discovered from CSS: measured on production it started at
          5758ms and landed at 8073ms, and the resulting swap moved the layout at ~8.7s — which both
          produced a CLS event and re-fired LCP with a second, larger entry (DR-08 §۱۸.۶).
          The URL must match the one in globals.css byte-for-byte or the preload buys nothing and
          the file is fetched twice; both now point at the unhashed /fonts/ path under public/.
        */}
        <link rel="preload" href="/fonts/IRANSansXV.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <meta name="theme-color" content="#FFFFFF" />
        <meta name="msapplication-TileColor" content="#FFFFFF" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="format-detection" content="telephone=no" />
        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
        <meta name="google" content="notranslate" />
        <Script id="rasan-loader" strategy="afterInteractive">
          {`
            (function() {
              function initRasan() {
                if (window.rasan && window.rasan.init) {
                  window.rasan.init({appId: "82f744a9-d1f2-4e4e-9a81-b1a28bb6fdf4"});
                  return true;
                }
                return false;
              }
              
              window.RASAN = window.RASAN || { queue: [] };
              window.rasan = function() { window.RASAN.queue.push(arguments); };
              
              // اگر rasan از قبل لود شده بود
              if (initRasan()) {
                return;
              }
              
              var s = document.createElement("script");
              s.src = "https://rasan.paziresh24.com/sdk.js";
              s.async = true;
              s.onload = function() {
                initRasan();
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
      </Head>
      <body
        className={classNames('bg-[#f2f3f5] antialiased  pwa:select-none', {
          'dont-fa-number-font': dir === 'ltr',
        })}
        style={{ direction: dir }}
      >
        <Main />
        {/*
          DR-08 §۲۵.۴ (re-land): بلوکِ base CSSِ Radix عمداً این‌جاست — بعدِ `<Main/>`، در انتهایِ
          `<body>` — نه در `<Head>`/`_app.tsx`. نسخه‌ی اول این CSS را در یک stylesheetِ معمولیِ head
          گذاشته بود؛ نتیجه یک رگرسیونِ cascade بود که کادرِ «انتخاب شهر» را نامرئی کرد
          (ghane/docs/bug-tickets/city-modal-radix-basestyles-cascade.md): `.pl__fixed` در تساویِ
          specificityِ (0,1,0) به CSS-moduleِ Plasmic باخت، چون آن sheet در head *بعد از* CSSِ ما
          می‌آمد. cascade با **موقعیتِ عنصر در سند** تصمیم می‌گیرد، نه زمانِ درج — پس یک <style> در
          آخرینِ نقطه‌ی body، حتی وقتی CSS-moduleِ یک chunkِ lazy در runtime به head اضافه شود، باز
          هم آخرین در ترتیبِ سند و برنده‌ی هر تساویِ specificity می‌ماند (اثباتِ تجربی‌اش، شاملِ حالتِ
          ناوبریِ client-side: e2e/specs/dialog-city-select.spec.ts).
        */}
        <style id="plasmic-radix-base" dangerouslySetInnerHTML={{ __html: plasmicRadixBaseCss }} />
        <NextScript />
      </body>
    </Html>
  );
};
export default CustomDocument;
