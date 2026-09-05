import Button from '@/common/components/atom/button';
import ChevronIcon from '@/common/components/icons/chevron';
import { Fragment } from '@/common/fragment';
import { Fragment2 } from '@/common/fragment/fragment2';
import useCustomize from '@/common/hooks/useCustomize';
import useResponsive from '@/common/hooks/useResponsive';
import classNames from '@/common/utils/classNames';
import OnlineVisitPromote from '@/modules/home/components/onlineVisitPromote';
import { useRecentSearch } from '@/modules/search/hooks/useRecentSearch';
import { useSearchStore } from '@/modules/search/store/search';
import RecentSearch from '@/modules/search/view/recentSearch';
import Suggestion from '@/modules/search/view/suggestion';
import { useFeatureIsOn } from '@growthbook/growthbook-react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import SearchGlobalContextsProvider from '../../../../.plasmic/plasmic/paziresh_24_search/PlasmicGlobalContextsProvider';
import PlasmicOnlineVisit from '../../../../.plasmic/plasmic/paziresh_24_search/PlasmicOnlineVisit';
import Logo from '@/common/components/atom/logo';

const ApphomePatientContent = () => {
  const router = useRouter();
  const { recent } = useRecentSearch();
  const [defaultInputValue, setDefaultInputValue] = useState('');
  const { setIsOpenSuggestion } = useSearchStore();
  const customize = useCustomize(state => state.customize);
  const showPlasmicSuggestion = useFeatureIsOn('search_plasmic_suggestion');
  const showPlasmicRecentSearch = useFeatureIsOn('search_plasmic_recent_search');
  const showPlasmicOnlineVisit = useFeatureIsOn('search_plasmic_online_visit');
  const showHealthAssistantsButton = useFeatureIsOn('home-page::health-assistants-button');
  const { isMobile } = useResponsive();

  return (
    <>
      <Fragment name="LocationSelectionScript" />
      <main className="mx-auto flex w-full flex-grow flex-col items-center justify-center space-y-6 bg-white p-4 md:w-96">
        <Logo as="h1" className="text-2xl md:text-3xl" width={55} home />

        <div className="flex w-full flex-col items-center gap-3">
          <Suggestion
            showPlasmicSuggestion={showPlasmicSuggestion}
            defaultInputValue={defaultInputValue}
            setDefaultInputValue={setDefaultInputValue}
            className={classNames('!p-0', {
              '[&>div]:border-2 [&>div]:rounded-lg [&>div>div>div]:rounded-lg  [&>div>div>div>div>div>div]:rounded-none [&>div>div>div]:border-0  [&>div]:border-primary':
                isMobile,
            })}
          />
          {showPlasmicRecentSearch && (
            <div className="w-full lg:w-[50rem]">
              <Fragment
                name="RecentSearch"
                props={{
                  onClick: (value: { name?: string } | string) => {
                    setDefaultInputValue(
                      typeof value === 'object' && value?.name ? value.name : String(value ?? ''),
                    );
                    setIsOpenSuggestion(true);
                  },
                }}
              />
            </div>
          )}

          {recent.length > 0 && !showPlasmicRecentSearch && (
            <div className="w-full lg:w-[50rem]">
              <RecentSearch />
            </div>
          )}
          {showHealthAssistantsButton && (
            <div className="flex w-full flex-col gap-3 lg:w-[50rem]">
              <div className="flex w-full items-center gap-5">
                <div className="h-px w-full bg-[#386BFC]/15" />
              </div>
              <Button
                variant="secondary"
                className="h-16 justify-between border-[#BECEFD] bg-[#F1F4FF] font-semibold shadow-sm shadow-[#3262EB]/10"
                onClick={() => router.push('/s/?result_type=ابزارک%E2%80%8Cهای+سلامتی&text=ابزارک&ref=HomePageIcon')}
              >
                <div className="flex items-center gap-1">
                  <div className="flex flex-col items-start">
                    <span>دستیارهای سلامتی</span>
                    <span className="text-xs font-normal">تشخیص کمبود آهن، تفسیر آزمایش و ...</span>
                  </div>
                </div>
                <ChevronIcon dir="left" />
              </Button>
            </div>
          )}
        </div>

        {customize.showConsultServices &&
          (showPlasmicOnlineVisit ? (
            <div>
              <Fragment2 Component={PlasmicOnlineVisit} name="OnlineVisit" />
            </div>
          ) : (
            <OnlineVisitPromote />
          ))}
        <SearchGlobalContextsProvider>
          <Fragment name="HomePageShortcuts" />
        </SearchGlobalContextsProvider>
      </main>
    </>
  );
};

export default ApphomePatientContent;
