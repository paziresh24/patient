import { useGetBaseInfo } from '@/common/apis/services/config/baseInfo';
import { useConsultSearch, useSearch as useSearchRequest } from '@/common/apis/services/search/search';
import { Center } from '@/common/types/doctorParams';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { useSearchStore } from '../store/search';
import { useFeatureValue } from '@growthbook/growthbook-react';

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
  const searchRequest = useSearchRequest({
    route: (params as string[])?.join('/') ?? '',
    query: {
      ...query,
      ...(geoLocation && {
        ...geoLocation,
      }),
    },
  });

  const searchConsultEnabled =
    !!searchRequest?.data &&
    !searchRequest?.data?.search.result[0]?.actions?.find((action: any) => action.top_title.includes('آنلاین و آماده مشاوره')) === true &&
    (!searchRequest?.data?.selected_filters?.turn_type || searchRequest?.data?.selected_filters?.turn_type !== 'consult') &&
    !searchRequest?.data?.selected_filters?.result_type &&
    (!searchRequest?.data?.search?.pagination?.page || searchRequest?.data?.search?.pagination?.page === 1) &&
    !searchRequest?.data?.search.is_landing &&
    params?.length !== 1 &&
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
    return searchRequest.data ?? {};
  }, [searchRequest.data]);

  const [result, setResult] = useState(search?.result ?? []);
  const [isLoading, setIsLoading] = useState(searchRequest.isLoading || searchConsultRequest.isLoading);

  useEffect(() => {
    setIsLoading(true);
    if (!query.page) {
      setResult([]);
    }
  }, [asPath]);

  useEffect(() => {
    if (searchRequest.isSuccess) {
      setIsLoading(false);
      if (search?.result.length === 0) {
        return setResult([]);
      }
      if (search?.pagination?.page > 1) {
        setResult(prev => [...prev, ...search.result]);
      } else {
        setResult([...search.result]);
      }
    }
  }, [search]);

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
    isSuccess: searchRequest.isSuccess,
    total: search?.total,
    pagination: search?.pagination,
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
    responseData: searchRequest?.data ?? {},
    searchConsultResponseData:
      searchConsultEnabled && !searchConsultRequest?.data?.search?.is_landing ? searchConsultRequest?.data ?? {} : {},
  };
};
