import { ServerStateKeysEnum } from '@/common/apis/serverStateKeysEnum';
import { search as searchApi } from '@/common/apis/services/search/search';
import { useStat } from '@/common/apis/services/search/stat';
import Button from '@/common/components/atom/button';
import Text from '@/common/components/atom/text';
import { LayoutWithHeaderAndFooter } from '@/common/components/layouts/layoutWithHeaderAndFooter';
import Seo from '@/common/components/layouts/seo';
import { withCSR } from '@/common/hoc/withCsr';
import useResponsive from '@/common/hooks/useResponsive';
import MobileToolbar from '@/modules/search/components/filters/mobileToolbar';
import Sort from '@/modules/search/components/filters/sort';
import UnknownCity from '@/modules/search/components/unknownCity';
import { useSearch } from '@/modules/search/hooks/useSearch';
import { useSearchRouting } from '@/modules/search/hooks/useSearchRouting';
import { useSearchStore } from '@/modules/search/store/search';
import Filter from '@/modules/search/view/filter';
import Result from '@/modules/search/view/result';
import SearchSeoBox from '@/modules/search/view/seoBox';
import Suggestion from '@/modules/search/view/suggestion';
import { addCommas } from '@persian-tools/persian-tools';
import axios from 'axios';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { ReactElement, useEffect } from 'react';
import { dehydrate, QueryClient } from 'react-query';
import { NextPageWithLayout } from '../_app';

const Search: NextPageWithLayout = () => {
  const { isMobile } = useResponsive();
  const {
    asPath,
    query: { params, ...query },
  } = useRouter();
  const { isLanding, isLoading, total, seoInfo, selectedFilters, result } = useSearch();
  const city = useSearchStore(state => state.city);
  const { changeRoute } = useSearchRouting();
  const stat = useStat();

  useEffect(() => {
    if ((params as string[])?.length === 1 && (params as string[])?.[0] === 'ir') {
      changeRoute({ params: { city: '' } });
    }

    if (!isLoading && !selectedFilters.city && city.en_slug !== 'ir') {
      changeRoute({ params: { city: city?.en_slug } });
    }
  }, [params, city, isLoading]);

  useEffect(() => {
    stat.mutate({
      route: asPath,
      filters: selectedFilters,
      result: result,
      ...(!isLanding && { centerTypeFilterPresence: 1 }),
    });
  }, [asPath]);

  return (
    <>
      <Seo {...seoInfo} jsonlds={[seoInfo?.jsonld]} />
      <div className="flex flex-col items-center justify-center px-3 py-5 space-y-3 bg-white">
        <Suggestion key={asPath.toString()} overlay />
        {!isLanding && <MobileToolbar />}
      </div>
      <div className="container flex flex-col p-3 !pt-5 mx-auto space-y-3 md:p-0">
        <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:space-s-5">
          {!isLanding && <Filter isLoading={isLoading} />}
          <div className="flex flex-col w-full space-y-3">
            {!isLanding && !isMobile && (
              <div className="hidden md:flex items-center justify-between">
                <Sort />
                <Text fontSize="sm" fontWeight="semiBold">
                  {addCommas(total)} نتیجه
                </Text>
              </div>
            )}
            <Result />
          </div>
        </div>

        {!query.isWebView && <SearchSeoBox />}
        <a href={`https://www.paziresh24.com/home/support-form-search/?p24refer=${encodeURIComponent(asPath)}`} className="block">
          <Button variant="secondary" className="!my-5" block>
            گزارش مشکل در جستجو
          </Button>
        </a>
      </div>
      <UnknownCity />
    </>
  );
};

Search.getLayout = function getLayout(page: ReactElement) {
  return <LayoutWithHeaderAndFooter>{page}</LayoutWithHeaderAndFooter>;
};

export const getServerSideProps: GetServerSideProps = withCSR(async (context: { query: { [x: string]: any; params: any }; res: any }) => {
  const { params, ...query } = context.query;

  if (params?.length === 1 && (params as string[])?.[0] === 'ir') {
    return {
      redirect: {
        destination: '/s',
        permanent: true,
      },
    };
  }

  try {
    const queryClient = new QueryClient();

    await queryClient.fetchQuery(
      [
        ServerStateKeysEnum.Search,
        {
          route: (params as string[])?.join('/') ?? '',
          query: {
            ...query,
          },
        },
      ],
      () =>
        searchApi({
          route: (params as string[])?.join('/') ?? '',
          query: {
            ...query,
          },
        }),
    );

    return {
      props: {
        dehydratedState: dehydrate(queryClient),
      },
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404)
        return {
          notFound: true,
        };
    }
    throw new TypeError(JSON.stringify(error));
  }
});

export default Search;
