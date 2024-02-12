import Logo from '@/common/components/atom/logo';
import Text from '@/common/components/atom/text';
import { LayoutWithHeaderAndFooter } from '@/common/components/layouts/layoutWithHeaderAndFooter';
import Seo from '@/common/components/layouts/seo';
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
import { GetServerSidePropsContext } from 'next/types';
import { ReactElement, useEffect } from 'react';
const CentersList = dynamic(() => import('@/modules/home/components/centersList/centersList'));
const Promote = dynamic(() => import('@/modules/home/components/promote'));
const RecentSearch = dynamic(() => import('@/modules/search/view/recentSearch'), {
  loading: () => <div className="h-[68px] md:h-6" />,
});

const Home = () => {
  const { isMobile } = useResponsive();
  const router = useRouter();
  const { recent } = useRecentSearch();

  const customize = useCustomize(state => state.customize);

  useEffect(() => {
    // Prefetch the search page
    router.prefetch('/s/[[...params]]');
  }, []);

  return (
    <>
      <main
        className={classNames('h-[92.3vh] md:mb-0 md:h-[92vh] bg-white flex flex-col justify-center items-center p-4 pb-48 space-y-6', {
          'pt-20 !pb-0 md:!pb-48 !h-full md:!min-h-screen': customize?.partnerKey,
        })}
      >
        {!customize.partnerTitle && <Logo as="h1" className="text-2xl md:text-3xl" width={55} />}
        {customize.partnerTitle && (
          <Text fontWeight="bold" className="text-primary md:text-lg">
            {customize.partnerTitle}
          </Text>
        )}
        {customize.partnerSubTitle && (
          <Text fontWeight="bold" fontSize="sm">
            {customize.partnerSubTitle}
          </Text>
        )}
        <Suggestion />
        {recent.length > 0 && (
          <div className="lg:w-[50rem] w-full">
            <RecentSearch />
          </div>
        )}
        {customize.showConsultServices && <OnlineVisitPromote />}
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
    return {
      props: {},
    };
  }),
);

export default Home;
