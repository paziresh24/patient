import { create } from 'zustand';

export interface ThemeConfig {
  partnerKey: string;
  showHeader: boolean;
  showFooter: boolean;
  showSideBar: boolean;
  headerBrandLogoType: HeaderBrandLogoType;
  backgroundImage?: string;
  showUserProfile: boolean;
  showBrandLogoInHomePage: boolean;
  showPromoteApp: boolean;
  partnerLogo: string;
  showPartnerLogoInPrimaryPlace: boolean;
  partnerTitle: string;
  partnerSubTitle: string;
  provinceId?: string;
  showSelectCityInSuggestion: boolean;
  showSeoBoxs: boolean;
  footerType: FooterType;
  showConsultServices: boolean;
  showActivityProfile: boolean;
  showWaitingTimeStatistics: boolean;
  showGalleryProfile: boolean;
  showTermsAndConditions: boolean;
  bookMark: boolean;
  showShareApp: boolean;
  showSupplierRegister: boolean;
  showRateAndReviews: boolean;
  showSupport: boolean;
  showContribute: boolean;
  oauth: boolean;
  showFirstFreeTimeSearchResult?: boolean;
  showAvailableTimeSearchResult?: boolean;
  certificates?: {
    provider: 'enamad';
    id: string;
    code: string;
  }[];
  menuNavigation?: {
    label: string;
    type: 'sub_menu' | 'main_menu';
    link?: string;
    newTab?: boolean;
    items?: { label: string; link: string; newTab?: boolean }[];
  }[];
}

type Layout = 'default' | 'no-sidebar' | 'basic';
type HeaderBrandLogoType = 'default' | 'compact';
type FooterType = 'default' | 'compact';
type Toggle = 'on' | 'off';

const useCustomize = create<{ customize: Partial<ThemeConfig>; setCustomize: (query: any) => void }>(set => ({
  customize: {
    showHeader: true,
    showFooter: true,
    footerType: 'default',
    showPromoteApp: true,
    showUserProfile: true,
    showSideBar: true,
    showSeoBoxs: true,
    showSelectCityInSuggestion: true,
    headerBrandLogoType: 'default',
    partnerLogo: '',
    partnerSubTitle: '',
    partnerTitle: '',
    showBrandLogoInHomePage: false,
    showPartnerLogoInPrimaryPlace: false,
    showConsultServices: true,
    showActivityProfile: true,
    showWaitingTimeStatistics: true,
    showGalleryProfile: true,
    showTermsAndConditions: true,
    bookMark: true,
    showShareApp: true,
    showSupplierRegister: true,
    showRateAndReviews: true,
    showSupport: true,
    showContribute: true,
    oauth: false,
    showFirstFreeTimeSearchResult: true,
    showAvailableTimeSearchResult: true,
    menuNavigation: [],
  },
  setCustomize: (query: any) => {
    if (!query) return;

    return set(state => ({
      ...state,
      customize: {
        ...state.customize,
        ...query,
      },
    }));
  },
}));

export default useCustomize;
