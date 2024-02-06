import { ServerStateKeysEnum } from '@/common/apis/serverStateKeysEnum';
import { search as searchApi } from '@/common/apis/services/search/search';
import { useStat } from '@/common/apis/services/search/stat';
import Button from '@/common/components/atom/button';
import Skeleton from '@/common/components/atom/skeleton/skeleton';
import Text from '@/common/components/atom/text';
import ErrorIcon from '@/common/components/icons/error';
import { LayoutWithHeaderAndFooter } from '@/common/components/layouts/layoutWithHeaderAndFooter';
import Seo from '@/common/components/layouts/seo';
import { withCSR } from '@/common/hoc/withCsr';
import { withServerUtils } from '@/common/hoc/withServerUtils';
import useCustomize, { ThemeConfig } from '@/common/hooks/useCustomize';
import useResponsive from '@/common/hooks/useResponsive';
import { splunkInstance } from '@/common/services/splunk';
import { removeHtmlTagInString } from '@/common/utils/removeHtmlTagInString';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import MobileToolbar from '@/modules/search/components/filters/mobileToolbar';
import MobileRowFilter from '@/modules/search/components/filters/rowFilter';
import UnknownCity from '@/modules/search/components/unknownCity';
import { useSearch } from '@/modules/search/hooks/useSearch';
import { useSearchRouting } from '@/modules/search/hooks/useSearchRouting';
import { useSearchStore } from '@/modules/search/store/search';
import Filter from '@/modules/search/view/filter';
import { Result } from '@/modules/search/view/result';
import SearchSeoBox from '@/modules/search/view/seoBox';
import Suggestion from '@/modules/search/view/suggestion';
import { useFeatureValue, useFeatureIsOn } from '@growthbook/growthbook-react';
import { addCommas } from '@persian-tools/persian-tools';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import axios from 'axios';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { ReactElement, useEffect } from 'react';
import { growthbook } from '../_app';
const Sort = dynamic(() => import('@/modules/search/components/filters/sort'));
const ConsultBanner = dynamic(() => import('@/modules/search/components/consultBanner'));

const Search = ({ host }: any) => {
  const { isMobile } = useResponsive();
  const userInfo = useUserInfoStore(state => state.info);
  const userPending = useUserInfoStore(state => state.pending);
  const shouldUseSearchViewEventRoutesList = useFeatureValue<{ routes: Array<string | null> }>('search:use-front-end-search-view-event', {
    routes: [],
  });
  const shouldUseRowFilter = useFeatureIsOn('search:use-row-search');

  const {
    asPath,
    query: { params, ...queries },
  } = useRouter();

  const { isLanding, isLoading, total, seoInfo, selectedFilters, result, search } = useSearch();
  const city = useSearchStore(state => state.city);
  const { changeRoute } = useSearchRouting();
  const stat = useStat();
  const customize = useCustomize(state => state.customize);

  useEffect(() => {
    if ((params as string[])?.length === 1 && (params as string[])?.[0] === 'ir') {
      changeRoute({ params: { city: '' }, replace: true });
    }

    if (!isLoading && !selectedFilters.city && city.en_slug !== 'ir') {
      changeRoute({ params: { city: city?.en_slug }, query: { lat: null, lon: null }, replace: true });
    }
  }, [params, city, isLoading]);

  useEffect(() => {
    if (growthbook.ready && !userPending && !isLoading) {
      if (
        shouldUseSearchViewEventRoutesList.routes?.some(route => !!route && asPath.includes(route)) ||
        shouldUseSearchViewEventRoutesList.routes?.includes('*')
      ) {
        splunkInstance('search').sendEvent({
          group: 'search_metrics',
          type: 'search_view',
          event: {
            filters: selectedFilters,
            result_count: result.length,
            location: city.en_slug,
            city_id: city.id,
            query_id: search.query_id,
            user_id: userInfo?.id ?? null,
            user_type: userInfo.provider?.job_title ?? 'normal-user',
            url: {
              href: window.location.href,
              qurey: { ...queries },
              pathname: window.location.pathname,
              host: window.location.host,
            },
          },
        });

        splunkInstance('search').sendBatchEvent({
          group: 'search_metrics',
          type: 'search_card_view',
          events: result.map(item => ({
            card_data: {
              action: item.actions?.map?.(item =>
                JSON.stringify({ outline: item.outline, title: item.title, top_title: removeHtmlTagInString(item.top_title) }),
              ),
              _id: item._id,
              position: item.position,
              server_id: item.server_id,
              title: item.title,
              type: item.type,
              url: item.url,
              rates_count: item.rates_count,
              satisfaction: item.satisfaction,
            },
            filters: selectedFilters,
            result_count: result.length,
            location: city.en_slug,
            city_id: city.id,
            query_id: search.query_id,
            user_id: userInfo?.id ?? null,
            user_type: userInfo.provider?.job_title ?? 'normal-user',
            url: {
              href: window.location.href,
              qurey: { ...queries },
              pathname: window.location.pathname,
              host: window.location.host,
            },
          })),
        });

        return;
      }
      stat.mutate({
        route: asPath,
        filters: selectedFilters,
        result: result,
        ...(!isLanding && { centerTypeFilterPresence: 1 }),
      });
    }
  }, [result, userPending, isLoading, growthbook.ready]);

  return (
    <>
      <Seo {...seoInfo} canonicalUrl={seoInfo?.canonical_link} jsonlds={[seoInfo?.jsonld]} host={host} />
      <div className={`flex flex-col items-center justify-center bg-white ${isMobile ? 'sticky top-0 z-20' : ''}`}>
        <Suggestion key={asPath.toString()} overlay />
        {!shouldUseRowFilter ? <MobileRowFilter /> : <MobileToolbar />}
      </div>
      <div className="container flex flex-col p-3 md:!pt-5 mx-auto space-y-3 md:p-0">
        <div className="flex flex-col space-y-3 md:space-y-0 md:flex-row md:space-s-5">
          {!isLanding && <Filter isLoading={isLoading} />}
          <div className="flex flex-col w-full">
            {!isLanding && !isMobile && (
              <div className="items-center justify-between hidden mb-3 md:flex">
                <Sort />
                {isLoading ? (
                  <Skeleton w="5rem" h="1rem" rounded="full" />
                ) : (
                  <Text fontSize="sm" fontWeight="semiBold">
                    {addCommas(total)} نتیجه
                  </Text>
                )}
              </div>
            )}
            {customize.showConsultServices && <ConsultBanner />}
            <Result />
          </div>
        </div>
        <SearchSeoBox />
        <Button
          onClick={() => (window.location.href = 'https://support.paziresh24.com/ticketing/?action=new')}
          variant="text"
          className="!my-5 gap-2 self-end"
          icon={<ErrorIcon className="w-5" />}
        >
          گزارش مشکل در جستجو
        </Button>
      </div>
      <UnknownCity />
    </>
  );
};

Search.getLayout = function getLayout(page: ReactElement) {
  return <LayoutWithHeaderAndFooter {...page.props.config}>{page}</LayoutWithHeaderAndFooter>;
};

export const getServerSideProps: GetServerSideProps = withCSR(
  withServerUtils(async (context: GetServerSidePropsContext, themeConfing: ThemeConfig) => {
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

      const headers = context?.req?.headers?.cookie ? { cookie: context.req.headers.cookie } : undefined;
      const university = themeConfing?.partnerKey;

      await queryClient.fetchQuery(
        [
          ServerStateKeysEnum.Search,
          {
            route: (params as string[])?.join('/') ?? '',
            query: {
              ...query,
              ...(university && { university }),
            },
          },
        ],
        () =>
          searchApi({
            route: (params as string[])?.join('/') ?? '',
            query: {
              ...query,
              ...(university && { university }),
            },
            headers,
          }),
      );

      return {
        props: {
          dehydratedState: dehydrate(queryClient),
        },
      };
    } catch (error) {
      console.dir(error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404)
          return {
            notFound: true,
          };
      }
      throw new TypeError(JSON.stringify(error));
    }
  }),
);

export default Search;
