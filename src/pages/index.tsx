import Logo from '@/common/components/atom/logo';
import Text from '@/common/components/atom/text';
import { LayoutWithHeaderAndFooter } from '@/common/components/layouts/layoutWithHeaderAndFooter';
import Seo from '@/common/components/layouts/seo';
import useCustomize from '@/common/hooks/useCustomize';
import useResponsive from '@/common/hooks/useResponsive';
import RecentSearch from '@/modules/search/view/recentSearch';
import Suggestion from '@/modules/search/view/suggestion';
import dynamic from 'next/dynamic';
import { ReactElement } from 'react';
import { NextPageWithLayout } from './_app';
const Promote = dynamic(() => import('@/modules/home/components/promote'));

const Home: NextPageWithLayout = () => {
  const { isMobile } = useResponsive();
  const customize = useCustomize();

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

      <main className="h-[93vh] mb-6 md:mb-0 md:h-[92vh] bg-white flex flex-col justify-center items-center p-4 pb-48 space-y-6">
        {!customize.partnerTitle && <Logo className="text-2xl md:text-3xl" width={55} />}
        {customize.partnerTitle && <Text fontWeight="bold">{customize.partnerTitle}</Text>}
        {customize.partnerSubTitle && (
          <Text fontWeight="bold" fontSize="sm" className="text-primary">
            {customize.partnerSubTitle}
          </Text>
        )}
        <Suggestion />
        <RecentSearch />
      </main>
      {isMobile && customize.showPromoteApp && <Promote />}
    </>
  );
};

Home.getLayout = function getLayout(page: ReactElement) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const cosutomize = useCustomize();
  return <LayoutWithHeaderAndFooter shouldShowBrand={cosutomize.showBrandLogoInHomePage}>{page}</LayoutWithHeaderAndFooter>;
};

export async function getServerSideProps() {
  return {
    props: {},
  };
}

export default Home;
