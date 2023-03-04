import Logo from '@/common/components/atom/logo';
import Text from '@/common/components/atom/text';
import { LayoutWithHeaderAndFooter } from '@/common/components/layouts/layoutWithHeaderAndFooter';
import Seo from '@/common/components/layouts/seo';
import { withCSR } from '@/common/hoc/withCsr';
import useCustomize from '@/common/hooks/useCustomize';
import useResponsive from '@/common/hooks/useResponsive';
import useServerQuery from '@/common/hooks/useServerQuery';
import classNames from '@/common/utils/classNames';
import { useRecentSearch } from '@/modules/search/hooks/useRecentSearch';
import { useRouter } from 'next/dist/client/router';
import dynamic from 'next/dynamic';
import { GetServerSidePropsContext } from 'next/types';
import { ReactElement, useEffect } from 'react';
const CentersList = dynamic(() => import('@/modules/home/components/centersList/centersList'));
const Promote = dynamic(() => import('@/modules/home/components/promote'));
const Suggestion = dynamic(() => import('@/modules/search/view/suggestion'));
const RecentSearch = dynamic(() => import('@/modules/search/view/recentSearch'), {
  loading: () => <div className="h-[68px] md:h-6" />,
});

const Home = () => {
  const { isMobile } = useResponsive();
  const router = useRouter();
  const { recent } = useRecentSearch();

  const university = useServerQuery(state => state.queries.university);
  const customize = useCustomize(state => state.customize);

  useEffect(() => {
    // Prefetch the search page
    router.prefetch('/s/[[...params]]');
  }, []);

  return (
    <>
      <Seo
        title="نوبت دهی پزشکی، سامانه نوبت دهی اینترنتی بیمارستان و پزشکان"
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
        ]}
      />

      <main
        className={classNames('h-[92.3vh] md:mb-0 md:h-[92vh] bg-white flex flex-col justify-center items-center p-4 pb-48 space-y-6', {
          'pt-20 !pb-0 md:!pb-48 !h-full md:!min-h-screen': university,
        })}
      >
        {!customize.partnerTitle && <Logo className="text-2xl md:text-3xl" width={55} />}
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
        {recent.length > 0 && <RecentSearch />}
        {!recent.length && <div className="h-[68px] md:h-6" />}
        {university && <CentersList />}
      </main>
      {isMobile && customize.showPromoteApp && <Promote />}
    </>
  );
};

Home.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutWithHeaderAndFooter shouldShowBrand={false} {...page.props.config}>
      {page}
    </LayoutWithHeaderAndFooter>
  );
};

export const getServerSideProps = withCSR(async (context: GetServerSidePropsContext) => {
  return {
    props: {
      query: context.query,
    },
  };
});

export default Home;
