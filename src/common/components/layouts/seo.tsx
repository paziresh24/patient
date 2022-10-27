import logo from '@/public/logos/primary.svg';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';

interface SeoProps {
  title?: string;
  description?: string;
  children?: ReactNode;
  jsonlds?: any[];
}

const getPathFromUrl = (url: string): string => {
  return url.split(/[?#]/)[0];
};

export const Seo = (props: SeoProps) => {
  const { title, description, jsonlds, children } = props;
  const { asPath } = useRouter();

  const titleTemplate = `${title ?? ''} | پذیرش24`;

  return (
    <Head>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />

      <title>{titleTemplate}</title>
      <meta name="title" content={titleTemplate} />
      <meta name="description" content={description} />

      <link rel="canonical" href={`https://www.paziresh24.com${getPathFromUrl(asPath)}`} />

      <meta property="og:title" content={titleTemplate} />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content="پذیرش24" />
      <meta property="og:url" content={`https://www.paziresh24.com${asPath}`} />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content="fa_IR" />
      <meta property="og:image" content={`https://www.paziresh24.com${logo.src}`} />
      <meta property="og:image:secure_url" content={`https://www.paziresh24.com${logo.src}`} />
      <meta property="og:image:type" content="image/svg+xml" />
      <meta property="og:image:alt" content="پذیرش24" />
      <meta property="dc.title" content={titleTemplate} />
      <meta property="dc.description" content={description} />
      <meta property="dc.type" content="website" />
      <meta property="dc.identifier" content={`https://www.paziresh24.com${asPath}`} />
      <meta property="dc.language" content="fa-ir" />
      <meta property="twitter:title" content={titleTemplate} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:creator" content="پذیرش24" />
      <meta property="twitter:site" content="پذیرش24" />
      <meta property="twitter:url" content={`https://www.paziresh24.com${asPath}`} />
      <meta property="twitter:image" content={`https://www.paziresh24.com${logo.src}`} />
      <meta property="twitter:image:alt" content="پذیرش24" />
      <meta property="twitter:card" content="summary" />
      <meta itemProp="name" content={titleTemplate} />
      <meta itemProp="description" content={description} />
      <meta itemProp="image" content={`https://www.paziresh24.com${logo.src}`} />

      {jsonlds?.map((item, index) => (
        <script type="application/ld+json" key={index} dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }} />
      ))}

      {children}
    </Head>
  );
};

export default Seo;
