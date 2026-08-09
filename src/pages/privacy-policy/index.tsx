import { LayoutWithHeaderAndFooter } from '@/common/components/layouts/layoutWithHeaderAndFooter';
import Seo from '@/common/components/layouts/seo';
import { withServerUtils } from '@/common/hoc/withServerUtils';
import PrivacyPolicy from '@/modules/legal/views/privacyPolicy';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { ReactElement } from 'react';

const CANONICAL_URL = 'https://www.paziresh24.com/privacy-policy/';

const PrivacyPolicyPage = () => {
  return (
    <>
      <Seo
        title="سیاست حفظ حریم خصوصی | Privacy Policy"
        description="سیاست حفظ حریم خصوصی پذیرش۲۴ — نحوه جمع‌آوری، استفاده و نگهداری اطلاعات کاربران. Paziresh24 Privacy Policy — how we collect, use, and protect your information."
        canonicalUrl={CANONICAL_URL}
      >
        <link rel="alternate" hrefLang="fa" href={CANONICAL_URL} />
        <link rel="alternate" hrefLang="en" href={CANONICAL_URL} />
        <link rel="alternate" hrefLang="x-default" href={CANONICAL_URL} />
        <meta property="og:locale:alternate" content="en_US" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebPage',
              name: 'سیاست حفظ حریم خصوصی | Privacy Policy',
              url: CANONICAL_URL,
              inLanguage: ['fa', 'en'],
              isPartOf: {
                '@type': 'WebSite',
                name: 'پذیرش24',
                url: 'https://www.paziresh24.com/',
              },
            }),
          }}
        />
      </Seo>
      <PrivacyPolicy />
    </>
  );
};

PrivacyPolicyPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutWithHeaderAndFooter
      {...page.props.config}
      shouldShowPromoteApp={false}
      showBottomNavigation={false}
      className="bg-[#F2F3F5]"
    >
      {page}
    </LayoutWithHeaderAndFooter>
  );
};

export const getServerSideProps: GetServerSideProps = withServerUtils(async (context: GetServerSidePropsContext) => {
  return {
    props: {
      query: context.query,
    },
  };
});

export default PrivacyPolicyPage;
