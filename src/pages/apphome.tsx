import Logo from '@/common/components/atom/logo';
import { LayoutWithHeaderAndFooter } from '@/common/components/layouts/layoutWithHeaderAndFooter';
import Seo from '@/common/components/layouts/seo';
import { withCSR } from '@/common/hoc/withCsr';
import { withServerUtils } from '@/common/hoc/withServerUtils';
import useApplication from '@/common/hooks/useApplication';
import OnlineVisitPromote from '@/modules/home/components/onlineVisitPromote';
import { useRecentSearch } from '@/modules/search/hooks/useRecentSearch';
import RecentSearch from '@/modules/search/view/recentSearch';
import Suggestion from '@/modules/search/view/suggestion';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next/types';
import { ReactElement, useEffect } from 'react';

const Home = () => {
  const isApplication = useApplication();
  const { query, isReady } = useRouter();
  const { recent } = useRecentSearch();

  useEffect(() => {
    if (isReady && isApplication) {
      if (query.platform) localStorage.setItem('app:platform', query.platform as string);
      if (query.version_code) localStorage.setItem('app:version_code', query.version_code as string);
      if (query.version_name) localStorage.setItem('app:version_name', query.version_name as string);
      if (query.download_source) localStorage.setItem('app:download_source', query.download_source as string);
    }
  }, [isReady, query, isApplication]);

  return (
    <>
      <Seo title="اپلیکیشن پذیرش24" noIndex />

      <main className="flex flex-col items-center justify-center flex-grow w-full pb-20 mx-auto space-y-6 bg-white md:w-96">
        <Logo as="h1" className="text-2xl md:text-3xl" width={55} />

        <div className="flex justify-center w-full px-4">
          <Suggestion />
        </div>
        <div className="flex justify-center w-full px-4">{recent.length > 0 && <RecentSearch />}</div>
        <OnlineVisitPromote />
      </main>
    </>
  );
};

Home.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutWithHeaderAndFooter
      shouldShowBrand={false}
      shouldShowPromoteApp={false}
      {...page.props.config}
      showHeader={false}
      showFooter={false}
    >
      {page}
    </LayoutWithHeaderAndFooter>
  );
};

export const getServerSideProps = withCSR(
  withServerUtils(async (context: GetServerSidePropsContext) => {
    return {
      props: {
        query: context.query,
      },
    };
  }),
);

export default Home;
