import Logo from '@/common/components/atom/logo';
import Text from '@/common/components/atom/text';
import Button from '@/common/components/atom/button';
import ChevronIcon from '@/common/components/icons/chevron';
import useCustomize from '@/common/hooks/useCustomize';
import useResponsive from '@/common/hooks/useResponsive';
import classNames from '@/common/utils/classNames';
import { Fragment2 } from '@/common/fragment/fragment2';
import OnlineVisitPromote from '@/modules/home/components/onlineVisitPromote/onlineVisitPromote';
import { useRecentSearch } from '@/modules/search/hooks/useRecentSearch';
import Suggestion from '@/modules/search/view/suggestion';
import RecentSearch from '@/modules/search/view/recentSearch';
import { useSearchStore } from '@/modules/search/store/search';
import { useFeatureIsOn } from '@growthbook/growthbook-react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { ComponentType, useEffect, useState } from 'react';
import getConfig from 'next/config';
import { splunkInstance } from '@/common/services/splunk';
import SearchGlobalContextsProvider from '../../../../.plasmic/plasmic/paziresh_24_search/PlasmicGlobalContextsProvider';
import PlasmicLocationSelectionScript from '../../../../.plasmic/plasmic/paziresh_24_search/PlasmicLocationSelectionScript';
import PlasmicRecentSearch from '../../../../.plasmic/plasmic/paziresh_24_search/PlasmicRecentSearch';
import PlasmicOnlineVisit from '../../../../.plasmic/plasmic/paziresh_24_search/PlasmicOnlineVisit';
import PlasmicHomePageShortcuts from '../../../../.plasmic/plasmic/paziresh_24_search/PlasmicHomePageShortcuts';

const { publicRuntimeConfig } = getConfig();
const CentersList = dynamic(() => import('@/modules/home/components/centersList/centersList'));
const Promote = dynamic(() => import('@/modules/home/components/promote'));

const HomePageBody = ({
  fragmentComponents,
  plasmicSearchComponent,
}: {
  fragmentComponents?: any;
  plasmicSearchComponent: ComponentType<any>;
}) => {
  const { isMobile } = useResponsive();
  const router = useRouter();
  const { recent } = useRecentSearch();
  const [defaultInputValue, setDefaultInputValue] = useState('');
  const { setIsOpenSuggestion } = useSearchStore();
  const customize = useCustomize(state => state.customize);
  const showPlasmicOnlineVisit = useFeatureIsOn('search_plasmic_online_visit');
  const showHealthAssistantsButton = useFeatureIsOn('home-page::health-assistants-button');

  useEffect(() => {
    splunkInstance('homepage').sendEvent({
      group: 'home-page-load',
      type: 'home-page-load',
      event: {
        features: {
          'health-assistants-button': showHealthAssistantsButton,
        },
      },
    });
    router.prefetch('/s/[[...params]]');
  }, []);

  return (
    <>
      <Fragment2 Component={PlasmicLocationSelectionScript} name="LocationSelectionScript" />
      {customize.backgroundImage && (
        <div
          className="h-screen fixed top-0 w-full -z-10"
          style={
            customize.backgroundImage
              ? {
                  backgroundImage: `linear-gradient(#05242dbf, #ffffff 90%), url(${publicRuntimeConfig.PARTNER_LOGO_BASE_URL + '/' + customize.backgroundImage})`,
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }
              : undefined
          }
        />
      )}
      <main
        className={classNames('h-[92.3vh] md:mb-0 md:h-[92vh] flex flex-col !pb-44 justify-center items-center p-4 space-y-6', {
          'pt-20 !pb-0 md:!pb-48 !h-full md:!min-h-screen': customize?.partnerKey,
          'bg-white': !customize.backgroundImage,
        })}
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
        <div className="flex flex-col items-center w-full gap-3">
          <Suggestion
            showPlasmicSuggestion={!customize.partnerKey}
            plasmicSearchComponent={plasmicSearchComponent}
            defaultInputValue={defaultInputValue}
            setDefaultInputValue={setDefaultInputValue}
            className={classNames('!p-0', {
              '[&>div]:border-2 [&>div]:rounded-lg [&>div>div>div]:rounded-lg  [&>div>div>div>div>div>div]:rounded-none [&>div>div>div]:border-0  [&>div]:border-primary':
                isMobile,
            })}
          />
          {!customize.partnerKey && (
            <div className="lg:w-[50rem] w-full">
              <Fragment2
                Component={PlasmicRecentSearch}
                name="RecentSearch"
                args={{
                  onClick: (value: any) => {
                    setDefaultInputValue(value?.name || value || '');
                    setIsOpenSuggestion(true);
                  },
                }}
              />
            </div>
          )}

          {recent.length > 0 && customize.partnerKey && (
            <div className="lg:w-[50rem] w-full">
              <RecentSearch />
            </div>
          )}
          {showHealthAssistantsButton && (
            <div className="flex flex-col gap-3 w-full lg:w-[50rem]">
              <div className="flex items-center gap-5 w-full">
                <div className="h-px bg-[#386BFC]/15 w-full" />
              </div>
              <Button
                variant="secondary"
                className="border-[#BECEFD] h-16 bg-[#F1F4FF] shadow-sm justify-between font-semibold shadow-[#3262EB]/10"
                onClick={() => router.push('/s/?result_type=ابزارک%E2%80%8Cهای+سلامتی&text=ابزارک&ref=HomePageIcon')}
              >
                <div className="flex gap-1 items-center">
                  <div className="flex flex-col items-start">
                    <span>دستیارهای سلامتی</span>
                    <span className="font-normal text-xs">تشخیص کمبود آهن، تفسیر آزمایش و ...</span>
                  </div>
                </div>
                <ChevronIcon dir="left" />
              </Button>
            </div>
          )}
        </div>

        {customize.showConsultServices &&
          (fragmentComponents?.showPlasmicOnlineVisit || showPlasmicOnlineVisit ? (
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
        <div className="w-full max-w-screen-lg py-4 mx-auto text-center ">
          <Text fontWeight="semiBold" fontSize="sm" as="h2" className="text-slate-400">
            نوبت دهی پزشکی، سامانه نوبت دهی اینترنتی بیمارستان و پزشکان
          </Text>
        </div>
      )}
    </>
  );
};

export default HomePageBody;
