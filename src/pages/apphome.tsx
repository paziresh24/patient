import Logo from '@/common/components/atom/logo';
import { LayoutWithHeaderAndFooter } from '@/common/components/layouts/layoutWithHeaderAndFooter';
import Seo from '@/common/components/layouts/seo';
import { Fragment } from '@/common/fragment';
import { getServerSideGrowthBookContext } from '@/common/helper/getServerSideGrowthBookContext';
import { withCSR } from '@/common/hoc/withCsr';
import { withServerUtils } from '@/common/hoc/withServerUtils';
import useApplication from '@/common/hooks/useApplication';
import OnlineVisitPromote from '@/modules/home/components/onlineVisitPromote';
import { useRecentSearch } from '@/modules/search/hooks/useRecentSearch';
import { useSearchStore } from '@/modules/search/store/search';
import RecentSearch from '@/modules/search/view/recentSearch';
import Suggestion from '@/modules/search/view/suggestion';
import { GrowthBook, useFeatureIsOn } from '@growthbook/growthbook-react';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext, NextApiRequest } from 'next/types';
import { ReactElement, useEffect, useState } from 'react';
import SearchGlobalContextsProvider from '../../.plasmic/plasmic/paziresh_24_search/PlasmicGlobalContextsProvider';

const Home = ({ fragmentComponents }: any) => {
  const isApplication = useApplication();
  const { query, isReady } = useRouter();
  const { recent } = useRecentSearch();
  const [defaultInputValue, setDefaultInputValue] = useState('');
  const { setIsOpenSuggestion } = useSearchStore();
  const showPlasmicSuggestion = useFeatureIsOn('search_plasmic_suggestion');
  const showPlasmicRecentSearch = useFeatureIsOn('search_plasmic_recent_search');
  const showPlasmicOnlineVisit = useFeatureIsOn('search_plasmic_online_visit');

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
      <Fragment name="LocationSelectionScript" />
      <main className="flex flex-col items-center justify-center flex-grow w-full pb-20 mx-auto space-y-6 bg-white md:w-96">
        <Logo as="h1" className="text-2xl md:text-3xl" width={55} />

        <div className="flex justify-center w-full px-4">
          <Suggestion
            showPlasmicSuggestion={fragmentComponents?.showPlasmicSuggestion || showPlasmicSuggestion}
            defaultInputValue={defaultInputValue}
            setDefaultInputValue={setDefaultInputValue}
          />
        </div>
        {(fragmentComponents?.showPlasmicRecentSearch || showPlasmicRecentSearch) && (
          <div className="lg:w-[50rem] w-full">
            <Fragment
              name="RecentSearch"
              props={{
                onClick: (value: any) => {
                  setDefaultInputValue(value?.name || '');
                  setIsOpenSuggestion(true);
                },
              }}
            />
          </div>
        )}

        {recent.length > 0 && !fragmentComponents?.showPlasmicRecentSearch && !showPlasmicRecentSearch && (
          <div className="lg:w-[50rem] w-full">
            <RecentSearch />
          </div>
        )}

        <SearchGlobalContextsProvider>
          <Fragment name="HomePageShortcuts" />
        </SearchGlobalContextsProvider>
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
    let showPlasmicSuggestion: boolean = false;
    let showPlasmicRecentSearch: boolean = false;
    let showPlasmicOnlineVisit: boolean = false;
    try {
      const host = context.req.headers.host;
      const path = context.resolvedUrl;

      const url = `https://${host}${path}`;
      const growthbookContext = getServerSideGrowthBookContext(context.req as NextApiRequest);
      const growthbook = new GrowthBook(growthbookContext);
      growthbook.setAttributes({ url });
      await growthbook.loadFeatures({ timeout: 1000 });

      // Plasmic
      showPlasmicSuggestion = growthbook.isOn('search_plasmic_suggestion');
      showPlasmicRecentSearch = growthbook.isOn('search_plasmic_recent_search');
      showPlasmicOnlineVisit = growthbook.isOn('search_plasmic_online_visit');
    } catch (error) {
      console.error(error);
    }
    return {
      props: {
        query: context.query,
        fragmentComponents: {
          showPlasmicSuggestion,
          showPlasmicRecentSearch,
          showPlasmicOnlineVisit,
        },
      },
    };
  }),
);

export default Home;
