import useCustomize from '@/common/hooks/useCustomize';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';

interface SeoProps {
  title?: string;
  titleWithBrandName?: boolean;
  description?: string;
  children?: ReactNode;
  jsonlds?: any[];
  canonicalUrl?: string;
  openGraph?: {
    image?: {
      src: string;
      type: string;
      alt: string;
    };
  };
  host?: string;
  noIndex?: boolean;
}

const getPathFromUrl = (url: string): string => {
  return url.split(/[?#]/)[0];
};

export const Seo = (props: SeoProps) => {
  const { title, description = '', jsonlds, canonicalUrl, openGraph, host = '', titleWithBrandName = true, children, noIndex } = props;
  const { asPath } = useRouter();
  const customize = useCustomize(state => state.customize);

  const brandName = customize?.partnerTitle ? customize?.partnerTitle : 'پذیرش24';

  const titleTemplate = `${title ?? ''}${titleWithBrandName ? ` | ${brandName}` : ''}`;

  // َUniversity Site
  if (customize?.partnerTitle)
    return (
      <>
        <Head>
          <title>{titleTemplate}</title>
          <link rel="canonical" href={`https://${host}/`} />
          <meta name="robots" content={noIndex ? 'noindex' : 'index, follow'} />
        </Head>
      </>
    );

  // Main Site
  return (
    <Head>
      <title>{titleTemplate}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl ?? `https://www.paziresh24.com${getPathFromUrl(asPath)}`} />
      <meta name="robots" content={noIndex ? 'noindex' : 'index, follow'} />
      <meta property="og:title" content={titleTemplate} />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content={brandName} />
      <meta property="og:url" content={`https://www.paziresh24.com${asPath}`} />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content="fa_IR" />
      <meta property="og:image" content={openGraph?.image?.src ?? `https://www.paziresh24.com/logos/icon_x192.png`} />
      <meta property="og:image:secure_url" content={openGraph?.image?.src ?? `https://www.paziresh24.com/logos/icon_x192.png`} />
      <meta property="og:image:type" content={openGraph?.image?.type ?? 'image/png'} />
      <meta property="og:image:alt" content={openGraph?.image?.alt ?? brandName} />
      <meta property="twitter:title" content={titleTemplate} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:creator" content={brandName} />
      <meta property="twitter:site" content={brandName} />
      <meta property="twitter:url" content={`https://www.paziresh24.com${asPath}`} />
      <meta property="twitter:image" content={openGraph?.image?.src ?? `https://www.paziresh24.com/logos/icon_x192.png`} />
      <meta property="twitter:image:alt" content={openGraph?.image?.alt ?? brandName} />
      <meta property="twitter:card" content="summary" />
      <meta name="author" content={brandName} />
      <meta name="application-name" content={brandName} />
      <meta name="apple-mobile-web-app-title" content={brandName} />
      {jsonlds?.map((item, index) => (
        <script type="application/ld+json" key={index} dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }} />
      ))}
      {children}
    </Head>
  );
};

export default Seo;
