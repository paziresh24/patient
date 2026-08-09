import Loading from '@/common/components/atom/loading';
import { LayoutWithHeaderAndFooter } from '@/common/components/layouts/layoutWithHeaderAndFooter';
import Seo from '@/common/components/layouts/seo';
import { withCSR } from '@/common/hoc/withCsr';
import { withServerUtils } from '@/common/hoc/withServerUtils';
import { useDoctorHomeRedirectLoading } from '@/common/hooks/useDoctorHomeRedirectLoading';
import { useIsomorphicLayoutEffect } from '@/common/hooks/useIsomorphicLayoutEffect';
import { getServerSideGrowthBookContext } from '@/common/helper/getServerSideGrowthBookContext';
import { getHost, HeaderBag } from '@/common/utils/getHost';
import {
  DoctorViewSwitcher,
  useDoctorViewRouteGuard,
  useDoctorViewSwapActive,
  useIsNewDoctorLauncherLoading,
} from '@/modules/doctorHome';
import { GrowthBook } from '@growthbook/growthbook-react';
import dynamic from 'next/dynamic';
import { GetServerSidePropsContext, NextApiRequest } from 'next/types';
import { ReactElement } from 'react';
import PlasmicSearch from '.plasmic/plasmic/paziresh_24_search/PlasmicSearch';
import { useSearchStore } from '@/modules/search/store/search';

const HomePageBody = dynamic(() => import('@/modules/home/views/homePageBody'), {
  loading: () => (
    <div className="flex min-h-[50vh] flex-grow items-center justify-center">
      <Loading />
    </div>
  ),
});

const Home = ({ fragmentComponents }: any) => {
  const swapActive = useDoctorViewSwapActive();
  const doctorLauncherLoading = useIsNewDoctorLauncherLoading();
  const showRedirectLoading = useDoctorHomeRedirectLoading();
  const setIsOpenSuggestion = useSearchStore(state => state.setIsOpenSuggestion);

  useDoctorViewRouteGuard();

  useIsomorphicLayoutEffect(() => {
    setIsOpenSuggestion(false);
  }, [setIsOpenSuggestion]);

  // New-design rollout doctors always get the view switcher on home.
  const showSwitcher = swapActive || doctorLauncherLoading;

  return (
    <>
      {showSwitcher && (
        <div className="bg-white">
          <DoctorViewSwitcher className="px-0 pb-1 pt-3" />
        </div>
      )}
      {showRedirectLoading ? (
        <div className="flex min-h-[50vh] flex-grow items-center justify-center">
          <Loading />
        </div>
      ) : (
        <HomePageBody fragmentComponents={fragmentComponents} plasmicSearchComponent={PlasmicSearch} />
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
            url: 'https://www.paziresh24.com/',
            potentialAction: {
              '@type': 'SearchAction',
              target: 'https://www.paziresh24.com/s/?text={search_term_string}',
              'query-input': 'required name=search_term_string',
            },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'Corporation',
            name: 'paziresh24',
            alternateName: 'پذیرش24',
            url: 'https://www.paziresh24.com/',
            logo: 'https://www.paziresh24.com/img/logo.png',
            description:
              'پذیرش24 پلتفرم سلامت الکترونیک با هدف بهبود ارتباط بین پزشک و بیمار در سال 94 توسط ابوالفضل ساجدی ، ابراهیم قانع ، محمد رضا طباطبایی ، حامد صادقی نژاد و یک تیم یزدی طراحی شد . امکان ثبت نوبت بدون محدودیت و با هر روشی که شما راحت ترید ( وبسایت ، اپلیکیشن ، تلفن ، تلگرام و… ) از وجه تمایزهای پذیرش24 با سایر سامانه‌های نوبت دهی می باشد . از طرف دیگر پذیرش24 با امکان مدیریت یکپارچه نوبت ها ، تحلیل داده ها و امکانات بسیار دیگر ، به راهکاری برای افزایش بهره وری و کاهش هزینه های پزشکان ، بیمارستان ها و کلینیک ها تبدیل شد که این دو بعدی بودن کاربری برای پزشکان و بیماران را تایید می کند .',
            foundingDate: '2016',
            founders: [
              { '@type': 'Person', name: 'ابوالفضل ساجدی' },
              { '@type': 'Person', name: 'محمد ابراهیم قانع' },
              { '@type': 'Person', name: 'محمد رضا طباطبایی' },
              { '@type': 'Person', name: 'حامد صادقی نژاد' },
            ],
            sameAs: [
              'https://www.facebook.com/paziresh24com/',
              'https://twitter.com/paziresh24/',
              'https://www.instagram.com/paziresh24/',
              'https://www.linkedin.com/company/paziresh24/',
              'https://www.paziresh24.com/home/about/',
            ],
            contactPoint: [{ '@type': 'ContactPoint', telephone: '+98-21-25015015', contactType: 'customer service' }],
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
    let showPlasmicSuggestion: boolean = true;
    let showPlasmicRecentSearch: boolean = true;
    let showPlasmicOnlineVisit: boolean = false;
    try {
      const host = getHost(context.req.headers as unknown as HeaderBag);
      const path = context.resolvedUrl;
      const url = `https://${host}${path}`;
      const growthbookContext = getServerSideGrowthBookContext(context.req as NextApiRequest);
      const growthbook = new GrowthBook(growthbookContext);
      growthbook.setAttributes({ url });
      await growthbook.loadFeatures({ timeout: 200 });

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
