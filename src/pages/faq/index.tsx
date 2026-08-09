import { LayoutWithHeaderAndFooter } from '@/common/components/layouts/layoutWithHeaderAndFooter';
import Seo from '@/common/components/layouts/seo';
import { withServerUtils } from '@/common/hoc/withServerUtils';
import { faqCategories, faqPageTitle } from '@/modules/legal/constants/faqContent';
import Faq from '@/modules/legal/views/faq';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { ReactElement } from 'react';

const CANONICAL_URL = 'https://www.paziresh24.com/faq/';

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  name: faqPageTitle,
  url: CANONICAL_URL,
  inLanguage: 'fa',
  mainEntity: faqCategories.flatMap(category =>
    category.items.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  ),
};

const FaqPage = () => {
  return (
    <>
      <Seo
        title="سوالات متداول"
        description="پاسخ سوالات پرتکرار بیماران و پزشکان درباره نوبت‌دهی حضوری، ویزیت آنلاین و خدمات پذیرش۲۴."
        canonicalUrl={CANONICAL_URL}
      >
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      </Seo>
      <Faq />
    </>
  );
};

FaqPage.getLayout = function getLayout(page: ReactElement) {
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

export default FaqPage;
