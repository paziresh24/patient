import Autocomplete from '@/common/components/atom/autocomplete/autocomplete';
import Button from '@/common/components/atom/button/button';
import Skeleton from '@/common/components/atom/skeleton/skeleton';
import Text from '@/common/components/atom/text/text';
import TextField from '@/common/components/atom/textField/textField';
import { Fragment } from '@/common/fragment';
import { splunkInstance } from '@/common/services/splunk';
import SearchCard from '@/modules/search/components/card/card';
import { useFeatureValue } from '@growthbook/growthbook-react';
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
    </div>
  );
};

export default ListOfDoctors;
