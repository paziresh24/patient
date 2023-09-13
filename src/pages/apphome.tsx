import { useGetAppHome } from '@/common/apis/services/apphome/apphome';
import Logo from '@/common/components/atom/logo';
import Skeleton from '@/common/components/atom/skeleton/skeleton';
import Text from '@/common/components/atom/text/text';
import Transition from '@/common/components/atom/transition/transition';
import { LayoutWithHeaderAndFooter } from '@/common/components/layouts/layoutWithHeaderAndFooter';
import Seo from '@/common/components/layouts/seo';
import { withCSR } from '@/common/hoc/withCsr';
import { useSearchStore } from '@/modules/search/store/search';
import Suggestion from '@/modules/search/view/suggestion';
import Link from 'next/link';
import { GetServerSidePropsContext } from 'next/types';
import { ReactElement } from 'react';
import ScrollContainer from 'react-indiana-drag-scroll';

const Home = () => {
  const appHome = useGetAppHome();
  const city = useSearchStore(state => state.city);

  const handlePopupRoute = (type: string) => {
    if (type === 'center') {
      return `/s/${city.en_slug}/center`;
    }
    if (type === 'doctor') {
      return `/s/${city.en_slug}/doctor`;
    }
  };

  const reformatSlids = (slids: any[]) => {
    const reversed = Array.from(slids).reverse();
    return reversed;
  };

  return (
    <>
      <Seo title="اپلیکیشن پذیرش24" noIndex />

      <main className="flex flex-col items-center space-y-3">
        <div className="flex flex-col items-center w-full py-4 space-y-3 bg-white shadow-card">
          <Logo className="!mr-1" width={30} />
          <div className="flex justify-center w-full px-4 md:w-96">
            <Suggestion />
          </div>
        </div>

        {appHome.isLoading && (
          <div className="flex flex-col w-full space-y-3 md:w-96">
            <ScrollContainer className="flex justify-start w-full px-4 space-s-2">
              <Skeleton h="10rem" w="20rem" className="min-w-[20rem]" rounded="lg" />
              <Skeleton h="10rem" w="20rem" className="min-w-[20rem]" rounded="lg" />
            </ScrollContainer>
            <div className="flex flex-col w-full px-4 space-y-4 !mt-4">
              <Skeleton w="10rem" h="1rem" rounded="full" />
              <Skeleton w="100%" h="9rem" rounded="lg" />
            </div>
            <div className="flex flex-col w-full px-4 space-y-3">
              <Skeleton w="100%" h="14rem" rounded="lg" />
            </div>
          </div>
        )}
        <Transition match={appHome.isSuccess} animation="bottom" className="flex flex-col w-full space-y-3 md:w-96">
          {appHome.data?.data?.result?.map((section: any, index: number) => (
            <div className="flex flex-col w-full space-y-3" key={index}>
              {section.title && (
                <div className="flex items-center px-4">
                  {section.icon && <img src={section.icon} className="ml-2" width={16} />}
                  <Text fontSize="sm" dangerouslySetInnerHTML={{ __html: section.title }} />
                </div>
              )}
              {section.type === 'slider' && (
                <ScrollContainer className="flex justify-start w-full px-4 mb-2 space-s-2">
                  {reformatSlids(section.body?.images).map((slide: any) => (
                    <a href={slide.activity.url} key={slide.activity.url}>
                      <div className="h-40 rounded-xl min-w-[20rem] w-80 bg-slate-100 overflow-hidden">
                        <img src={slide.image} alt="" />
                      </div>
                    </a>
                  ))}
                </ScrollContainer>
              )}
              {section.type === 'grid' && (
                <div className="grid grid-cols-3 p-3 py-4 mx-4 bg-white border shadow-sm gap-y-5 border-slate-100 rounded-xl">
                  {section.body.items.map((item: any) => (
                    <Link
                      key={item.image.title}
                      href={!item.activity.is_popup ? item.activity.url : handlePopupRoute(item.activity.popup_return_type)}
                    >
                      <div className="flex flex-col items-center space-y-2 whitespace-nowrap">
                        <img src={item.image.url} alt="" width={70} height={70} />
                        <Text fontSize="xs" fontWeight="medium">
                          {item.image.title}
                        </Text>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </Transition>
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

export const getServerSideProps = withCSR(async (context: GetServerSidePropsContext) => {
  return {
    props: {
      query: context.query,
    },
  };
});

export default Home;
