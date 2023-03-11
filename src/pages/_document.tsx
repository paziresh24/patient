import classNames from '@/common/utils/classNames';
import type { NextComponentType } from 'next';
import { Head, Html, Main, NextScript } from 'next/document';

const CustomDocument: NextComponentType = (props: any) => {
  const { locale } = props.__NEXT_DATA__;
  const dir = locale === 'fa' ? 'rtl' : 'ltr';
  return (
    <Html lang="fa-IR" dir={dir}>
      <Head>
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="preconnect" href="https://analytics.google.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://static.hotjar.com" />
        <link rel="preconnect" href="https://api.paziresh24.com" />
        <meta name="application-name" content="پذیرش۲۴" />
        <meta name="apple-mobile-web-app-title" content="پذیرش۲۴" />
        <meta name="theme-color" content="#FFFFFF" />
        <meta name="msapplication-TileColor" content="#FFFFFF" />
        <meta name="content-language" content="fa" />
        <meta name="Language" content="fa" />
        <meta name="author" content="پذیرش24" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="format-detection" content="telephone=no" />
        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Corporation',
              'name': 'paziresh24',
              'alternateName': 'پذیرش24',
              'url': 'https://www.paziresh24.com/',
              'logo': 'https://www.paziresh24.com/img/logo.png',
              'description':
                'پذیرش24 پلتفرم سلامت الکترونیک با هدف بهبود ارتباط بین پزشک و بیمار در سال 94 توسط ابوالفضل ساجدی ، ابراهیم قانع ، محمد رضا طباطبایی ، حامد صادقی نژاد و یک تیم یزدی طراحی شد . امکان ثبت نوبت بدون محدودیت و با هر روشی که شما راحت ترید ( وبسایت ، اپلیکیشن ، تلفن ، تلگرام و… ) از وجه تمایزهای پذیرش24 با سایر سامانه‌های نوبت دهی می باشد . از طرف دیگر پذیرش24 با امکان مدیریت یکپارچه نوبت ها ، تحلیل داده ها و امکانات بسیار دیگر ، به راهکاری برای افزایش بهره وری و کاهش هزینه های پزشکان ، بیمارستان ها و کلینیک ها تبدیل شد که این دو بعدی بودن کاربری برای پزشکان و بیماران را تایید می کند .',
              'foundingDate': '2016',
              'founders': [
                { '@type': 'Person', 'name': 'ابوالفضل ساجدی' },
                { '@type': 'Person', 'name': 'محمد ابراهیم قانع' },
                { '@type': 'Person', 'name': 'محمد رضا طباطبایی' },
                { '@type': 'Person', 'name': 'حامد صادقی نژاد' },
              ],
              'sameAs': [
                'https://www.facebook.com/paziresh24com/',
                'https://twitter.com/paziresh24/',
                'https://www.instagram.com/paziresh24/',
                'https://www.linkedin.com/company/paziresh24/',
                'https://www.paziresh24.com/home/about/',
              ],
              'contactPoint': [{ '@type': 'ContactPoint', 'telephone': '+98-21-25015015', 'contactType': 'customer service' }],
            }),
          }}
        />
      </Head>
      <body
        className={classNames('bg-slate-100 antialiased scroll-smooth', {
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
