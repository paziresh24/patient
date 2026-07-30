import { LayoutWithHeaderAndFooter } from '@/common/components/layouts/layoutWithHeaderAndFooter';
import Seo from '@/common/components/layouts/seo';
import { withServerUtils } from '@/common/hoc/withServerUtils';
import ContactUs from '@/modules/legal/views/contactUs';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { ReactElement } from 'react';

const CANONICAL_URL = 'https://www.paziresh24.com/contact-us/';

const contactJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'تماس با ما',
  url: CANONICAL_URL,
  inLanguage: 'fa',
  isPartOf: {
    '@type': 'WebSite',
    name: 'پذیرش24',
    url: 'https://www.paziresh24.com/',
  },
  mainEntity: {
    '@type': 'Organization',
    name: 'پذیرش۲۴',
    email: 'info@paziresh24.com',
    telephone: '+98-21-25015015',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'یزد',
      streetAddress: 'میدان آزادی، خیابان شهید مطهری، پارک علم و فناوری اقبال',
      postalCode: '8917697998',
      addressCountry: 'IR',
    },
  },
};

const ContactUsPage = () => {
  return (
    <>
      <Seo
        title="تماس با ما"
        description="تماس با پذیرش۲۴ — پشتیبانی، صندوق صوتی، ایمیل و آدرس دفتر یزد."
        canonicalUrl={CANONICAL_URL}
      >
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(contactJsonLd) }} />
      </Seo>
      <ContactUs />
    </>
  );
};

ContactUsPage.getLayout = function getLayout(page: ReactElement) {
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

export default ContactUsPage;
