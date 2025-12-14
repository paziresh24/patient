import { useGetBaseInfo } from '@/common/apis/services/config/baseInfo';
import { useConsultSearch } from '@/common/apis/services/search/search';
import { Center } from '@/common/types/doctorParams';
import { useRouter } from 'next/router';
import { useMemo, useState, useEffect } from 'react';
import { useSearchStore } from '../store/search';
import { useFeatureValue } from '@growthbook/growthbook-react';
import { useUnifiedSearch } from './useUnifiedSearch';

type Filter = {
  items: {
    count: number;
    title: string;
    value: string;
  }[];
  name: string;
  title: string;
  type: 'radio' | 'switch' | 'slider_with_count';
};

export type Category = {
  title: string;
  sub_categories?: Category[];
  value: string;
  url: string;
  count?: number;
};

type Search = {
  pagination: {
    limit: number;
    page: number;
  };
  result: Result[];
  total: number;
  is_landing: boolean;
  query_id: string;
  semantic_search?: any;
};

export type Result = {
  _id: string;
  id: string;
  position: number;
  count: string;
  badges: Badge[];
  display_address: string;
  display_expertise: string;
  experience: number;
  image: string;
  prefix: string;
  is_bulk: boolean;
  rates_count: number;
  satisfaction: number;
  title: string;
  type: 'doctor' | 'center';
  url: string;
  view: string;
  price: string;
  server_id: number;
  centers: Center[];
  actions: {
    title: string;
    top_title: string;
    outline: boolean;
    url: string;
  }[];
};

export type Badge = {
  icon: `${'star' | 'smile' | 'clock'}-icon`;
  title: string;
  type: 'info' | 'success';
  description?: string;
};

type SeoInfo = {
  title: string;
  heading: string;
  description: string;
  seo_box: string;
  canonical_link: string;
  jsonld: {}[];
  breadcrumbs: {
    text: string;
    href: string;
  }[];
};

type Footers = {
  title: string;
  items: {
    name: string;
    url: string;
  }[];
}[];

export const useSearch = () => {
  const {
    query: { params, ...query },
    asPath,
  } = useRouter();
  const geoLocation = useSearchStore(state => state.geoLocation);
  const showSuggestedDoctor = useFeatureValue('fragment::top-suggested-card-feature', { enable: true });

  const baseInfo = useGetBaseInfo({ table: ['city', 'province'] });

  const {
    results: result,
    responseData: searchData,
    isLoading: isSearchLoading,
    isError,
    isSuccess,
    refetch,
    total,
    pagination,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useUnifiedSearch({
    route: (params as string[])?.join('/') ?? '',
    query: {
      ...query,
      ...(geoLocation && {
        ...geoLocation,
      }),
    },
  });

  const searchConsultEnabled =
    !!searchData?.search &&
    !searchData?.search?.result?.[0]?.actions?.find((action: any) => action.top_title.includes('آنلاین و آماده مشاوره')) === true &&
    (!searchData?.selected_filters?.turn_type || searchData?.selected_filters?.turn_type !== 'consult') &&
    !searchData?.selected_filters?.result_type &&
    (!searchData?.search?.pagination?.page || searchData?.search?.pagination?.page === 1) &&
    !searchData?.search?.is_landing &&
    (params?.length !== 1 || Object.keys(query).length > 0) &&
    showSuggestedDoctor?.enable;

  const searchConsultRequest = useConsultSearch(
    {
      route: ['ir', (params as string[])?.[1] ?? '']?.join('/') ?? '',
      query: {
        ...query,
        turn_type: 'consult',
        limit: 2,
      },
      timeout: 700,
    },
    {
      enabled: searchConsultEnabled,
    },
  );

  const {
    search = { result: [], is_landing: false, pagination: { limit: 20, page: 1 }, total: 0, query_id: '' },
    filters = [],
    categories = [],
    order_items: orderItems = {},
    selected_filters: selectedFilters = {},
    seo_info: seoInfo = undefined,
    footers = undefined,
  }: {
    search: Search | undefined;
    filters: Filter[];
    categories: Category[];
    order_items: Record<string, string | string[]>;
    selected_filters: Record<string, string | string[]>;
    seo_info: SeoInfo | undefined;
    footers: Footers | undefined;
  } = useMemo(() => {
    return searchData ?? {};
  }, [searchData]);

  const [isLoading, setIsLoading] = useState(isSearchLoading || searchConsultRequest.isLoading);

  useEffect(() => {
    setIsLoading(isSearchLoading || searchConsultRequest.isLoading);
  }, [isSearchLoading, searchConsultRequest.isLoading]);

  const isLanding = useMemo(
    () => (!isLoading ? search.is_landing : params?.length === 1 && query.text === undefined),
    [params, query, search.is_landing, isLoading],
  );

  const selectedCategory = useMemo(() => categories?.find(item => item.value === selectedFilters?.category), [selectedFilters]);

  const selectedSubCategory = useMemo(
    () =>
      selectedCategory?.sub_categories?.find(
        item => item.value === `exp-${(selectedFilters?.sub_category as string)?.replace('exp-', '')}`,
      ) ?? undefined,
    [selectedFilters],
  );

  const searchCity = useMemo(
    () => baseInfo.data?.data?.result?.city?.find((item: any) => item.en_slug === selectedFilters.city),
    [baseInfo.data, selectedFilters.city],
  );

  const isConsult = useMemo(() => query.turn_type === 'consult', [query.turn_type]);

  return {
    isLanding,
    isLoading,
    result,
    isSuccess,
    isError,
    refetch,
    total,
    pagination,
    filters,
    categories,
    selectedFilters,
    orderItems,
    footers,
    seoInfo,
    selectedCategory,
    selectedSubCategory,
    searchCity,
    isConsult,
    search,
    responseData: searchData ?? {},
    searchConsultResponseData:
      searchConsultEnabled && !searchConsultRequest?.data?.search?.is_landing ? searchConsultRequest?.data ?? {} : {},
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
};
