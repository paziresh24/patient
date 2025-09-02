import Skeleton from '@/common/components/atom/skeleton';
import { useRouter } from 'next/router';
import { useSearch } from '../../hooks/useSearch';
import { useSearchRouting } from '../../hooks/useSearchRouting';
import { useSearchStore } from '../../store/search';
import { Fragment } from '@/common/fragment';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();
import SearchGlobalContextsProvider from '../../../../../.plasmic/plasmic/paziresh_24_search/PlasmicGlobalContextsProvider';
import Button from '@/common/components/atom/button';
import Loading from 'src/common/components/atom/loading';
import Text from 'src/common/components/atom/text';

export const Result = () => {
  const {
    query: { params, ...query },
  } = useRouter();

  const { result, isLanding, isLoading, search, responseData, searchConsultResponseData, isError, refetch } = useSearch();
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
      {isError && (
        <div className="flex flex-col justify-center items-center w-full space-y-3">
          <span className="font-semibold">خطا در دریافت نتایج جستجو</span>
          <Button onClick={() => refetch()}>تلاش مجدد</Button>
        </div>
      )}
     {isLoading && !isError && result.length == 0 && (
  <div className="flex flex-col w-full space-y-3">
    <div className="flex flex-col p-5 space-y-4 rounded-lg bg-white">
      <div className="flex items-center space-s-2">
        <Loading />
        <Text>در حال آماده سازی نتایج جستجو ...</Text>
      </div>
    </div>
    <Loading line={isLanding} />
  </div>
)}
      {(result.length === 0 ? !isLoading : !isError) && (
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

const CardSkleton = () => (
  <Skeleton w="100%" h={'15rem'} rounded="lg" className="bg-white p-4 gap-3 justify-between flex flex-col">
    <div className="flex items-center gap-3">
      <Skeleton w="5rem" h="5rem" rounded="full" />
      <div className="flex flex-col gap-2">
        <Skeleton w="10rem" h="1rem" rounded="full" />
        <Skeleton w="15rem" h="1rem" rounded="full" />
        <Skeleton w="2rem" h="0.8rem" rounded="full" />
      </div>
    </div>
    <div className="flex flex-col gap-3">
      <Skeleton w="10rem" h="1rem" rounded="full" />
      <Skeleton w="5rem" h="1rem" rounded="full" />
    </div>
    <div className="flex gap-3">
      <Skeleton w="100%" h="3rem" rounded="lg" />
      <Skeleton w="100%" h="3rem" rounded="lg" />
    </div>
  </Skeleton>
);

const Loading = ({ line = false }: { line?: boolean }) => {
  if (!line)
    return (
      <>
        <CardSkleton />
        <CardSkleton />
        <CardSkleton />
      </>
    );

  return (
    <>
      <Skeleton w="100%" h={'3.6rem'} rounded="lg" />
      <Skeleton w="100%" h={'3.6rem'} rounded="lg" />
      <Skeleton w="100%" h={'3.6rem'} rounded="lg" />
      <Skeleton w="100%" h={'3.6rem'} rounded="lg" />
      <Skeleton w="100%" h={'3.6rem'} rounded="lg" />
      <Skeleton w="100%" h={'3.6rem'} rounded="lg" />
    </>
  );
};

export default Result;
