import Logo from '@/common/components/atom/logo';
import { LayoutWithHeaderAndFooter } from '@/common/components/layouts/layoutWithHeaderAndFooter';
import useResponsive from '@/common/hooks/useResponsive';
import RecentSearch from '@/modules/search/view/recentSearch';
import Suggestion from '@/modules/search/view/suggestion';
import { NextSeo, SiteLinksSearchBoxJsonLd } from 'next-seo';
import dynamic from 'next/dynamic';
import { ReactElement } from 'react';
import { NextPageWithLayout } from './_app';
const Promote = dynamic(() => import('@/modules/home/components/promote'));

const Home: NextPageWithLayout = () => {
  const { isMobile } = useResponsive();

  return (
    <>
      <NextSeo
        title="نوبت دهی پزشکی، سامانه نوبت دهی اینترنتی بیمارستان و پزشکان"
        additionalMetaTags={[
          { property: 'title', content: 'نوبت دهی پزشکی، سامانه نوبت دهی اینترنتی بیمارستان و پزشکان | پذیرش24' },
          {
            property: 'dc.title',
            content: 'نوبت دهی پزشکی، سامانه نوبت دهی اینترنتی بیمارستان و پزشکان | پذیرش24',
          },
          {
            property: 'dc.identifier',
            content: 'https://www.paziresh24.com/',
          },
        ]}
        canonical="https://www.paziresh24.com/"
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
      <main className="h-[90vh] mb-6 md:mb-0 md:h-[92vh] bg-white flex flex-col justify-center items-center p-5 pb-48 space-y-6">
        <Logo className="text-2xl md:text-3xl" width={55} />
        <Suggestion />
        <RecentSearch />
      </main>
      {isMobile && <Promote />}
    </>
  );
};

Home.getLayout = function getLayout(page: ReactElement) {
  return <LayoutWithHeaderAndFooter shouldShowBrand={false}>{page}</LayoutWithHeaderAndFooter>;
};

export async function getServerSideProps() {
  return {
    props: {},
  };
}

export default Home;
