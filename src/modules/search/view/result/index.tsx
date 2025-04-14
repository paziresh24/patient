import Skeleton from '@/common/components/atom/skeleton';
import { useRouter } from 'next/router';
import { useSearch } from '../../hooks/useSearch';
import { useSearchRouting } from '../../hooks/useSearchRouting';
import { useSearchStore } from '../../store/search';
import { Fragment } from '@/common/fragment';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();
import SearchGlobalContextsProvider from '../../../../../.plasmic/plasmic/paziresh_24_search/PlasmicGlobalContextsProvider';

export const Result = () => {
  const {
    query: { params, ...query },
  } = useRouter();

  const { result, isLanding, isLoading, search, responseData, searchConsultResponseData } = useSearch();
  const { changeRoute } = useSearchRouting();
  const city = useSearchStore(state => state.city);
  const geoLocation = useSearchStore(state => state.geoLocation);

  const handleNextPage = () => {
    const currentPage = (query?.page as string) ? (query?.page as string) : 1;
    changeRoute({
      query: {
        page: +currentPage + 1,
      },
      scroll: false,
    });
  };

  return (
    <>
      {isLoading && result.length == 0 && (
        <div className="flex flex-col w-full space-y-3">
          <Loading line={isLanding} />
        </div>
      )}
      {(result.length === 0 ? !isLoading : true) && (
        <SearchGlobalContextsProvider>
          <Fragment
            name="SearchResults"
            props={{
              searchResultResponse: {
                ...responseData,
                search: {
                  ...search,
                  result,
                },
              },
              searchConsultResponse: {
                ...searchConsultResponseData,
              },
              nextPageTrigger: handleNextPage,
              imageSrcPrefix: publicRuntimeConfig.CDN_BASE_URL,
              location: {
                city_name: city?.en_slug,
                city_id: city?.id,
                ...city,
                ...geoLocation,
              },
              paginationLoadingStatus: isLoading,
            }}
          />
        </SearchGlobalContextsProvider>
      )}
    </>
  );
};

const Loading = ({ line = false }: { line?: boolean }) => {
  return (
    <>
      <Skeleton w="100%" h={line ? '3.6rem' : '15rem'} rounded="lg" />
      <Skeleton w="100%" h={line ? '3.6rem' : '15rem'} rounded="lg" />
      <Skeleton w="100%" h={line ? '3.6rem' : '15rem'} rounded="lg" />
      {line && (
        <>
          <Skeleton w="100%" h={line ? '3.6rem' : '15rem'} rounded="lg" />
          <Skeleton w="100%" h={line ? '3.6rem' : '15rem'} rounded="lg" />
          <Skeleton w="100%" h={line ? '3.6rem' : '15rem'} rounded="lg" />
        </>
      )}
    </>
  );
};

export default Result;
