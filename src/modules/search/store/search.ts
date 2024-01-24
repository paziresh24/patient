import { dayToSecond } from '@/common/utils/dayToSecond';
import { deleteCookie, setCookie } from 'cookies-next';
import { create } from 'zustand';
interface SearchStore {
  city: City;
  setCity: (city: City) => void;
  userSearchValue: string;
  setUserSearchValue: (value: string) => void;
  isOpenSuggestion: boolean;
  setIsOpenSuggestion: (status: boolean) => void;
  filters: Filter[];
  setFilters: (filters: Filter[]) => void;
  categories: Category[];
  setCategories: (categories: Category[]) => void;
  selectedCategory: Category | undefined;
  selectedSubCategory: Category | undefined;
  selectedFilters: Record<string, string | string[]>;
  setSelectedFilters: (selectedFilters: Record<string, string | string[]>) => void;
  seoInfo: SeoInfo | undefined;
  setSeoInfo: (seoInfo: SeoInfo) => void;
  setGeoLocation: (geoLocation: { lat: number; lon: number } | undefined) => void;
  geoLocation: { lat: number; lon: number } | undefined;
}

export type Category = {
  title: string;
  sub_categories?: Category[];
  value: string;
  url: string;
};

export type Filter = {
  items: {
    count: number;
    title: string;
    value: string;
  }[];
  name: string;
  title: string;
  type: 'radio' | 'switch' | 'slider_with_count';
};

type SeoInfo = {
  heading: string;
  description: string;
  seo_box: string;
  breadcrumbs: {
    text: string;
    href: string;
  }[];
  footers: {
    title: string;
    items: {
      name: string;
      url: string;
    }[];
  }[];
};

type City = {
  name: string;
  id: string;
  en_slug: string;
  province_id: string;
};

export const useSearchStore = create<SearchStore>(set => ({
  city: {
    id: '-1',
    name: 'همه شهرها',
    en_slug: 'ir',
    province_id: '-1',
  },
  isOpenSuggestion: false,
  userSearchValue: '',
  filters: [],
  categories: [],
  selectedFilters: {},
  selectedSubCategory: undefined,
  selectedCategory: undefined,
  seoInfo: undefined,
  geoLocation: undefined,
  setIsOpenSuggestion: isOpenSuggestion =>
    set(state => ({
      ...state,
      isOpenSuggestion,
    })),
  setCity: city => {
    set(state => ({
      ...state,
      city,
    }));
    if (city?.id !== '-1') {
      try {
        if (new URLSearchParams(location.search).get('isWebView') && window.Android) window.Android.updateCity(city.id, city.province_id);
      } catch (error) {
        console.error(error);
      }
      return setCookie('new-city', city, {
        maxAge: dayToSecond(730),
        path: '/',
      });
    }
    deleteCookie('new-city');
  },
  setUserSearchValue: userSearchValue =>
    set(state => ({
      ...state,
      userSearchValue,
    })),
  setFilters: filters =>
    set(state => ({
      ...state,
      filters,
    })),
  setCategories: categories =>
    set(state => ({
      ...state,
      categories: categories ?? [],
    })),
  setSelectedFilters: selectedFilters =>
    set(state => ({
      ...state,
      selectedFilters,
      selectedCategory: state.categories?.find((item: any) => item.value === selectedFilters?.category),
      selectedSubCategory: state.categories
        ?.find((item: any) => item.value === selectedFilters?.category)
        ?.sub_categories?.find((item: any) => item.value === `exp-${(selectedFilters?.sub_category as string)?.replace('exp-', '')}`),
    })),
  setSeoInfo: seoInfo => set(state => ({ ...state, seoInfo })),
  setGeoLocation: geoLocation => set(state => ({ ...state, geoLocation })),
}));
