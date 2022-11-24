import { useGetBaseInfo } from '@/common/apis/services/config/baseInfo';
import { useSearch as useSearchRequest } from '@/common/apis/services/search/search';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';

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
  is_bulk: boolean;
  rates_count: number;
  satisfaction: number;
  title: string;
  type: 'doctor' | 'center';
  url: string;
  view: string;
  price: string;
  server_id: number;
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

  const baseInfo = useGetBaseInfo({ table: ['city', 'province'] });
  const searchRequest = useSearchRequest();

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
  const [isLoading, setIsLoading] = useState(false);

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

  const isLanding = useMemo(() => params?.length === 1 && query.text === undefined, [params, query]);

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
  };
};
