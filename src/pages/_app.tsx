import Provider from '@/components/layouts/provider';
import type { NextPage } from 'next';
import { DefaultSeo, OrganizationJsonLd, SiteLinksSearchBoxJsonLd } from 'next-seo';
import type { AppProps } from 'next/app';
import type { ReactElement, ReactNode } from 'react';
import SEO from '../../next-seo.config';
import '../styles/globals.css';

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? (page => page);

  return (
    <Provider>
      {getLayout(
        <>
          <DefaultSeo {...SEO} />
          <OrganizationJsonLd
            name="paziresh24"
            alternateName="پذیرش24"
            description="پذیرش24 پلتفرم سلامت الکترونیک با هدف بهبود ارتباط بین پزشک و بیمار در سال 94 توسط ابوالفضل ساجدی ، ابراهیم قانع ، محمد رضا طباطبایی ، حامد صادقی نژاد و یک تیم یزدی طراحی شد . امکان ثبت نوبت بدون محدودیت و با هر روشی که شما راحت ترید ( وبسایت ، اپلیکیشن ، تلفن ، تلگرام و… ) از وجه تمایزهای پذیرش24 با سایر سامانه‌های نوبت دهی می باشد . از طرف دیگر پذیرش24 با امکان مدیریت یکپارچه نوبت ها ، تحلیل داده ها و امکانات بسیار دیگر ، به راهکاری برای افزایش بهره وری و کاهش هزینه های پزشکان ، بیمارستان ها و کلینیک ها تبدیل شد که این دو بعدی بودن کاربری برای پزشکان و بیماران را تایید می کند ."
            url="https://www.paziresh24.com/"
            logo="https://www.paziresh24.com/img/logo.png"
            contactPoint={[
              {
                '@type': 'ContactPoint',
                'telephone': '+98-21-25015015',
                'contactType': 'customer service',
              },
            ]}
            sameAs={[
              'https://www.facebook.com/paziresh24',
              'https://twitter.com/paziresh24',
              'https://www.instagram.com/paziresh24/',
              'https://www.linkedin.com/company/paziresh24/',
              'https://www.paziresh24.com/home/about/',
            ]}
            foundingDate="2016"
            founders={[
              {
                '@type': 'Person',
                'name': 'ابوالفضل ساجدی',
              },
              {
                '@type': 'Person',
                'name': 'محمد ابراهیم قانع',
              },
              {
                '@type': 'Person',
                'name': 'محمد رضا طباطبایی',
              },
              {
                '@type': 'Person',
                'name': 'حامد صادقی نژاد',
              },
            ]}
          />
          <SiteLinksSearchBoxJsonLd
            url="https://www.paziresh24.com/"
            potentialActions={[
              {
                target: 'https://www.paziresh24.com/s/?text={search_term_string}',
                queryInput: 'required name=search_term_string',
              },
            ]}
          />
          <Component {...pageProps} />
        </>,
      )}
    </Provider>
  );
}

export default MyApp;
