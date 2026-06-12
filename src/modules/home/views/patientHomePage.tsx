import Logo from '@/common/components/atom/logo';
import Text from '@/common/components/atom/text';
import Button from '@/common/components/atom/button';
import ChevronIcon from '@/common/components/icons/chevron';
import useCustomize from '@/common/hooks/useCustomize';
import useResponsive from '@/common/hooks/useResponsive';
import classNames from '@/common/utils/classNames';
import OnlineVisitPromote from '@/modules/home/components/onlineVisitPromote/onlineVisitPromote';
import { useRecentSearch } from '@/modules/search/hooks/useRecentSearch';
import Suggestion from '@/modules/search/view/suggestion';
import RecentSearch from '@/modules/search/view/recentSearch';
import { useSearchStore } from '@/modules/search/store/search';
import { useRouter } from 'next/router';
import { useState } from 'react';
import getConfig from 'next/config';
import SearchGlobalContextsProvider from '../../../../.plasmic/plasmic/paziresh_24_search/PlasmicGlobalContextsProvider';
import { useFeatureIsOn } from '@growthbook/growthbook-react';
import { Fragment2 } from '@/common/fragment/fragment2';
import PlasmicOnlineVisit from '.plasmic/plasmic/paziresh_24_search/PlasmicOnlineVisit';
import PlasmicHomePageShortcuts from '.plasmic/plasmic/paziresh_24_search/PlasmicHomePageShortcuts';
import PlasmicRecentSearch from '.plasmic/plasmic/paziresh_24_search/PlasmicRecentSearch';
import CentersList from '@/modules/home/components/centersList/centersList';
import Promote from '@/modules/home/components/promote';

const { publicRuntimeConfig } = getConfig();

export interface PatientHomePageProps {
  embedded?: boolean;
}

export const PatientHomePage = ({ embedded = false }: PatientHomePageProps) => {
  const { isMobile } = useResponsive();
  const router = useRouter();
  const { recent } = useRecentSearch();
  const [defaultInputValue, setDefaultInputValue] = useState('');
  const { setIsOpenSuggestion } = useSearchStore();
  const customize = useCustomize(state => state.customize);
  const showPlasmicOnlineVisit = useFeatureIsOn('search_plasmic_online_visit');
  const showHealthAssistantsButton = useFeatureIsOn('home-page::health-assistants-button');

  return (
    <>
      {customize.backgroundImage && (
        <div
          className="fixed top-0 -z-10 h-screen w-full"
          style={{
            backgroundImage: `linear-gradient(#05242dbf, #ffffff 90%), url(${
              publicRuntimeConfig.PARTNER_LOGO_BASE_URL + '/' + customize.backgroundImage
            })`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      )}
      <main
        className={classNames(
          'flex h-[92.3vh] flex-col items-center justify-center space-y-6 p-4 !pb-44 md:mb-0 md:h-[92vh]',
          {
            'pt-20 !h-full !pb-0 md:!min-h-screen md:!pb-48': customize?.partnerKey,
            'bg-white': !customize.backgroundImage && !embedded,
            'bg-transparent': embedded && !customize.backgroundImage,
          },
        )}
      >
        {!customize.partnerTitle && <Logo as="h1" home className="text-2xl md:text-3xl" width={55} />}
        {customize.partnerTitle && (
          <Text fontWeight="black" className={classNames('text-primary md:text-lg', { 'text-white': customize.backgroundImage })}>
            {customize.partnerTitle}
          </Text>
        )}
        {customize.partnerSubTitle && (
          <Text fontWeight="bold" fontSize="sm">
            {customize.partnerSubTitle}
          </Text>
        )}
        <div className="flex w-full flex-col items-center gap-3">
          <Suggestion
            showPlasmicSuggestion={!customize.partnerKey}
            defaultInputValue={defaultInputValue}
            setDefaultInputValue={setDefaultInputValue}
            className={classNames('!p-0', {
              '[&>div]:border-2 [&>div]:rounded-lg [&>div>div>div]:rounded-lg [&>div>div>div>div>div>div]:rounded-none [&>div>div>div]:border-0 [&>div]:border-primary':
                isMobile,
            })}
          />
          {!customize.partnerKey && (
            <div className="w-full lg:w-[50rem]">
              <Fragment2
                Component={PlasmicRecentSearch}
                name="RecentSearch"
                args={{
                  onClick: (value: { name?: string } | string) => {
                    setDefaultInputValue(typeof value === 'object' ? value?.name || '' : value || '');
                    setIsOpenSuggestion(true);
                  },
                }}
              />
            </div>
          )}
          {recent.length > 0 && customize.partnerKey && (
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
          <Fragment2 Component={PlasmicHomePageShortcuts} name="HomePageShortcuts" />
        </SearchGlobalContextsProvider>
        {customize?.partnerKey && <CentersList />}
      </main>
      {isMobile && customize.showPromoteApp && <Promote />}
      {!customize.partnerKey && (
        <div className="mx-auto w-full max-w-screen-lg py-4 text-center">
          <Text fontWeight="semiBold" fontSize="sm" as="h2" className="text-slate-400">
            نوبت دهی پزشکی، سامانه نوبت دهی اینترنتی بیمارستان و پزشکان
          </Text>
        </div>
      )}
    </>
  );
};
