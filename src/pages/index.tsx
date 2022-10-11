import Logo from '@/common/components/atom/logo';
import { LayoutWithHeaderAndFooter } from '@/common/components/layouts/layoutWithHeaderAndFooter';
import useResponsive from '@/common/hooks/useResponsive';
import { NextSeo } from 'next-seo';
import dynamic from 'next/dynamic';
import { ReactElement } from 'react';
import { NextPageWithLayout } from './_app';
const Promote = dynamic(() => import('@/modules/home/components/promote'));
const Suggestion = dynamic(() => import('@/modules/search/view/suggestion'));
const RecentSearch = dynamic(() => import('@/modules/search/view/recentSearch'));

const Home: NextPageWithLayout = () => {
  const { isMobile } = useResponsive();

  return (
    <>
      <NextSeo title="نوبت دهی پزشکی، سامانه نوبت دهی اینترنتی بیمارستان و پزشکان" canonical="https://www.paziresh24.com/" />
      <main className="h-[91vh] flex flex-col justify-center items-center p-5 pb-40 space-y-8">
        <Logo className="text-2xl md:text-3xl" />
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
