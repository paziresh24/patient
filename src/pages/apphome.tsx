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
import classNames from '@/common/utils/classNames';
import useResponsive from '@/common/hooks/useResponsive';
import Button from '@/common/components/atom/button';
import SparkleIcon from '@/common/components/icons/sparkle';

const Home = ({ fragmentComponents }: any) => {
  const isApplication = useApplication();
  const { query, isReady, ...router } = useRouter();
  const { recent } = useRecentSearch();
  const [defaultInputValue, setDefaultInputValue] = useState('');
  const { setIsOpenSuggestion } = useSearchStore();
  const showPlasmicSuggestion = useFeatureIsOn('search_plasmic_suggestion');
  const showPlasmicRecentSearch = useFeatureIsOn('search_plasmic_recent_search');
  const showPlasmicOnlineVisit = useFeatureIsOn('search_plasmic_online_visit');
  const showChatBotButton = useFeatureIsOn('home-page::roshan-ai-chat-bot-button');
  const { isMobile } = useResponsive();

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
      <main className="flex flex-col items-center justify-center flex-grow w-full p-4 mx-auto space-y-6 bg-white md:w-96">
        <Logo as="h1" className="text-2xl md:text-3xl" height={120} home />

        <div className="flex flex-col items-center w-full gap-3">
          <Suggestion
            showPlasmicSuggestion={fragmentComponents?.showPlasmicSuggestion || showPlasmicSuggestion}
            defaultInputValue={defaultInputValue}
            setDefaultInputValue={setDefaultInputValue}
            className={classNames('!p-0', {
              '[&>div]:border-2 [&>div]:rounded-lg [&>div>div>div]:rounded-lg  [&>div>div>div>div>div>div]:rounded-none [&>div>div>div]:border-0  [&>div]:border-primary':
                isMobile,
            })}
          />
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
          {showChatBotButton && (
            <div className="flex flex-col gap-3 w-full md:hidden">
              <div className="flex items-center gap-5 w-full">
                <div className="h-px bg-[#386BFC]/15 w-full" />
                <span className="font-semibold text-sm text-primary">یا</span>
                <div className="h-px bg-[#386BFC]/15 w-full" />
              </div>
              <Button
                variant="secondary"
                icon={<SparkleIcon className="w-5 h-5 ml-1" />}
                className="border-[#BECEFD] bg-[#F1F4FF] shadow-sm font-semibold shadow-[#3262EB]/10"
                onClick={() => router.push('/_/roshan/salamat/?origin=home')}
              >
                دنبال پزشک نگرد از من بپرس!
              </Button>
            </div>
          )}
        </div>

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
