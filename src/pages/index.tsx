import Logo from '@/common/components/atom/logo';
import Text from '@/common/components/atom/text';
import { LayoutWithHeaderAndFooter } from '@/common/components/layouts/layoutWithHeaderAndFooter';
import Seo from '@/common/components/layouts/seo';
import { Fragment } from '@/common/fragment';
import { withCSR } from '@/common/hoc/withCsr';
import { withServerUtils } from '@/common/hoc/withServerUtils';
import useCustomize from '@/common/hooks/useCustomize';
import useResponsive from '@/common/hooks/useResponsive';
import classNames from '@/common/utils/classNames';
import OnlineVisitPromote from '@/modules/home/components/onlineVisitPromote/onlineVisitPromote';
import { useRecentSearch } from '@/modules/search/hooks/useRecentSearch';
import Suggestion from '@/modules/search/view/suggestion';
import { useRouter } from 'next/dist/client/router';
import dynamic from 'next/dynamic';
import { GetServerSidePropsContext, NextApiRequest } from 'next/types';
import { ReactElement, useEffect, useState } from 'react';
const CentersList = dynamic(() => import('@/modules/home/components/centersList/centersList'));
const Promote = dynamic(() => import('@/modules/home/components/promote'));
import RecentSearch from '@/modules/search/view/recentSearch';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();
import SearchGlobalContextsProvider from '../../.plasmic/plasmic/paziresh_24_search/PlasmicGlobalContextsProvider';
import { useSearchStore } from '@/modules/search/store/search';
import { GrowthBook, useFeatureIsOn } from '@growthbook/growthbook-react';
import { getServerSideGrowthBookContext } from '@/common/helper/getServerSideGrowthBookContext';
import toast from 'react-hot-toast';
import { toastActionble } from '@/common/utils/toastActionble';
import Button from '@/common/components/atom/button';
import SparkleIcon from '@/common/components/icons/sparkle';

const Home = ({ fragmentComponents }: any) => {
  const { isMobile } = useResponsive();
  const router = useRouter();
  const { recent } = useRecentSearch();
  const [defaultInputValue, setDefaultInputValue] = useState('');
  const { setIsOpenSuggestion } = useSearchStore();
  const customize = useCustomize(state => state.customize);
  const showPlasmicSuggestion = useFeatureIsOn('search_plasmic_suggestion');
  const showPlasmicRecentSearch = useFeatureIsOn('search_plasmic_recent_search');
  const showPlasmicOnlineVisit = useFeatureIsOn('search_plasmic_online_visit');
  const showChatBotButton = useFeatureIsOn('home-page::roshan-ai-chat-bot-button');

  useEffect(() => {
    if (window.location.host === 'p24-patient.darkube.app') {
      window?.document
        ?.querySelector('head')
        ?.insertAdjacentHTML('beforeend', `<meta name="google-site-verification" content="RJ60Kgi1_GMYv3iQi1h04XK4pkP-0vSYcyWYQVAdxXE" />`);
    }
  }, []);

  useEffect(() => {
    // Prefetch the search page
    router.prefetch('/s/[[...params]]');
  }, []);

  return (
    <>
      <Fragment name="LocationSelectionScript" />
      {customize.backgroundImage && (
        <div
          className="h-screen fixed top-0 w-full -z-10"
          style={
            customize.backgroundImage
              ? {
                  backgroundImage: `linear-gradient(#05242dbf, #ffffff 90%), url(${
                    publicRuntimeConfig.PARTNER_LOGO_BASE_URL + '/' + customize.backgroundImage
                  })`,
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }
              : undefined
          }
        ></div>
      )}
      <main
        className={classNames('h-[92.3vh] md:mb-0 md:h-[92vh] flex flex-col !pb-44 justify-center items-center p-4 space-y-6', {
          'pt-20 !pb-0 md:!pb-48 !h-full md:!min-h-screen': customize?.partnerKey,
          'bg-white': !customize.backgroundImage,
        })}
      >
        {!customize.partnerTitle && <Logo as="h1" className="text-2xl md:text-3xl" width={55} />}
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

        {customize.showConsultServices &&
          (fragmentComponents?.showPlasmicOnlineVisit || showPlasmicOnlineVisit ? (
            <div>
              <Fragment name="OnlineVisit" />
            </div>
          ) : (
            <OnlineVisitPromote />
          ))}
        <SearchGlobalContextsProvider>
          <Fragment name="HomePageShortcuts" />
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

Home.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutWithHeaderAndFooter shouldShowBrand={false} {...page.props.config}>
      <Seo
        title={page.props?.query?.['partner:title'] ?? 'نوبت دهی پزشکی، سامانه نوبت دهی اینترنتی بیمارستان و پزشکان'}
        titleWithBrandName={!page.props?.query?.['partner:title']}
        description="پذیرش24، دکتر آنلاین و نوبت دهی سریع از بهترین پزشکان ، درمانگاه ها ، کلینیک ها و بیمارستان های کشور.از طریق این سایت و یا اپلیکیشن پذیرش24 اینترنتی با جستجوی دکتر مورد نظر ، مشاوره تلفنی و یا نوبت بگیرید."
        jsonlds={[
          {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            'url': 'https://www.paziresh24.com/',
            'potentialAction': {
              '@type': 'SearchAction',
              'target': 'https://www.paziresh24.com/s/?text={search_term_string}',
              'query-input': 'required name=search_term_string',
            },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'Corporation',
            'name': 'paziresh24',
            'alternateName': 'پذیرش24',
            'url': 'https://www.paziresh24.com/',
            'logo': 'https://www.paziresh24.com/img/logo.png',
            'description':
              'پذیرش24 پلتفرم سلامت الکترونیک با هدف بهبود ارتباط بین پزشک و بیمار در سال 94 توسط ابوالفضل ساجدی ، ابراهیم قانع ، محمد رضا طباطبایی ، حامد صادقی نژاد و یک تیم یزدی طراحی شد . امکان ثبت نوبت بدون محدودیت و با هر روشی که شما راحت ترید ( وبسایت ، اپلیکیشن ، تلفن ، تلگرام و… ) از وجه تمایزهای پذیرش24 با سایر سامانه‌های نوبت دهی می باشد . از طرف دیگر پذیرش24 با امکان مدیریت یکپارچه نوبت ها ، تحلیل داده ها و امکانات بسیار دیگر ، به راهکاری برای افزایش بهره وری و کاهش هزینه های پزشکان ، بیمارستان ها و کلینیک ها تبدیل شد که این دو بعدی بودن کاربری برای پزشکان و بیماران را تایید می کند .',
            'foundingDate': '2016',
            'founders': [
              { '@type': 'Person', 'name': 'ابوالفضل ساجدی' },
              { '@type': 'Person', 'name': 'محمد ابراهیم قانع' },
              { '@type': 'Person', 'name': 'محمد رضا طباطبایی' },
              { '@type': 'Person', 'name': 'حامد صادقی نژاد' },
            ],
            'sameAs': [
              'https://www.facebook.com/paziresh24com/',
              'https://twitter.com/paziresh24/',
              'https://www.instagram.com/paziresh24/',
              'https://www.linkedin.com/company/paziresh24/',
              'https://www.paziresh24.com/home/about/',
            ],
            'contactPoint': [{ '@type': 'ContactPoint', 'telephone': '+98-21-25015015', 'contactType': 'customer service' }],
          },
        ]}
        host={page.props?.host}
      />
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
