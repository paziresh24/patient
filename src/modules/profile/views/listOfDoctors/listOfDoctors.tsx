import Autocomplete from '@/common/components/atom/autocomplete/autocomplete';
import Button from '@/common/components/atom/button/button';
import Skeleton from '@/common/components/atom/skeleton/skeleton';
import Text from '@/common/components/atom/text/text';
import TextField from '@/common/components/atom/textField/textField';
import { Fragment } from '@/common/fragment';
import { splunkInstance } from '@/common/services/splunk';
import SearchCard from '@/modules/search/components/card/card';
import { useFeatureIsOn, useFeatureValue } from '@growthbook/growthbook-react';
import { getCookie } from 'cookies-next';
import { useRouter } from 'next/router';
import { useRef } from 'react';
import SearchGlobalContextsProvider from '../../../../../.plasmic/plasmic/paziresh_24_search/PlasmicGlobalContextsProvider';
import config from 'next/config';
import { flatten } from 'lodash';
import { InfiniteData } from '@tanstack/react-query';

const { publicRuntimeConfig } = config();

type ExpertiseType = {
  lable: string;
  value: string;
};
interface ListOfDoctorsProps {
  doctors: InfiniteData<any> | undefined;
  expertises: ExpertiseType[];
  onSearch: (query: string) => void;
  searchQuery: string;
  onSelectExpertise: (expertise: string) => void;
  loading?: boolean;
  showRateAndReviews?: boolean;
  defaultValue?: ExpertiseType;
  expertiseListLoading?: boolean;
  onChangePage: (page: number) => void;
  hasNextPage: boolean;
  isFetchingNextPage?: boolean;
}

export const ListOfDoctors = (props: ListOfDoctorsProps) => {
  const {
    doctors,
    expertises,
    onSearch,
    searchQuery,
    onSelectExpertise,
    defaultValue,
    loading = false,
    expertiseListLoading = false,
    showRateAndReviews = true,
    onChangePage,
    hasNextPage,
    isFetchingNextPage,
  } = props;
  const page = useRef<number>(1);
  const router = useRouter();
  const customTheme = useFeatureValue('them-config', {
    'search_result:show_first_free_time': true,
    'search_result:show_available_time': true,
  });
  const usePlasmicSearchResult = useFeatureIsOn('center-profile::use-plasmic-search-result');

  const handleClickEelmentEvent = (item: any, elementName: string, elementContent?: string) => {
    splunkInstance('center-profile').sendEvent({
      group: 'center_profile',
      type: 'doctor_card_click',
      event: {
        element_name: elementName,
        element_content: elementContent,
        title: item?.title,
        terminal_id: getCookie('terminal_id'),
      },
    });
  };
  const result = flatten(doctors?.pages?.map((page: any) => page?.search?.result as any[]) ?? []) ?? [];

  return (
    <div className="flex flex-col space-y-3">
      {expertiseListLoading && (
        <div className="flex flex-col gap-3 md:flex-row">
          <Skeleton h="3rem" className="!w-full md:!w-[68%]" rounded="lg" />
          <Skeleton h="3rem" className="!w-full md:!w-[32%]" rounded="lg" />
        </div>
      )}
      {!expertiseListLoading && (
        <div className="flex flex-col items-center space-y-2 md:space-y-0 md:flex-row md:space-s-2">
          <TextField
            placeholder="جستجوی نام پزشک ..."
            value={searchQuery}
            onChange={e => {
              onSearch(e.target.value);
            }}
          />
          <Autocomplete
            options={[{ label: 'همه تخصص ها', value: '' }, ...expertises]}
            onChange={e => {
              onSelectExpertise(e.target.value.value);
            }}
            classNameWrapper="w-full md:max-w-[15rem] font-medium !text-sm"
            defaultValue={defaultValue}
            searchable
            placeholder="همه تخصص ها"
          />
        </div>
      )}
      {!usePlasmicSearchResult && (
        <div className="flex flex-col space-y-2">
          {loading && (
            <>
              <Skeleton h="13rem" w="100%" rounded="lg" />
              <Skeleton h="13rem" w="100%" rounded="lg" />
              <Skeleton h="13rem" w="100%" rounded="lg" />
            </>
          )}
          {!loading && !result.length && (
            <div className="p-4 text-center rounded-lg bg-slate-200">
              <Text fontSize="sm" fontWeight="medium">
                پزشکی یافت نشد.
              </Text>
            </div>
          )}
          {!loading &&
            result.map(doctor => (
              <SearchCard
                key={doctor.id}
                type="doctor"
                baseInfo={{
                  displayName: doctor.title,
                  avatar: doctor.image,
                  url: doctor.url,
                  expertise: doctor.display_expertise,
                  isVerify: !doctor.is_bulk,
                  ...(showRateAndReviews && {
                    rate: {
                      count: doctor.rates_count,
                      satisfaction: doctor.satisfaction,
                    },
                  }),
                  viewCount: doctor.view,
                }}
                details={{
                  badges: doctor.badges.filter((item: any) =>
                    !customTheme['search_result:show_first_free_time'] ? !(item.title as string)?.includes('فعال شدن نوبت‌دهی') : true,
                  ),
                }}
                actions={doctor.actions
                  .filter((action: any) => action.title !== 'ویزیت آنلاین')
                  ?.map((action: any) => ({
                    text: action.title,
                    description: customTheme['search_result:show_available_time'] ? action.top_title : '',
                    outline: action.outline,
                    action: () => {
                      router.push(action.url);
                    },
                  }))}
                sendEventWhenClick={({ element, content }) => handleClickEelmentEvent(doctor, element, content)}
              />
            ))}
          {hasNextPage && !loading && (
            <Button
              variant="secondary"
              onClick={() => {
                page.current += 1;
                return onChangePage(page.current);
              }}
              loading={isFetchingNextPage}
            >
              مشاهده بیشتر
            </Button>
          )}
        </div>
      )}
      {usePlasmicSearchResult && (
        <div className="flex flex-col space-y-2">
          {loading && (
            <>
              <Skeleton h="13rem" w="100%" rounded="lg" />
              <Skeleton h="13rem" w="100%" rounded="lg" />
              <Skeleton h="13rem" w="100%" rounded="lg" />
            </>
          )}
          {(result.length === 0 ? !loading : true) && (
            <SearchGlobalContextsProvider>
              <Fragment
                name="SearchResults"
                props={{
                  searchResultResponse: {
                    ...doctors?.pages?.[0],
                    search: {
                      ...doctors?.pages?.[0]?.search,
                      result,
                    },
                  },
                  nextPageTrigger: () => {
                    page.current += 1;
                    return onChangePage(page.current);
                  },
                  imageSrcPrefix: publicRuntimeConfig.CDN_BASE_URL,
                  location: {},
                  paginationLoadingStatus: isFetchingNextPage,
                }}
              />
            </SearchGlobalContextsProvider>
          )}
        </div>
      )}
    </div>
  );
};

export default ListOfDoctors;
